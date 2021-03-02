<template>
  <div class="full-page-dialog relation-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('schedule.project.dataSourceReRelation') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="$emit('close', false)"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="relation-container">
        <!-- 管理資料源 -->
        <section class="relation-container__section">
          <div class="section-title">Step1: {{ $t('schedule.project.chooseDataSource') }}</div>
          <div class="section-content">
            <span class="content-title">{{ $t('schedule.project.dataSourceName') }}</span>
            <default-select 
              v-validate.disable="'required'"
              v-model="datasourceId"
              :options="dataSourceOptions"
              name="datasourceId"
            />
          </div>
        </section>
        <spinner
          v-if="isLoadingFilesInfo"
          class="file-loading-spinner"
          title="載入檔案中"
        />
        <div v-else>
          <!-- 綁定訂單 -->
          <section class="relation-container__section">
            <div class="section-title">Step2: 綁定訂單</div>
            <div class="section-content">
              <span class="content-title">{{ $t('schedule.project.orderOrJobInfo') }}</span>
              <spinner
                v-if="isLoadingDataFrameList"
                :title="$t('editing.dataDownloading')" 
                class="dataframe-loading-spinner" 
                size="10"/>
              <default-select 
                v-validate="'required'"
                v-else
                v-model="formData.order"
                :options="dataFrameOptions"
                name="dataFrameId-order"
              />
              <binding-checked-info
                v-if="hasError(orderCheckedResult)"
                :info="orderCheckedResult"
              />
            </div>
            <div class="section-action">
              <button
                :disabled="isCheckOrderBtnDisabled"
                class="btn btn-default"
                @click="checkOrder"
              >檢查</button>
              <div 
                v-if="orderCheckedResult.bindable"
                class="bind-block">
                <div class="reminding-info">
                  <svg-icon icon-class="alert-circle"/>
                  確認綁定資料表（錯誤的資料列在模擬時會被忽略）
                </div>
                <button
                  :disabled="isBindOrderBtnDisabled"
                  class="btn btn-default"
                  @click="bindOrder">
                  綁定
                </button>
              </div>
            </div>
          </section>
          <!-- 綁定共同資料 -->
          <section class="relation-container__section">
            <div class="section-title">Step3: 綁定共同資料</div>
            <div
              v-for="file in files.rawdata"
              :key="file.id"
              class="section-content"
            >
              <span class="content-title">{{ file.alias }}</span>
              <spinner 
                v-if="isLoadingDataFrameList" 
                :title="$t('editing.dataDownloading')"
                class="dataframe-loading-spinner" 
                size="10"/>
              <default-select
                v-validate="'required'"
                v-else
                v-model="formData[`${snakeToCamel(file.code)}DataframeId`]"
                :options="dataFrameOptions"
                :name="`dataFrameId-${file.id}`"
              />
              <binding-checked-info
                v-if="hasError(rawdataCheckedResult, snakeToCamel(file.code))"
                :info="rawdataCheckedResult[`${snakeToCamel(file.code)}`]"
              />
            </div>
            <div class="section-action">
              <button
                :disabled="isCheckRawdataBtnDisabled"
                class="btn btn-default"
                @click="checkRawdata">
                檢查
              </button>
              <div
                v-if="!isBindRawdataBtnDisabled"
                class="bind-block"
              >
                <div class="reminding-info">
                  <svg-icon icon-class="alert-circle"/>
                  確認綁定資料表（錯誤的資料列在模擬時會被忽略）
                </div>
                <button
                  :disabled="isBindRawdataBtnDisabled"
                  class="btn btn-default"
                  @click="bindRawdata">
                  綁定
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="dialog-button-block">
          <button
            :disabled="isProcessing"
            class="btn btn-outline"
            @click="$emit('close', false)"
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
import { checkOrder, bindOrder, checkRawdata, bindRawdata } from '@/schedule/API/Bind'
import { Message } from 'element-ui'
import DecideDialog from '@/components/dialog/DecideDialog'
import BindingCheckedInfo from './BindingCheckedInfo'

