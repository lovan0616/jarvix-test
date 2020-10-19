<template>
  <el-popover
    :title="$t('notification.unfinishedTasks')"
    placement="bottom-end"
    width="300"
    popper-class="el-popover--task-notifier"
    trigger="click"
    @show="toggleIsOpen"
    @hide="toggleIsOpen"
  >
    <div>
      <div 
        v-show="processingTasks.length === 0" 
        class="task-notifier__content--empty">{{ $t('resultDescription.noData') }}</div>
      <div
        v-show="processingTasks.length > 0"
        class="task-notifier__content">
        <div
          v-for="(task, index) in processingTasks"
          :key="index"
          class="task-notifier__single-task"
        >
          <svg-icon 
            icon-class="spinner" 
            class="task__icon"/>
          <span class="task__title">{{ task.dataColumnPrimaryAlias }}</span>
          <span class="task__desc">{{ $t('editing.dataSource') }} : {{ task.dataSourceName }}</span>
          <span class="task__desc">{{ $t('editing.dataFrame') }} : {{ task.dataFramePrimaryAlias }}</span>
        </div>
      </div>
    </div>
    <div
      slot="reference"
      :class="{'is-open': isOpen}"
      class="task-messages__icon"
    >
      <el-badge 
        :value="processingTasks.length" 
        :hidden="processingTasks.length === 0">
        <svg-icon icon-class="task" />
      </el-badge>
    </div>
  </el-popover>
</template>

<script>
import { checkClusteringColumnStatus } from '@/API/DataSource'
import { mapState } from 'vuex'
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
    ...mapState('dataSource', ['processingDataColumnList'])
  },
  watch: {
    processingDataColumnList: {
      deep: true,
      handler (value) {
        clearInterval(this.intervalTimer)
        this.startTaskPolling()
      }
    }
  },
  mounted () {
    this.getBgColumnTasksFromStorage()
    this.startTaskPolling()
  },
  destroyed () {
    clearInterval(this.intervalTimer)
    if (this.processingDataColumnList.length > 0) {
      localStorage.setItem('bgColumnTasks', this.processingDataColumnList)
    } else {
      localStorage.removeItem('bgColumnTasks')
    }
  },
  methods: {
    startTaskPolling () {
      this.intervalTimer = setInterval(() => {
        this.getBgColumnTasksFromStorage()
      }, 10 * 1000)
    },
    getBgColumnTasksFromStorage () {
      for (let i = this.processingDataColumnList.length - 1; i >= 0; i--) {
        const taskId = this.processingDataColumnList[i]
        checkClusteringColumnStatus(taskId)
          .then(task => {
            switch (task.status) {
              case 'Ready':
              case 'Process':
                if (!this.processingTasks.find(item => item.taskId === task.taskId)) {
                  this.processingTasks.push(task)
                }
                break
              case 'Complete':
                this.$store.commit('dataSource/spliceProcessingDataColumnList', i)
                this.processingTasks.splice(this.processingTasks.findIndex(item => item.taskId === task.taskId), 1)
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
                break
              case 'Fail':
                this.$store.commit('dataSource/spliceProcessingDataColumnList', i)
                this.processingTasks.splice(this.processingTasks.findIndex(task => task.taskId === task.taskId), 1)
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
            this.$store.commit('dataSource/spliceProcessingDataColumnList', i)
            this.processingTasks.splice(this.processingTasks.findIndex(item => item.taskId === taskId), 1)
          })
      }
    },
    toggleIsOpen () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="scss" scoped>
.task-messages {
  &__icon {
    display: flex;
    justify-content: center;
    margin-right: 16px;
    height: 40px;
    width: 40px;
    font-size: 16px;
    letter-spacing: 0.05em;
    border: 1px solid #2D3033;
    border-radius: 5px;
    user-select: none;
    outline: none;
    cursor: pointer;
    line-height: 40px;
    &.is-open {
      color: $theme-color-primary;
    }
  }
}
/deep/ .el-badge {
  &__content {
    right: 0;
    color: $theme-text-color-dark;
    background-color: $theme-color-warning;
    border: none;
  }
}
</style>