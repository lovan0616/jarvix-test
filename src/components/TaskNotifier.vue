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
      <spinner v-show="isLoading"/>
      <div 
        v-show="!isLoading && processingTasks.length === 0" 
        class="task-notifier__content--empty">{{ $t('resultDescription.noData') }}</div>
      <div
        v-show="!isLoading && processingTasks.length > 0"
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
      unfinishedTasks: [],
      isLoading: true,
      isOpen: false
    }
  },
  computed: {
    ...mapState('dataSource', ['processingDataColumnList'])
  },
  mounted () {
    this.getBgColumnTasksFromStorage()
    this.intervalTimer = setInterval(() => {
      this.getBgColumnTasksFromStorage()
    }, 5 * 1000)
  },
  destroyed () {
    clearInterval(this.intervalTimer)
    this.$store.commit('dataSource/setProcessingDataColumnList', this.processingTasks.map(task => task.taskId))
    if (this.processingTasks.length > 0) {
      localStorage.setItem('bgColumnTasks', this.processingTasks.map(task => task.taskId))
    } else {
      localStorage.removeItem('bgColumnTasks')
    }
  },
  methods: {
    getBgColumnTasksFromStorage () {
      const taskPromises = this.processingDataColumnList.map(taskId => checkClusteringColumnStatus(taskId))
      Promise.all(taskPromises)
        .then(response => {
          this.unfinishedTasks = []
          response.forEach(task => {
            switch (task.status) {
              case 'Ready':
              case 'Process':
                this.unfinishedTasks.push(task)
                break
              case 'Complete':
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
          this.isLoading = true
          this.processingTasks = [ ...this.unfinishedTasks ]
          this.$store.commit('dataSource/setProcessingDataColumnList', this.processingTasks.map(task => task.taskId))
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false
        })
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