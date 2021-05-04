<template>
  <div class="management-info-page flow-detail">
    <bread-crumb :name="flowInfo.name" />
    <div class="page-title-row">
      <div class="title">
        {{ $t('sideNav.flowDetail') }}
      </div>
      <div class="title--right">
        <flow-update-status
          :flow-info="flowInfo"
          :is-flow-updating="isFlowUpdating"
        />
        <flow-action-dropdown
          :is-show-dropdown-arrow="true"
          :is-flow-updating="isFlowUpdating"
          shape="button"
          @action="onClickFlowAction"
        />
      </div>
    </div>
    <spinner
      v-if="isLoading" 
      :title="$t('editing.loading')"
    />
    <section v-else>
      <!-- 流程名稱 / ID -->
      <div class="info-block">
        <div class="info-block__title">
          {{ $t('modelFlow.modelFlowNameId') }}
        </div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('modelFlow.name') }}:</div>
            <div class="info__text">{{ flowInfo.name }}</div>
          </div>
          <div class="info__row">
            <div class="info__label">{{ $t('modelFlow.id') }}:</div>
            <div class="info__text">{{ flowInfo.id }}</div>
          </div>
        </div>
      </div>
      <!-- 資料的來源 / 輸出 -->
      <div class="info-block">
        <div class="info-block__title">
          {{ $t('modelFlow.sourceAndTarget') }}
        </div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('editing.dataSource') }}:</div>
            <div class="info__text">{{ flowInfo.targetDataSourceName }}</div>
          </div>
          <div class="info__row">
            <div class="info__label">{{ $t('modelFlow.sourceDataFrame') }}:</div>
            <div class="info__text">{{ flowInfo.sourceDataFrameName || '-' }}</div>
          </div>
          <div class="info__row">
            <div class="info__label">{{ $t('modelFlow.targetDataFrame') }}:</div>
            <div class="info__text">{{ flowInfo.targetDataFrameName }}</div>
          </div>
        </div>
      </div>
      <!-- 模型名稱 -->
      <div class="info-block">
        <div class="info-block__title">
          {{ $t('modelFlow.adoptedModel') }}
        </div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('model.modelName') }}:</div>
            <div class="info__text">{{ flowInfo.modelName }}</div>
          </div>
        </div>
      </div>
      <!-- Input 參數 -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.inputParameters') }}</div>
        <div class="info-block__content">
          <div class="table-header">
            <div class="info__label info__cell ">{{ $t('modelFlow.modelInputParameter') }}</div>
            <div class="info__label info__cell ">{{ $t('modelFlow.correspondingDataFrameColumnName') }}</div>
          </div>
          <div 
            v-for="(item, index) in flowInfo.ioArgs.input"
            :key="index"
            class="table-row">
            <div class="info__text info__cell">{{ item.modelColumnName }}({{ item.columnStatsType }})</div>
            <div class="info__text info__cell">{{ item.dataColumnName || '-' }}</div>
          </div>
        </div>
      </div>
      <!-- Output 參數 -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('model.outputParameters') }}</div>
        <div class="info-block__content">
          <div class="table-header">
            <div class="info__label info__cell ">{{ $t('modelFlow.modelOutputParameter') }}</div>
            <div class="info__label info__cell ">{{ $t('modelFlow.outputDataFrameColumnName') }}</div>
          </div>
          <div 
            v-for="(item, index) in flowInfo.ioArgs.output"
            :key="index"
            class="table-row">
            <div class="info__text info__cell">{{ item.modelColumnName }}({{ item.columnStatsType }})</div>
            <div class="info__text info__cell">{{ item.dataColumnName }}</div>
          </div>
        </div>
      </div>
      <!-- 觸發更新模式 -->
      <div class="info-block">
        <div class="info-block__title">
          {{ $t('modelFlow.triggerUpdateType') }}
        </div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('modelFlow.updateMode') }}:</div>
            <div class="info__text">{{ triggerTypeLabel }}</div>
          </div>
        </div>
      </div>
      <!-- 建立資料 -->
      <div class="info-block">
        <div class="info-block__title">{{ $t('modelFlow.createInfo') }}</div>
        <div class="info-block__content">
          <div class="info__row">
            <div class="info__label">{{ $t('modelFlow.createdTime') }}:</div>
            <div class="info__text">{{ timeToDateTime(flowInfo.createdAt) }}</div>
          </div>
          <div class="info__row">
            <div class="info__label">{{ $t('modelFlow.creator') }}:</div>
            <div class="info__text">{{ flowInfo.createdBy }}</div>
          </div>
        </div>
      </div>
    </section>
    <decide-dialog
      v-if="isShowDeleteDialog"
      :title="$t('modelFlow.deleteConfirmText')"
      :is-processing="isDeleting"
      type="delete"
      class="flow-delete-dialog"
      @closeDialog="closeDeleteDialog"
      @confirmBtn="deleteModelFlow"
    />
  </div>