export default {
  inject: ['$validator'],
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
      formData: {
        order: null
      },
      files: {},
      datasourceId: null,
      dataFrameList: [],
      isLoadingFilesInfo: false,
      isLoadingDataFrameList: true,
      isProcessing: false,
      isCheckingOrder: false,
      isCheckingRawdata: false,
      isBindingOrder: false,
      isBindingRawdata: false,
      orderCheckedResult: {},
      rawdataCheckedResult: {}
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
      const options = this.dataFrameList.map(item => ({ value: item.id, label: item.primaryAlias }))
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    },
    isCheckOrderBtnDisabled () {
      return this.formData.order === null || this.isCheckingOrder
    },
    isBindOrderBtnDisabled () {
      return this.isCheckingOrder || this.isBindingOrder || !this.orderCheckedResult || Boolean(this.orderCheckedResult.headerErrorMessage)
    },
    isCheckRawdataBtnDisabled () {
      return Object.keys(this.formData)
        .filter(key => key !== 'order')
        .some(key => this.formData[key] === null)
    },
    isBindRawdataBtnDisabled () {
      return Object.keys(this.rawdataCheckedResult)
        .some(key => !this.rawdataCheckedResult[key].bindable)
    },
    defaultCheckedResult () {
      return {
        columns: [],
        headerErrorMessage: null,
        notApplicableRowIndexes: [],
        rows: 0,
        bindable: false
      }
    }
  },
  watch: {
    datasourceId: {
      immediate: true,
      handler (dataSourceId) {
        if (dataSourceId) {
          this.isLoadingDataFrameList = true
          getDataFrameById(dataSourceId)
            .then(res => {
              this.dataFrameList = res
              this.resetDataFrameSelectors()
              this.isLoadingDataFrameList = false
            })
            .catch(() => this.isLoadingDataFrameList = false)
        } else {
          this.dataFrameList = []
          this.resetDataFrameSelectors()
          this.isLoadingDataFrameList = false
        }
      }
    }
  },
  created () {
    this.datasourceId = this.projectInfo.datasourceStatus === 'Bound'
      ? this.projectInfo.datasourceId
      : null
    this.fetchFiles()
    this.orderCheckedResult = this.defaultCheckedResult
  },
  methods: {
    fetchFiles () {
      this.isLoadingFilesInfo = true
      getUploadFileList()
        .then(res => {
          this.files = res
          res.rawdata.forEach(item => {
            this.$set(this.formData, `${this.snakeToCamel(item.code)}DataframeId`, null)
            this.$set(this.rawdataCheckedResult, this.snakeToCamel(item.code), this.defaultCheckedResult)
          })
          this.isLoadingFilesInfo = false
        })
        .catch(() => this.isLoadingFilesInfo = false)
    },
    checkOrder () {
      const requestBody = {
        dataframeId: this.formData.order,
        projectId: this.projectInfo.id
      }

      this.isCheckingOrder = true
      checkOrder(requestBody)
        .then(res => {
          this.orderCheckedResult = {
            ...this.orderCheckedResult,
            ...res,
            headerErrorMessage: this.bindable(res) ? '' : res.headerErrorMessage,
            bindable: this.bindable(res)
          }
          if (!this.hasError(this.orderCheckedResult)) {
            Message({
              message: '訂單資料檢查OK',
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
          }
        })
        .catch(() => {})
        .finally(() => this.isCheckingOrder = false)
    },
    checkRawdata () {
      const requestBody = {
        ...this.formData,
        projectId: this.projectInfo.id
      }
      delete requestBody.order

      checkRawdata(requestBody)
        .then(res => {
          Object.keys(this.rawdataCheckedResult)
            .forEach(key => {
              this.rawdataCheckedResult[key] = {
                ...this.rawdataCheckedResult[key],
                ...res[key],
                headerErrorMessage: this.bindable(res[key]) ? '' : res[key].headerErrorMessage,
                bindable: this.bindable(res[key])
              }
            })

          // 整表皆檢查通過
          const allPass = Object.keys(this.rawdataCheckedResult).every(key => this.hasError(this.rawdataCheckedResult, this.rawdataCheckedResult[key]))
          if (allPass) {
            Message({
              message: '共同資料檢查OK',
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.bindRawdata(requestBody)
          }
        })
    },
    hasError (info, fileCode = null) {
      console.log(0)
      if (fileCode) {
        console.log(1)
        if (!info.hasOwnProperty(fileCode)) return false
        return info[fileCode].headerErrorMessage || info[fileCode].notApplicableRowIndexes.length > 0
      } else {
        console.log(2)
        return info.headerErrorMessage || info.notApplicableRowIndexes.length > 0
      }
    },
    bindable (info) {
      return !info.hasOwnProperty('headerErrorMessage')
    },
    bindOrder () {
      this.isBindingOrder = true
      bindOrder({
        dataframeId: this.formData.order,
        projectId: this.projectInfo.id
      })
        .then(() => {
          Message({
            message: '訂單資料已綁定',
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => {
          // this.orderCheckedResult = this.defaultCheckedResult
          this.isBindingOrder = false
          
        })
    },
    bindRawdata () {
      const requestBody = {
        ...this.formData,
        projectId: this.projectInfo.id
      }
      delete requestBody.order

      this.isBindingRawdata = true
      bindRawdata(requestBody)
        .then(() => {
          Message({
            message: '共同資料已綁定',
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => {
          // Object.keys(this.rawdataCheckedResult).forEach(key => this.rawdataCheckedResult[key] = this.defaultCheckedResult)
          this.isBindingRawdata = false
        })
    },
    resetDataFrameSelectors () {
      Object.keys(this.formData)
        .filter(key => key !== 'datasourceId')
        .forEach(key => this.formData[key] = null)
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
      padding: 24px;
      background: rgba(50, 58, 58, 0.95);
      border-radius: 5px;
      margin-bottom: 12px;
      .section {
        &-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        &-content {
          display: flex;
          align-items: flex-start;
          font-size: 14px;
          line-height: 40px;
          .content-title {
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
          text-align: right;
          .bind-block {
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}

/deep/ .spinner-block {
  &.file-loading-spinner {}
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

.reminding-info {
  color: $theme-color-warning;
  font-size: 14px;
  margin-right: 8px;
}
</style>