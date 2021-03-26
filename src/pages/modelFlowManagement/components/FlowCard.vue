<template>
  <div class="flow-card">
    <div class="flow-card__header">
      <div class="flow-title">
        {{ flowInfo.name }}
      </div>
      <div class="flow-id">
        (ID: {{ flowInfo.id }})
      </div> 
      <div class="flow-record flow-text">
        {{ $t('modelFlow.createdInfo', { name: flowInfo.createdBy, time: timeToDateTime(flowInfo.createdAt) }) }}
      </div> 
    </div>
    <div class="flow-card__content">
      <div class="flow-card__list">
        <div class="flow-label">{{ $t('modelFlow.updatedInformation') }}：</div>
        <div class="flow-text">{{ flowInfo.targetDataFrameUpdatedAt && timeToDateTime(flowInfo.targetDataFrameUpdatedAt) }}</div>
      </div>
      <div class="flow-card__list">
        <div class="flow-label">{{ $t('modelFlow.outputResult') }}：</div>
        <div class="flow-text-wrapper">
          <svg-icon 
            icon-class="data-source"
            class="icon" /> 
          <div class="flow-text flow-text--underline">{{ flowInfo.targetDataSource }}</div>
        </div>
        <div class="flow-text-wrapper">
          <svg-icon 
            icon-class="table"
            class="icon" /> 
          <div class="flow-text">{{ flowInfo.targetDataFrameName }}</div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlowCard',
  props: {
    flowInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.flow-card {
  padding: 20px;
  border-radius: 5px;
  border: 2px solid #1C292B;
  background: #1C292B;
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .flow-title {
      margin-right: 4px;
      font-size: 18px;
      color: #FFFFFF;
    }

    .flow-id {
      font-size: 14px;
      color: #DDDDDD;
    }

    .flow-record {
      flex: 1;
      text-align: right;
    }
  }

  &__list {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  .flow-text {
    font-size: 12px;
    color: #999999;

    &--underline {
      text-decoration: underline;
    }
  }

  .flow-label {
    font-size: 12px;
    font-weight: 600;
    color: #999999;
  }

  .flow-text-wrapper {
    display: flex;
    align-items: center;

    .icon {
      margin-right: 6px;
      font-size: 12px;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>