</template>
<script>
import InputVerify from '@/components/InputVerify'
import BreadCrumb from './components/BreadCrumb.vue'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import FlowUpdateStatus from './components/FlowUpdateStatus'
import FlowActionDropdown from './components/FlowActionDropdown'
import { getModelFlowDetail } from '@/API/ModelFlow'

export default {
  name: 'FlowDetail',
  inject: ['$validator'],
  components: {
    InputVerify,
    BreadCrumb,
    DecideDialog,
    WritingDialog,
    FlowActionDropdown,
    FlowUpdateStatus
  },
  data () {
    return {
      isLoading: false,
      isDeleting: false,
      isShowDeleteDialog: false,
      flowInfo: {},
      timeoutFunction: null
    }
  },
  computed: {
    flowId () {
      return this.$route.params['flow_id']
    },
    isFlowUpdating () {
      return this.flowInfo.targetDataFrameStatusType === 'Process'
    },
    triggerTypeLabel () {
      switch (this.flowInfo.triggerType) {
        case 'MANUAL':
        case 'AUTOMATIC':
          return this.$t(`modelFlow.triggerTypes.${this.flowInfo.triggerType.toLowerCase()}`)
        default:
          return '-'
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    this.clearTimer()
  },
  methods: {
    fetchData (showSpinner = true) {
      if (showSpinner) this.isLoading = true
      getModelFlowDetail(this.flowId)
        .then(flowInfo => {
          this.flowInfo = flowInfo
          this.$store.commit('modelFlowManagement/updateCurrentFlowInfo', flowInfo)
          this.clearTimer()
          if (this.isFlowUpdating) {
            this.timeoutFunction = window.setTimeout(() => {
              this.fetchData(false)
            }, 5000)
          }
        })
        .finally(() => {
          if (showSpinner) this.isLoading = false
        })
    },
    closeDeleteDialog () {
      this.isShowDeleteDialog = false
    },
    onClickFlowAction (actionName) {
      switch (actionName) {
        case 'manulUpdate':
          this.updateModelFlow()
          return
        case 'deleteModelFlow':
          this.isShowDeleteDialog = true
          return
      }
    },
    updateModelFlow () {
      this.$store.dispatch('modelFlowManagement/updateModelFlow', this.flowInfo.id)
        .then(() => {
          this.fetchData()
        })
    },
    deleteModelFlow () {
      this.$store.dispatch('modelFlowManagement/deleteModelFlow', this.flowInfo.id)
        .then(() => {
          this.$router.push({name: 'FlowList'})
        }).finally(() => {
          this.isShowDeleteDialog = false 
        })
    },
    clearTimer () {
      if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
    }
  }
}
</script>
<style lang="scss" scoped>
.page-title-row {
  .title {
    &--right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}

.info-block {
  .output-df-name {
    margin-bottom: 24px;
  }
}

.model-delete-dialog {
  >>> .dialog-content-wrapper > .content {
    color: #FFF;
  }
}
</style>