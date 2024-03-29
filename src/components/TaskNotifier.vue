<template>
  <el-popover
    :title="$t('notification.unfinishedTasks')"
    placement="bottom-end"
    width="300"
    popper-class="el-popover--task-notifier"
    trigger="hover"
    @show="toggleIsOpen"
    @hide="toggleIsOpen"
  >
    <div>
      <div
        v-show="taskCount === 0"
        class="task-notifier__content--empty"
      >
        {{ $t('resultDescription.noData') }}
      </div>
      <div
        v-show="processingTasks.length > 0"
        class="task-notifier__content"
      >
        <div
          v-for="(task, index) in processingTasks"
          :key="index"
          class="task-notifier__single-task"
        >
          <svg-icon
            icon-class="spinner"
            class="task__icon"
          />
          <span class="task__title">{{ $t('editing.buildingNewColumn') }}</span>
          <ul class="task__desc">
            <li class="task__desc-item">
              <span class="task__desc-title">{{ $t('editing.groupName') }}</span>
              <span class="task__desc-content">{{ task.groupName }}</span>
            </li>
            <li class="task__desc-item">
              <span class="task__desc-title">{{ $t('editing.dataSource') }}</span>
              <span class="task__desc-content">{{ task.dataSourceName }}</span>
            </li>
            <li class="task__desc-item">
              <span class="task__desc-title">{{ $t('editing.dataFrame') }}</span>
              <span class="task__desc-content">{{ task.dataFramePrimaryAlias }}</span>
            </li>
            <li class="task__desc-item">
              <span class="task__desc-title">{{ $t('editing.columnName') }}</span>
              <span class="task__desc-content">{{ task.dataColumnPrimaryAlias }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-show="tableDataCSVDownloadList.length > 0"
        class="task-notifier__content"
      >
        <div
          v-for="(task, index) in tableDataCSVDownloadList"
          :key="index"
          class="task-notifier__single-task"
        >
          <svg-icon
            icon-class="spinner"
            class="task__icon"
          />
          <div class="task__content">
            <span class="task__title task__title--highlight">
              {{ task.question }}
            </span>
            {{ $t('editing.dataDownloading') }}
          </div>
        </div>
      </div>
    </div>
    <div
      slot="reference"
      :class="{'is-open': isOpen}"
      class="task-notifier__icon"
    >
      <el-badge
        :value="taskCount"
        :hidden="taskCount === 0"
      >
        <svg-icon icon-class="task" />
      </el-badge>
    </div>
  </el-popover>
</template>

<script>
import { getComponentDataCSV } from '@/API/NewAsk'
import { checkClusteringColumnStatus } from '@/API/DataSource'
import { mapState, mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'TaskNotifier',
  data: () => {
    return {
      intervalTimer: [],
      processingTasks: [],
      isOpen: false
    }
  },
  computed: {
    ...mapState('dataSource', ['processingDataColumnList']),
    ...mapGetters('dataSource', ['getOwnProcessingTasks', 'currentDataFrameId']),
    ...mapGetters('userManagement', ['getCurrentAccountId']),
    ...mapState('dataFrameAdvanceSetting', ['isInit']),
    ...mapState('result', ['tableDataCSVDownloadMaximumCount', 'tableDataCSVDownloadList']),
    taskCount () {
      return this.processingTasks.length + this.tableDataCSVDownloadList.length
    },
    CSVDownloadProcessingTaskCount () {
      return this.tableDataCSVDownloadList.filter(task => task.status === 'Process').length
    }
  },
  watch: {
    getOwnProcessingTasks (newList, oldList) {
      if (newList.length > oldList.length) {
        // task增加時，清掉timer並馬上詢問後開始polling，讓未完成項目數立即更新
        clearInterval(this.intervalTimer)
        this.getBgColumnTasksFromStorage()
        this.startTaskPolling()
      }
    },
    getCurrentAccountId () {
      this.processingTasks = []
      this.checkBgColumnTasks()
    },
    processingDataColumnList (value) {
      localStorage.setItem('bgColumnTasks', JSON.stringify(value))
    },
    tableDataCSVDownloadList (newList, oldList) {
      let availableDownloadingCapacity = this.tableDataCSVDownloadMaximumCount - this.CSVDownloadProcessingTaskCount
      let readyList = newList.filter(task => task.status === 'Ready')
      let downloadingTaskNumber = Math.min(readyList.length, availableDownloadingCapacity)
      for (let i = 0; i < downloadingTaskNumber; i++) {
        readyList[i].status = 'Process'
        getComponentDataCSV(readyList[i].componentId)
          .then(({ data }) => {
            this.downloadCSV(readyList[i].question, data)
          })
          .catch(() => {})
          .finally(() => {
            let taskIndex = this.tableDataCSVDownloadList.find(item => item.componentId === readyList[i].componentId)
            this.tableDataCSVDownloadList.splice(taskIndex, 1)
          })
      }
    }
  },
  mounted () {
    this.checkBgColumnTasks()
    this.getBgColumnTasksFromStorage()
    this.startTaskPolling()
  },
  destroyed () {
    clearInterval(this.intervalTimer)
  },
  methods: {
    startTaskPolling () {
      this.intervalTimer = setInterval(() => {
        this.getBgColumnTasksFromStorage()
      }, 10 * 1000)
    },
    getBgColumnTasksFromStorage () {
      for (let i = this.getOwnProcessingTasks.length - 1; i >= 0; i--) {
        const taskId = this.getOwnProcessingTasks[i].taskId
        const groupName = this.getOwnProcessingTasks[i].groupName
        checkClusteringColumnStatus(taskId)
          .then(task => {
            switch (task.status) {
              case 'Ready':
              case 'Process':
                if (!this.processingTasks.find(item => item.taskId === taskId)) {
                  this.processingTasks.push({ ...task, taskId, groupName })
                }
                break
              case 'Complete':
                this.$store.commit('dataSource/spliceProcessingDataColumnList', this.processingDataColumnList.findIndex(item => item.taskId === taskId))
                this.processingTasks.splice(this.processingTasks.findIndex(item => item.taskId === taskId), 1)
                setTimeout(() => {
                  Message({
                    message: this.$t('clustering.buildingClusteringColumnSuccess', {
                      columnName: task.dataColumnPrimaryAlias
                    }) + '<br>' + this.$t('clustering.clusteringColumnOriginFrom', {
                      dataSourceName: task.dataSourceName,
                      dataFrameName: task.dataFramePrimaryAlias
                    }),
                    dangerouslyUseHTMLString: true,
                    type: 'success',
                    duration: 0,
                    showClose: true
                  })
                }, 0)
                // 若在智能分析頁面且也正在使用同一個資料表，則通知它重拿
                if (this.$route.query.dataFrameId === 'all' || (this.$route.query.dataFrameId && Number(this.$route.query.dataFrameId) === task.dataFrameId)) {
                  this.$store.commit('dataSource/setShouldDataFrameDataRefetchDataColumn', task.dataFrameId)
                }
                // 若基表設定已暫存同一資料表的欄位，則通知它重拿
                if (this.currentDataFrameId === task.dataFrameId && this.isInit) {
                  this.$store.commit('dataFrameAdvanceSetting/toggleIsInit', false)
                  this.$store.commit('dataFrameAdvanceSetting/setShouldAdvanceDataFrameSettingRefetchDataColumn', true)
                }
                break
              case 'Fail':
                this.$store.commit('dataSource/spliceProcessingDataColumnList', this.processingDataColumnList.findIndex(item => item.taskId === taskId))
                this.processingTasks.splice(this.processingTasks.findIndex(item => item.taskId === taskId), 1)
                setTimeout(() => {
                  Message({
                    message: this.$t('clustering.buildingClusteringColumnFailed', {
                      columnName: task.dataColumnPrimaryAlias
                    }) + '<br>' + this.$t('clustering.clusteringColumnOriginFrom', {
                      dataSourceName: task.dataSourceName,
                      dataFrameName: task.dataFramePrimaryAlias
                    }),
                    dangerouslyUseHTMLString: true,
                    type: 'error',
                    duration: 0,
                    showClose: true
                  })
                }, 0)
            }
          })
          .catch(err => {
            this.$store.commit('dataSource/spliceProcessingDataColumnList', this.processingDataColumnList.findIndex(item => item.taskId === taskId))
            this.processingTasks.splice(this.processingTasks.findIndex(item => item.taskId === taskId), 1)
          })
      }
    },
    toggleIsOpen () {
      this.isOpen = !this.isOpen
    },
    checkBgColumnTasks () {
      const prevBgColumnTasks = localStorage.getItem('bgColumnTasks')
      if (!prevBgColumnTasks) {
        this.$store.commit('dataSource/setProcessingDataColumnList', [])
        localStorage.setItem('bgColumnTasks', '[]')
        return
      }
      const parsedPrevBgColumnTasks = JSON.parse(prevBgColumnTasks)
      if (parsedPrevBgColumnTasks.length >= 0) {
        this.$store.commit('dataSource/setProcessingDataColumnList', parsedPrevBgColumnTasks)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.task-notifier {
  &__icon {
    cursor: pointer;
    display: flex;
    font-size: 16px;
    justify-content: center;
    letter-spacing: 0.05em;
    outline: none;
    user-select: none;
    width: 30px;

    &.is-open {
      color: $theme-color-primary;
    }
  }
}

::v-deep .el-badge {
  &__content {
    background-color: $theme-color-warning;
    border: none;
    border-radius: 50%;
    color: $theme-text-color-dark;
    font-size: 10px;
    height: 16px;
    line-height: 16px;
    padding: 0 4px;
    right: 0;
  }
}
</style>
