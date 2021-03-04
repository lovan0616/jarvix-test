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
        <section class="relation-container__section">
          <div class="relation-container__section-title">Step1: {{ $t('schedule.project.chooseDataSource') }}({{ $t('editing.isRequired') }})</div>
          <div class="form">
            <div class="form-fields">
              <div class="form-field">
                <div class="field-label">
                  {{ $t('schedule.project.dataSourceName') }}
                </div>
                <default-select 
                  v-model="datasourceId"
                  :options="dataSourceOptions"
                />
                <button
                  :disabled="isBindingDataSource"
                  class="btn btn-default btn-rebind-ds"
                  @click="rebindDataSource"
                >
                  <spinner 
                    v-show="isBindingDataSource" 
                    size="10"/>
                  {{ $t('schedule.binding.rebind') }}
                </button>
              </div>
            </div>
          </div>
        </section>
        <spinner
          v-if="isLoadingFilesInfo"
          title="載入檔案中"
        />
        <template v-else>
          <!-- 管理資料表 -->
          <section class="relation-container__section">
            <div class="relation-container__section-title">Step2: {{ $t('editing.chooseDataFrame') }}</div>
            <!-- 綁定訂單 -->
            <div class="form">
              <div class="form-label">
                {{ $t('schedule.binding.globalSetting') }}（{{ $t('editing.isRequired') }}）
                <div class="form-action">
                  <button
                    v-if="checkedResultOrder.bindable"
                    :disabled="isBindOrderBtnDisabled"
                    class="btn btn-default"
                    @click="bindOrder">
                    <spinner 
                      v-show="isBindingOrder" 
                      size="10"/>
                    {{ $t('schedule.binding.bind') }}
                  </button>
                  <button
                    v-else
                    :disabled="isCheckOrderBtnDisabled"
                    class="btn btn-default"
                    @click="checkOrder">
                    <spinner 
                      v-show="isCheckingOrder" 
                      size="10"/>
                    檢查
                    <!-- {{ $t('schedule.binding.bind') }} -->
                  </button>
                </div>
              </div>
              <div class="form-fields">
                <div class="form-field">
                  <span class="field-label">{{ $t('schedule.project.orderOrJobInfo') }}</span>
                  <spinner
                    v-if="isLoadingDataFrames"
                    :title="$t('editing.dataDownloading')" 
                    class="dataframe-loading-spinner" 
                    size="10"/>
                  <default-select 
                    v-else
                    v-model="formOrder"
                    :options="dataFrameOptions"
                  />
                  <binding-checked-info
                    v-if="hasError(checkedResultOrder)"
                    :info="checkedResultOrder"
                    @bind="bindOrder"
                  />
                </div>
              </div>
            </div>
            <!-- 綁定共同資料 -->
            <div class="form">
              <div class="form-label">
                {{ $t('schedule.setting.commonDataSetting') }}（{{ $t('editing.isRequired') }}）
                <div class="form-action">
                  <button
                    v-if="isRawdataBindable"
                    :disabled="isBindRawdataBtnDisabled"
                    class="btn btn-default"
                    @click="bindRawdata">
                    <spinner 
                      v-show="isBindingRawdata" 
                      size="10"/>
                    {{ $t('schedule.binding.bind') }}
                  </button>
                  <button
                    v-else
                    :disabled="isCheckRawdataBtnDisabled"
                    class="btn btn-default"
                    @click="checkRawdata">
                    <spinner 
                      v-show="isCheckingRawdata" 
                      size="10"/>
                    檢查
                    <!-- {{ $t('schedule.binding.bind') }} -->
                  </button>
                </div>
              </div>
              <div class="form-fields">
                <div
                  v-for="file in files.rawdata"
                  :key="file.id"
                  class="form-field"
                >
                  <span class="field-label">{{ file.alias }}</span>
                  <spinner 
                    v-if="isLoadingDataFrames" 
                    :title="$t('editing.dataDownloading')"
                    class="dataframe-loading-spinner" 
                    size="10"/>
                  <default-select
                    v-else
                    v-model="formRawdata[`${file.code}DataframeId`]"
                    :options="dataFrameOptions"
                  />
                  <binding-checked-info
                    v-if="hasError(checkedResultRawdata, file.code)"
                    :info="checkedResultRawdata[file.code]"
                    @bind="bindRawdata"
                  />
                </div>
              </div>
            </div>
            <!-- 綁定額外限制 -->
            <div class="form">
              <div class="form-label">
                {{ $t('schedule.setting.extraConstraintSetting') }}
                <div class="form-action">
                  <button
                    class="btn btn-default"
                  >
                    {{ $t('schedule.binding.bind') }}
                  </button>
                  <button
                    class="btn btn-default"
                    @click="checkConstraints"
                  >
                    檢查
                    <!-- {{ $t('schedule.binding.bind') }} -->
                  </button>
                </div>
              </div>
              <div class="form-fields">
                <div
                  v-for="file in files.constraint"
                  :key="file.id"
                  class="form-field"
                >
                  <span class="field-label">{{ file.alias }}</span>
                  <spinner 
                    v-if="isLoadingDataFrames" 
                    :title="$t('editing.dataDownloading')"
                    class="dataframe-loading-spinner" 
                    size="10"/>
                  <default-select
                    v-else
                    v-model="formConstraint[file.code]"
                    :options="dataFrameOptions"
                  />
                  <!-- <binding-checked-info
                    v-if="hasError(checkedResultRawdata, file.code)"
                    :info="checkedResultRawdata[file.code]"
                    @bind="bindConstraints"
                  /> -->
                </div>
              </div>
            </div>
          </section>
        </template>
      </div>
      <div class="dialog-footer">
        <div class="dialog-button-block">
          <button
            class="btn btn-outline"
            @click="$emit('close', shouldRefetchProjectsThereafter)"
          >{{ $t('button.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDataFrameById } from '@/API/DataSource'
import { getUploadFileList } from '@/schedule/API/Setting'
import { checkOrder, bindOrder, checkRawdata, bindRawdata, checkConstraints, bindConstraints } from '@/schedule/API/Bind'
import { rebindDataSource } from '@/schedule/API/Project'
import { Message } from 'element-ui'
import DecideDialog from '@/components/dialog/DecideDialog'
import BindingCheckedInfo from './BindingCheckedInfo'

export default {
  name: 'ScheduleProjectRelationDialog',
  components: {
    DecideDialog,
    BindingCheckedInfo
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
      formRawdata: {},
      formConstraint: {},
      files: {
        rawdata: [],
        constraint: []
      },
      datasourceId: null,
      dataFrames: [],
      isLoadingFilesInfo: false,
      isLoadingDataFrames: false,
      isCheckingOrder: false,
      isCheckingRawdata: false,
      isCheckingConstraints: false,
      isBindingOrder: false,
      isBindingRawdata: false,
      isBindingConstraints: false,
      isBindingDataSource: false,
      checkedResultOrder: {},
      checkedResultRawdata: {},
      checkedResultConstraint: {},
      shouldRefetchProjectsThereafter: false
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceList']),
    dataSourceOptions () {
      const options = this.dataSourceList.map(item => ({ value: item.id, label: item.name }))
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    },
    dataFrameOptions () {
      const options = this.dataFrames.map(item => ({ value: item.id, label: item.primaryAlias }))
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    },
    isCheckOrderBtnDisabled () {
      return this.formOrder === null || this.isCheckingOrder
    },
    isBindOrderBtnDisabled () {
      return this.isBindingOrder || !this.checkedResultOrder || Boolean(this.checkedResultOrder.headerErrorMessage)
    },
    isRawdataBindable () {
      return Object.values(this.checkedResultRawdata).every(value => value.bindable)
    },
    isCheckRawdataBtnDisabled () {
      return this.isCheckingRawdata || Object.values(this.formRawdata).some(value => value === null)
    },
    isBindRawdataBtnDisabled () {
      return this.isBindingRawdata || Object.values(this.checkedResultRawdata).some(value => !value.bindable)
    },
    checkedResultDefault () {
      return {
        columns: [],
        headerErrorMessage: null,
        notApplicableRowIndexes: [],
        rows: 0,
        bindable: false
      }
    }
  },
  created () {
    this.datasourceId = this.projectInfo.datasourceStatus === 'Bound'
      ? this.projectInfo.datasourceId
      : null
    this.fetchFiles()
    this.fetchDataFrames()
    this.checkedResultOrder = this.checkedResultDefault
  },
  methods: {
    fetchFiles () {
      this.isLoadingFilesInfo = true
      getUploadFileList()
        .then(({ rawdata, constraint }) => {
          this.files.rawdata = rawdata.map(item => ({ ...item, code: this.snakeToCamel(item.code) }))
          this.files.constraint = constraint

          this.files.rawdata.forEach(item => {
            this.$set(this.formRawdata, `${item.code}DataframeId`, null)
            this.$set(this.checkedResultRawdata, item.code, this.checkedResultDefault)
          })
          this.files.constraint.forEach(item => {
            this.$set(this.formConstraint, item.code, null)
            this.$set(this.checkedResultConstraint, item.code, this.checkedResultDefault)
          })
          this.isLoadingFilesInfo = false
        })
        .catch(() => this.isLoadingFilesInfo = false)
    },
    fetchDataFrames () {
      this.isLoadingDataFrames = true
      getDataFrameById(this.datasourceId)
        .then(res => {
          this.dataFrames = res
          this.resetDataFrameSelectors()
          this.isLoadingDataFrames = false
        })
        .catch(() => this.isLoadingDataFrames = false)
    },
    checkOrder () {
      const requestBody = {
        dataframeId: this.formOrder,
        projectId: this.projectInfo.id
      }

      this.isCheckingOrder = true
      checkOrder(requestBody)
        .then(res => {
          this.checkedResultOrder = {
            ...this.checkedResultOrder,
            ...res,
            headerErrorMessage: this.bindable(res) ? '' : res.headerErrorMessage,
            bindable: this.bindable(res)
          }
          if (!this.hasError(this.checkedResultOrder)) {
            Message({
              message: this.$t('schedule.binding.allOrderDataIsValid'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.bindOrder()
          }
        })
        .catch(() => {})
        .finally(() => this.isCheckingOrder = false)
    },
    checkRawdata () {
      const requestBody = {
        ...this.formRawdata,
        projectId: this.projectInfo.id
      }

      this.isCheckingRawdata = true
      checkRawdata(requestBody)
        .then(res => {
          Object.keys(this.checkedResultRawdata)
            .forEach(key => {
              this.checkedResultRawdata[key] = {
                ...this.checkedResultRawdata[key],
                ...res[key],
                headerErrorMessage: this.bindable(res[key]) ? '' : res[key].headerErrorMessage,
                bindable: this.bindable(res[key])
              }
            })

          // 全部資料表皆檢查通過
          const allPass = Object.values(this.checkedResultRawdata).every(value => this.hasError(this.checkedResultRawdata, value))
          if (allPass) {
            Message({
              message: this.$t('schedule.binding.allRawdataDataIsValid'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.bindRawdata()
          }
        })
        .catch(() => {})
        .finally(() => this.isCheckingRawdata = false)
    },
    checkConstraints () {
      const requestBody = {
        constraint: Object.keys(this.formConstraint)
          .filter(key => this.formConstraint[key] !== null)
          .map(key => ({
            code: key,
            dataframeId: this.formConstraint[key]
          })),
        projectId: this.projectInfo.id
      }

      this.isCheckingConstraints = true
      checkConstraints(requestBody)
        .then(() => {})
        .catch(() => {})
        .finally(() => this.isCheckingConstraints = false)
    },
    bindOrder () {
      this.isBindingOrder = true
      bindOrder({
        dataframeId: this.formOrder,
        projectId: this.projectInfo.id
      })
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyBindOrder'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => {
          this.isBindingOrder = false
          
        })
    },
    bindRawdata () {
      const requestBody = {
        ...this.formRawdata,
        projectId: this.projectInfo.id
      }

      this.isBindingRawdata = true
      bindRawdata(requestBody)
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyBindRawdata'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => this.isBindingRawdata = false)
    },
    bindConstraints () {
      bindConstraints()
        .then(() => {})
        .catch(() => {})
        .finally(() => {})
    },
    hasError (info, fileCode = null) {
      if (fileCode) {
        if (!info.hasOwnProperty(fileCode)) return false
        return info[fileCode].headerErrorMessage || info[fileCode].notApplicableRowIndexes.length > 0
      } else {
        return info.headerErrorMessage || info.notApplicableRowIndexes.length > 0
      }
    },
    bindable (info) {
      return !info.hasOwnProperty('headerErrorMessage')
    },
    rebindDataSource () {
      this.isBindingDataSource = true

      rebindDataSource({
        datasourceId: this.datasourceId,
        id: this.projectInfo.id
      })
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyRebindDataSource'),
            type: 'info',
            duration: 10 * 1000,
            showClose: true
          })
          this.fetchDataFrames()
          this.resetDataFrameSelectors()
          this.shouldRefetchProjectsThereafter = true
        })
        .catch(() => {})
        .finally(() => this.isBindingDataSource = false)
    },
    resetDataFrameSelectors () {
      this.formOrder = null
      Object.values(this.formRawdata).forEach(value => value = null)
      Object.values(this.formConstraint).forEach(value => value = null)
    },
    snakeToCamel (variable) {
      if (!variable) return ''
      return variable.replace(/(\w)(_)(\w)/g, (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.relation-dialog {
  .dialog-container {
    width: 752px;
  }
  .relation-container {
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
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  &.btn-rebind-ds {
    margin-left: auto;
    margin-top: 7px;
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
</style>