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
          v-if="isLoadingDataBoundStatusInfo"
          :title="$t('editing.loading')"
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
                    {{ $t('schedule.binding.bind') }}
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
                    {{ $t('schedule.binding.bind') }}
                  </button>
                </div>
              </div>
              <div class="form-fields">
                <div
                  v-for="file in files.raw_data"
                  :key="file.id"
                  class="form-field"
                >
                  <span class="field-label">{{ $t(`schedule.setting.commonData${snakeToPascal(file.code)}`) }}</span>
                  <spinner 
                    v-if="isLoadingDataFrames" 
                    :title="$t('editing.dataDownloading')"
                    class="dataframe-loading-spinner" 
                    size="10"/>
                  <default-select
                    v-else
                    v-model="formRawData[file.code]"
                    :options="dataFrameOptions"
                  />
                  <binding-checked-info
                    v-if="hasError(checkedResultRawData, file.code)"
                    :info="checkedResultRawData[file.code]"
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
                    :disabled="isBindConstraintBtnDisabled"
                    class="btn btn-default"
                    @click="checkConstraints"
                  >
                    {{ $t('schedule.binding.bind') }}
                  </button>
                </div>
              </div>
              <div class="form-fields">
                <div
                  v-for="file in files.constraint"
                  :key="file.id"
                  class="form-field"
                >
                  <span class="field-label">{{ $t(`schedule.setting.extraConstraint${snakeToPascal(file.code)}`) }}</span>
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
                  <binding-checked-info
                    v-if="hasError(checkedResultConstraint, file.code)"
                    :info="checkedResultConstraint[file.code]"
                    @bind="bindConstraints"
                  />
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
import { checkOrder, bindOrder, checkRawdata, bindRawdata, checkConstraints, bindConstraints } from '@/schedule/API/Bind'
import { fetchDataBoundStatus, rebindDataSource } from '@/schedule/API/Project'
import { snakeToCamel, snakeToPascal } from '@/schedule/utils/mixins'

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
      isCheckingOrder: false,
      isCheckingRawdata: false,
      isCheckingConstraints: false,
      isBindingOrder: false,
      isBindingRawdata: false,
      isBindingConstraints: false,
      isBindingDataSource: false,
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
    formattedRawdata () {
      // 送進 Rawdata check/bind 的 request body
      return Object.keys(this.formRawData).reduce((acc, cur) => {
        acc[`${this.snakeToCamel(cur)}DataframeId`] = this.formRawData[cur]
        return acc
      }, {})
    },
    formattedConstraints () {
      // 送進 Constraints check 的 request body
      return Object.keys(this.formConstraint)
        .filter(key => this.formConstraint[key] !== null)
        .map(key => ({
          code: key,
          dataframeId: this.formConstraint[key]
        }))
    },
    bindableConstranints () {
      // 送進 Constraints bind 的 request body
      return this.formattedConstraints
        .filter(item => this.checkedResultConstraint[item.code].bindable || false)
    },
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
      return Object.values(this.checkedResultRawData).every(value => value.bindable)
    },
    isCheckRawdataBtnDisabled () {
      return this.isCheckingRawdata || Object.values(this.formRawData).some(value => value === null)
    },
    isBindRawdataBtnDisabled () {
      return this.isBindingRawdata || Object.values(this.checkedResultRawData).some(value => !value.bindable)
    },
    isBindConstraintBtnDisabled () {
      return this.isCheckingConstraints || this.isBindingConstraints || this.formattedConstraints.length === 0
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

            // 訂單資料
            if (category === 'ORDER') {
              this.formOrder = file.dataframeId
              this.checkedResultOrder = this.checkedResultDefault
              return
            }

            // 加入檔案列表
            this.files[category.toLowerCase()].push(file)

            // 加入表單資料
            const pascaledCategory = this.snakeToPascal(category.toLowerCase())
            this.$set(this[`form${pascaledCategory}`], file.code, file.dataframeId || null)
            
            // 加入檢查資訊
            this.$set(this[`checkedResult${pascaledCategory}`], file.code, this.checkedResultDefault)
          })
        })
        .finally(() => this.isLoadingDataBoundStatusInfo = false)
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
        ...this.formattedRawdata,
        projectId: this.projectInfo.id
      }

      this.isCheckingRawdata = true
      checkRawdata(requestBody)
        .then(res => {
          Object.keys(this.checkedResultRawData)
            .forEach(key => {
              const checkedInfo = res[this.snakeToCamel(key)]
              const bindable = this.bindable(checkedInfo)
              this.checkedResultRawData[key] = {
                ...this.checkedResultRawData[key],
                ...checkedInfo,
                headerErrorMessage: bindable ? '' : checkedInfo.headerErrorMessage,
                bindable
              }
            })

          // 全部資料表皆檢查通過
          const allPass = Object.values(this.checkedResultRawData).every(value => value.bindable)
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
        constraints: this.formattedConstraints,
        projectId: this.projectInfo.id
      }

      this.isCheckingConstraints = true
      checkConstraints(requestBody)
        .then(dataframeCheckedResults => {
          
          dataframeCheckedResults.forEach(({ code, result }) => {
            this.checkedResultConstraint[code] = {
              ...this.checkedResultConstraint[code],
              ...result,
              headerErrorMessage: this.bindable(result) ? '' : result.headerErrorMessage,
              bindable: this.bindable(result)
            }
          })

          // const somePassed = Object.values(this.checkedResultConstraint).some(value => value.bindable)
          const allFailed = Object.values(this.checkedResultConstraint).every(value => !value.bindable)
          if (allFailed) {
            return Message({
              message: '額外限制資料檢查完成，資料格式錯誤',
              type: 'warning',
              duration: 3 * 1000,
              showClose: true
            })
          }
          this.bindConstraints()
        })
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
        ...this.formattedRawdata,
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
          this.resetCheckedInfoRawdata()
        })
        .catch(() => {})
        .finally(() => this.isBindingRawdata = false)
    },
    bindConstraints () {
      const requestBody = {
        constraints: this.bindableConstranints,
        projectId: this.projectInfo.id
      }

      this.isBindingConstraints = true
      bindConstraints(requestBody)
        .then(() => {
          const boundConstraintsString = (this.bindableConstranints.reduce((acc, cur) => {
            return acc.concat('"' + this.$t(`schedule.setting.extraConstraint${this.snakeToPascal(cur.code)}`) + '"')
          }, [])).join(', ')
          Message({
            message: `已綁定額外資料限制資料表：${boundConstraintsString}`,
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => this.isBindingConstraints = false)
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
      // 並未改變資料源
      if (this.datasourceId === this.projectInfo.datasourceId) {
        Message({
          message: this.$t('schedule.binding.alreadyBoundToCertainDataSource', { datasource: this.projectInfo.datasourceName }),
          type: 'info',
          duration: 10 * 1000,
          showClose: true
        })
        return
      }

      this.isBindingDataSource = true
      rebindDataSource({
        datasourceId: this.datasourceId,
        id: this.projectInfo.id
      })
        .then(() => {
          const datasource = this.dataSourceOptions.find(item => item.value === this.datasourceId)
          Message({
            message: this.$t('schedule.binding.successfullyRebindDataSource', { datasource: datasource.label }),
            type: 'info',
            duration: 10 * 1000,
            showClose: true
          })
          this.fetchDataFrames()
          this.resetDataFrameSelectors()
          this.resetCheckedInfo()
          this.shouldRefetchProjectsThereafter = true
        })
        .catch(() => {})
        .finally(() => this.isBindingDataSource = false)
    },
    resetDataFrameSelectors () {
      this.formOrder = null
      for (const key in this.formRawData) this.formRawData[key] = null
      for (const key in this.formConstraint) this.formConstraint[key] = null
    },
    resetCheckedInfoOrder () {
      this.checkedResultOrder = this.checkedResultDefault
    },
    resetCheckedInfoRawdata () {
      for (const key in this.checkedResultRawData) this.checkedResultRawData[key] = this.checkedResultDefault
    },
    resetCheckedInfoConstraints () {
      for (const key in this.checkedResultConstraint) this.checkedResultConstraint[key] = this.checkedResultDefault
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