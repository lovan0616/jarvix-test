<template>
  <div class="full-page-dialog relation-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('schedule.project.dataSourceBindingManagement') }}
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
              :original-bound-status="files.order[0].dataframeStatus === 'BOUND'"
              :data-frame-options="dataFrameOptions"
              :checked-result="checkedResultOrder"
              :is-loading-data-frames="isLoadingDataFrames"
              :result-handler="{ hasError, bindable }"
              @resetCheckedResult="resetCheckedResultOrder"
            />

            <!-- 綁定共同資料 -->
            <bind-raw-data
              :files="files.raw_data"
              :parent-form-data="formRawData"
              :original-bound-status="files.raw_data[0].dataframeStatus === 'BOUND'"
              :data-frame-options="dataFrameOptions"
              :checked-result="checkedResultRawData"
              :is-loading-data-frames="isLoadingDataFrames"
              :result-handler="{ hasError, bindable }"
              @resetCheckedResult="resetCheckedResultRawdata"
              @resetFormData="resetRawdataSelectors"
            />

            <!-- 綁定額外限制 -->
            <bind-constraint
              :files="files.constraint"
              :parent-form-data="formConstraint"
              :original-bound-status="files.constraint"
              :data-frame-options="dataFrameOptions"
              :checked-result="checkedResultConstraint"
              :is-loading-data-frames="isLoadingDataFrames"
              :result-handler="{ hasError, bindable }"
              @resetCheckedResult="resetCheckedResultConstraints($event)"
              @resetFormData="resetConstraintSelectors"
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
        order: [],
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
      return this.dataFrames.map(item => ({ value: item.id, label: item.primaryAlias }))
    },
    defaultCheckedResult () {
      return {
        columns: [],
        totalRowCount: 0,
        applicableRowCount: 0,
        notApplicableRowCount: [],
        headerErrorMessage: '',
        bindable: false
      }
    }
  },
  async mounted () {
    if (this.isBoundWithDataSource) {
      this.datasourceId = this.projectInfo.datasourceId
      await this.fetchDataFrames()
      this.fetchDataBoundStatus()
    } else {
      this.fetchDataBoundStatus()
    }
  },
  methods: {
    fetchDataBoundStatus () {
      this.isLoadingDataBoundStatusInfo = true
      fetchDataBoundStatus(this.projectInfo.id)
        .then(files => {
          files.forEach(file => {
            const category = file.category

            if (category !== 'ORDER' && category !== 'RAW_DATA' && category !== 'CONSTRAINT') return

            // 設定個檔案資料
            this.files[category.toLowerCase()].push(file)

            // 設定 訂單表單 資料
            if (category === 'ORDER') {
              this.formOrder = file.dataframeStatus === 'BOUND' ? file.dataframeId : null
              this.checkedResultOrder = { ...this.defaultCheckedResult }
              return
            }

            // 設定表單資訊
            const pascaledCategory = this.snakeToPascal(category.toLowerCase())
            if (category === 'CONSTRAINT') {
              this.$set(this[`form${pascaledCategory}`], file.code, {
                dataframeId: file.dataframeStatus === 'BOUND' ? file.dataframeId : null,
                isSelected: false
              })
            } else if (category === 'RAW_DATA') {
              this.$set(this[`form${pascaledCategory}`], file.code, file.dataframeStatus === 'BOUND' ? file.dataframeId : null)
            }
            
            // 加入檢查資訊
            this.$set(this[`checkedResult${pascaledCategory}`], file.code, { ...this.defaultCheckedResult })
          })
        })
        .finally(() => this.isLoadingDataBoundStatusInfo = false)
    },
    fetchDataFrames () {
      this.isLoadingDataFrames = true
      return getDataFrameById(this.datasourceId)
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
      this.resetRawdataSelectors()
      this.resetConstraintSelectors()
    },
    resetRawdataSelectors () {
      for (const key in this.formRawData) this.formRawData[key] = null
    },
    resetConstraintSelectors () {
      for (const key in this.formConstraint) this.formConstraint[key] = {
        dataframeId: null,
        isSelected: false
      }
    },
    resetCheckedResultOrder () {
      this.checkedResultOrder = { ...this.defaultCheckedResult }
    },
    resetCheckedResultRawdata () {
      for (const key in this.checkedResultRawData) this.checkedResultRawData[key] = { ...this.defaultCheckedResult }
    },
    resetCheckedResultConstraints (codes) {
      if (codes && codes.length > 0) {
        codes.forEach(code => {
          this.checkedResultConstraint[code] = { ...this.defaultCheckedResult }
        })
        return
      }
      for (const key in this.checkedResultConstraint) this.checkedResultConstraint[key] = { ...this.defaultCheckedResult }
    },
    resetCheckedInfo () {
      this.resetCheckedResultRawdata()
      this.resetCheckedResultConstraints()
      this.resetCheckedResultOrder()
    },
    snakeToCamel,
    snakeToPascal
  }
}
</script>

<style lang="scss" scoped>
.relation-dialog {
  .dialog-container {
    width: 760px;
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
          margin-bottom: 8px;
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
          &-description {
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            margin: 8px 0 16px 0;
          }
        }
        &-field {
          display: flex;
          align-items: center;
          position: relative;
          font-size: 14px;
          line-height: 40px;
          .field-label {
            flex-basis: 180px;
            margin-right: 24px;
            text-align: right;
          }
          .default-select {
            padding-bottom: 10px;
            margin-right: 24px;
          }
        }
        &-action {
          margin-left: auto;
          .btn {
            display: inline-flex;
          }
        }
      }
    }
  }
}

/deep/ .spinner-block {
  padding: 0;
  margin-right: 10px;
  &.dataframe-loading-spinner, &.datasource-loading-spinner {
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