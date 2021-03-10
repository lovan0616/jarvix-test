<template>
  <div class="full-page-dialog relation-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('schedule.project.dataSourceReRelation') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="$emit('close', shouldRefetchProjectsThereafter)"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="relation-container">

        <!-- 管理資料源 -->
        <bind-data-source
          :project-info="projectInfo"
          :datasource-id.sync="datasourceId"
          @rebound="reboundDataSource"
        />
        <spinner
          v-if="isLoadingDataBoundStatusInfo"
          :title="$t('editing.loading')"
        />
        <template v-else>

          <!-- 管理資料表 -->
          <section class="relation-container__section">
            <div class="relation-container__section-title">Step2: {{ $t('editing.chooseDataFrame') }}</div>

            <!-- 綁定訂單 -->
            <bind-order
              :form-data="formOrder"
              :data-frame-options="dataFrameOptions"
              :checked-result="checkedResultOrder"
              :is-loading-data-frames="isLoadingDataFrames"
              :result-handler="{ hasError, bindable }"
            />

            <!-- 綁定共同資料 -->
            <bind-raw-data
              :files="files.raw_data"
              :form-data="formRawData"
              :data-frame-options="dataFrameOptions"
              :checked-result="checkedResultRawData"
              :is-loading-data-frames="isLoadingDataFrames"
              :result-handler="{ hasError, bindable }"
            />

            <!-- 綁定額外限制 -->
            <bind-constraint
              :files="files.constraint"
              :form-data="formConstraint"
              :data-frame-options="dataFrameOptions"
              :checked-result="checkedResultConstraint"
              :is-loading-data-frames="isLoadingDataFrames"
              :result-handler="{ hasError, bindable }"
            />
          </section>
        </template>
      </div>
      <div class="dialog-footer">
        <div class="dialog-button-block">
          <button
            class="btn btn-outline"
            @click="$emit('close', shouldRefetchProjectsThereafter)"
          >{{ $t('editing.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDataFrameById } from '@/API/DataSource'
import { fetchDataBoundStatus } from '@/schedule/API/Project'
import { snakeToCamel, snakeToPascal } from '@/schedule/utils/mixins'
import BindDataSource from './BindDataSource'
import BindOrder from './BindOrder'
import BindRawData from './BindRawData'
import BindConstraint from './BindConstraint'
import BindingCheckedInfo from './BindingCheckedInfo'
import DecideDialog from '@/components/dialog/DecideDialog'

export default {
  name: 'ScheduleProjectRelationDialog',
  components: {
    BindDataSource,
    BindOrder,
    BindRawData,
    BindConstraint,
    BindingCheckedInfo,
    DecideDialog
  },
  props: {
    projectInfo: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data: () => {
    return {
      formOrder: null,
      formRawData: {},
      formConstraint: {},
      files: {
        raw_data: [],
        constraint: []
      },
      datasourceId: null,
      dataFrames: [],
      isLoadingDataBoundStatusInfo: false,
      isLoadingDataFrames: false,
      checkedResultOrder: {},
      checkedResultRawData: {},
      checkedResultConstraint: {},
      shouldRefetchProjectsThereafter: false
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceList']),
    isBoundWithDataSource () {
      return this.projectInfo.datasourceStatus === 'Bound'
    },
    dataFrameOptions () {
      const options = this.dataFrames.map(item => ({ value: item.id, label: item.primaryAlias }))
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    },
    defaultCheckedResult () {
      return {
        columns: [],
        applicableRowCount: 0,
        notApplicableRowCount: [],
        headerErrorMessage: '',
        bindable: false
      }
    }
  },
  created () {
    if (this.isBoundWithDataSource) {
      this.datasourceId = this.projectInfo.datasourceId
      this.fetchDataFrames()
    }
    this.fetchDataBoundStatus()
  },
  methods: {
    fetchDataBoundStatus () {
      this.isLoadingDataBoundStatusInfo = true
      fetchDataBoundStatus(this.projectInfo.id)
        .then(files => {
          files.forEach(file => {
            const category = file.category

            // 設定 訂單表單 資料
            if (category === 'ORDER') {
              this.formOrder = file.dataframeStatus === 'BOUND' ? file.dataframeId : null
              this.checkedResultOrder = this.defaultCheckedResult
              return
            }

            // 設定 RawDara, Constraint 區塊資料
            this.files[category.toLowerCase()].push(file)

            // 設定表單資訊
            const pascaledCategory = this.snakeToPascal(category.toLowerCase())
            this.$set(this[`form${pascaledCategory}`], file.code, file.dataframeStatus === 'BOUND' ? file.dataframeId : null)
            
            // 加入檢查資訊
            this.$set(this[`checkedResult${pascaledCategory}`], file.code, { ...this.defaultCheckedResult })
          })
        })
        .finally(() => this.isLoadingDataBoundStatusInfo = false)
    },
    fetchDataFrames () {
      this.isLoadingDataFrames = true
      getDataFrameById(this.datasourceId)
        .then(dataFrames => {
          this.dataFrames = dataFrames
          this.resetDataFrameSelectors()
        })
        .catch(() => {})
        .finally(() => this.isLoadingDataFrames = false)
    },
    hasError (info, fileCode = null) {
      if (fileCode) {
        if (!info.hasOwnProperty(fileCode)) return false
        return info[fileCode].headerErrorMessage || info[fileCode].notApplicableRowCount > 0
      } else {
        return info.headerErrorMessage || info.notApplicableRowCount > 0
      }
    },
    bindable (info) {
      console.log(info)
      return !info.hasOwnProperty('headerErrorMessage')
    },
    reboundDataSource () {
      this.fetchDataFrames()
      this.resetDataFrameSelectors()
      this.resetCheckedInfo()
      this.shouldRefetchProjectsThereafter = true
    },
    resetDataFrameSelectors () {
      this.formOrder = null
      for (const key in this.formRawData) this.formRawData[key] = null
      for (const key in this.formConstraint) this.formConstraint[key] = null
    },
    resetCheckedInfoOrder () {
      this.checkedResultOrder = this.defaultCheckedResult
    },
    resetCheckedInfoRawdata () {
      for (const key in this.checkedResultRawData) this.checkedResultRawData[key] = this.defaultCheckedResult
    },
    resetCheckedInfoConstraints () {
      for (const key in this.checkedResultConstraint) this.checkedResultConstraint[key] = this.defaultCheckedResult
    },
    resetCheckedInfo () {
      this.resetCheckedInfoRawdata()
      this.resetCheckedInfoConstraints()
      this.resetCheckedInfoOrder()
    },
    snakeToCamel,
    snakeToPascal
  }
}
</script>

<style lang="scss" scoped>
.relation-dialog {
  .dialog-container {
    width: 752px;
  }
  /deep/ .relation-container {
    &__section {
      max-height: 60vh;
      padding: 24px;
      background: rgba(50, 58, 58, 0.95);
      border-radius: 5px;
      margin-bottom: 12px;
      overflow: auto;
      &-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .form {
        &:not(:last-child) {
          margin-bottom: 16px;
        }
        &-label {
          display: flex;
          align-items: center;
          margin-bottom: 14px;
          &::before {
            content: '';
            margin-right: 8px;
            width: 8px;
            height: 8px;
            background-color: $theme-color-primary;
          }
        }
        &-fields {
          padding: 8px 16px;
          background: rgba(67, 76, 76, 0.95);
          border-radius: 8px;
        }
        &-field {
          display: flex;
          align-items: flex-start;
          font-size: 14px;
          line-height: 40px;
          .field-label {
            flex-basis: 150px;
            margin-right: 24px;
            text-align: right;
          }
          /deep/ .default-select {
            padding-bottom: 10px;
            margin-right: 24px;
            .el-input .el-input__inner {
              color: #CCC;
            }
          }
        }
        &-action {
          margin-left: auto;
        }
      }
    }
  }
}

/deep/ .spinner-block {
  padding: 0;
  margin-right: 10px;
  &.dataframe-loading-spinner {
    width: 188px;
    height: 50.5px;
    padding: 0;
    font-size: 14px;
    .spinner-container {
      display: flex;
      align-items: center;
      .spinner-circle {
        margin-right: 16px;
      }
      .spinner-title {
        margin-top: 0;
      }
    }
  }
}

/deep/ .btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>