<template>
  <div :class="getFlowClasses">
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
        <div class="flow-info-wrapper">
          <div class="flow-label">{{ $t('modelFlow.updateMode') }}：</div>
          <div class="flow-text">
            <!-- Next Sprint -->
            {{ $t('modelFlow.notUpdate') }}
          </div>
        </div>
        <div class="flow-info-wrapper update-status-block">
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
            <span class="flow-update-status">
              {{ flowUpdateStatus }}
            </span>
          </div>
        </div>
        <div class="flow-function-wrapper">
          <!-- Next Sprint -->
          <!-- <span class="flow-function">
            <a class="link">功能管理</a>
          </span> -->
          <span class="flow-function">
            <a class="link">{{ $t('modelFlow.function') }}</a>
            <dropdown-select
              :bar-data="flowFunctions" 
              @switchDialogName="$emit('action', $event)"
            />
          </span>
        </div>
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
import DropdownSelect from '@/components/select/DropdownSelect'

export default {
  name: 'FlowCard',
  components: {
    DropdownSelect
  },
  props: {
    flowInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
    }
  },
  computed: {
    getFlowClasses () {
      return ['flow-card', this.isFlowDisabled ? 'is-disabled' : null]
    },
    isFlowDisabled () {
      return this.isFlowUpdating
    },
    isFlowUpdating () {
      return this.flowInfo.targetDataFrameStatusType === 'Process'
    },
    flowUpdateTime () {
      switch (this.flowInfo.targetDataFrameStatusType) {
        case 'Complete':
        case 'Fail':
          return this.flowInfo.targetDataFrameUpdatedAt && this.timeToDateTime(this.flowInfo.targetDataFrameUpdatedAt)
        case 'Temp':
        case 'Process':
        default:
          return ''
      }
    },
    flowUpdateStatus () {
      return this.$t(`modelFlow.modelFlowUpdateStatus.${(this.flowInfo.targetDataFrameStatusType).toLowerCase()}`)
    },
    flowFunctions () {
      return [
        { title: 'modelFlow.immediatelyUpdate', dialogName: 'manulUpdate' },
        { title: 'modelFlow.deleteModelFlow', dialogName: 'deleteModelFlow' }
      ]
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

  &.is-disabled {
    background: rgba(28, 41, 43, 0.2);
    cursor: not-allowed;
    [class^="flow"] {
      color: rgba(153, 153, 153, 0.4);
    }
    .flow-function .link {
      color: rgba(42, 210, 226, 0.4);
    }
    .update-status-block {
      [class^="flow"] {
        color: rgba(153, 153, 153, 0.9);
      }
    }
    .flow-function {
      pointer-events: none;
    }
  }

  .flow-text {
    font-size: 12px;
    color: #999999;

    &--underline {
      text-decoration: underline;
    }

    .spinner-block {
      padding: 0;
      margin-right: 8px;
    }
  }

  .flow-label {
    font-size: 12px;
    font-weight: 600;
    color: #999999;
  }

  .flow-info-wrapper {
    display: flex;
    margin-right: 12px;

    .flow-text {
      display: flex;
      .flow-update-time {
        margin-right: 8px;
      }
    }
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

  .flow-function-wrapper {
    margin-left: auto;
    .flow-function {
      position: relative;
      &:not(:first-child) {
        padding-left: 20px;
        &::before {
          content: '';
          position: absolute;
          top: 4.5px;
          left: 8px;
          height: 16px;
          width: 1px;
          background-color: #9DBDBD;
        }
      }
      &:hover {
        .dropdown-select {
          visibility: visible;
        }
      }
    }

    /deep/ .dropdown-select {
      visibility: hidden;
      &:hover {
        visibility: visible;
      }
      .dropdown-select-box {
        box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
        top: 24px;
        left: unset;
        right: -30px;
        .dropdown-flex {
          padding: 0 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>