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
            {{ $t(`modelFlow.triggerTypes.${flowInfo.triggerType.toLowerCase()}`) }}
          </div>
        </div>
        <flow-update-status
          :flow-info="flowInfo"
          :is-flow-updating="isFlowUpdating"
        />
        <div class="flow-function-wrapper">
          <span class="flow-function">
            <a
              class="link"
              @click="goToFlowDetailPage(flowInfo.id)"
            >{{ $t('modelFlow.settingManagement') }}</a>
          </span>
          <flow-action-dropdown
            :is-flow-updating="isFlowUpdating"
            class="flow-function"
            @action="$emit('action', $event)"
          />
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
import FlowUpdateStatus from './FlowUpdateStatus'
import FlowActionDropdown from './FlowActionDropdown'
import { mapGetters } from 'vuex'

export default {
  name: 'FlowCard',
  components: {
    FlowUpdateStatus,
    FlowActionDropdown
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
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
    getFlowClasses () {
      return ['flow-card', this.isFlowDisabled ? 'is-disabled' : null]
    },
    isFlowDisabled () {
      return this.isFlowUpdating
    },
    isFlowUpdating () {
      return this.flowInfo.targetDataFrameStatusType === 'Process'
    }
  },
  methods: {
    goToFlowDetailPage (flow_id) {
      this.$router.push({
        name: 'FlowDetail',
        params: {
          account_id: this.getCurrentAccountId,
          group_id: this.getCurrentGroupId,
          flow_id
        }
      })
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
    [class^="flow"] {
      color: rgba(153, 153, 153, 0.4);
    }
    /deep/ .update-status-block {
      [class^="flow"] {
        color: rgba(153, 153, 153, 0.9);
      }
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
    display: flex;
    margin-left: auto;
    .flow-function {
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
    }
  }
}
</style>