<template>
  <div class="update-status-block">
    <div class="flow-label">{{ $t('modelFlow.updatedInformation') }}：</div>
    <div class="flow-text">
      <spinner 
        v-if="isFlowUpdating" 
        size="14" />
      <span
        v-if="flowUpdateTime"
        class="flow-update-time">
        {{ flowUpdateTime }}
      </span>
      <span>
        {{ flowUpdateStatus }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlowUpdateStatus',
  props: {
    flowInfo: {
      type: Object,
      default: () => {}
    },
    isFlowUpdating: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    flowUpdateTime () {
      switch (this.flowInfo.targetDataFrameStatusType) {
        case 'Enable':
        case 'Fail':
        case 'Warn':
          return this.flowInfo.targetDataFrameUpdatedAt && this.timeToDateTime(this.flowInfo.targetDataFrameUpdatedAt)
        default:
          return null
      }
    },
    flowUpdateStatus () {
      switch (this.flowInfo.targetDataFrameStatusType) {
        case 'Complete':
        case 'Enable':
        case 'Fail':
        case 'Temp':
        case 'Process':
        case 'Disable':
          return this.$t(`modelFlow.modelFlowUpdateStatus.${(this.flowInfo.targetDataFrameStatusType).toLowerCase()}`)
        default:
          return this.flowInfo.targetDataFrameStatusType
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.update-status-block {
  display: flex;
  margin-right: 12px;
  .flow-label {
    font-size: 12px;
    font-weight: 600;
    color: #999999;
  }

  .flow-text {
    display: flex;
    font-size: 12px;
    color: #999999;

    .flow-update-time {
      margin-right: 8px;
    }
    .spinner-block {
      padding: 0;
      margin-right: 8px;
    }
  }
}
</style>