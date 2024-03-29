<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.setting.commonDataSetting') }}
      <div class="form-action">
        <button
          :disabled="isUnbinding"
          class="btn btn-outline"
          @click="unbind"
        >
          {{ $t('schedule.binding.unbind') }}
        </button>
        <button
          :disabled="isChecking"
          class="btn btn-default"
          @click="check"
        >
          <spinner
            v-show="isChecking"
            size="10"
          />
          {{ $t('schedule.binding.check') }}
        </button>
        <button
          :disabled="!isDataBindable || isBinding"
          class="btn btn-default"
          @click="bind"
        >
          <spinner
            v-show="isBinding"
            size="10"
          />
          {{ $t('schedule.binding.bind') }}
        </button>
      </div>
    </div>
    <div class="form-fields">
      <div
        v-for="file in files"
        :key="file.computed"
        class="form-field"
      >
        <span class="field-label">*{{ $t(`schedule.setting.commonData${snakeToPascal(file.code)}`) }}</span>
        <spinner
          v-if="isLoadingDataFrames"
          :title="$t('editing.dataDownloading')"
          class="dataframe-loading-spinner"
          size="10"
        />
        <default-select
          v-else
          v-model="formData[file.code]"
          :options="dataFrameOptions"
        />
        <binding-checked-info
          v-if="resultHandler.hasError(checkedResult, file.code)"
          :info="checkedResult[file.code]"
          @bind="bind"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { checkRawdata, bindRawdata, unbindRawdata } from '@/schedule/API/Bind'
import { Message } from 'element-ui'
import { snakeToCamel, snakeToPascal } from '@/schedule/utils/mixins'
import BindingCheckedInfo from './BindingCheckedInfo'

export default {
  name: 'BindRawData',
  components: {
    BindingCheckedInfo
  },
  props: {
    files: {
      type: Array,
      default: () => []
    },
    parentFormData: {
      type: Object,
      default: () => {}
    },
    // 當前綁定資訊
    originalBoundStatus: {
      type: Boolean,
      default: false
    },
    dataFrameOptions: {
      type: Array,
      default: () => []
    },
    checkedResult: {
      type: Object,
      default: () => {}
    },
    resultHandler: {
      type: Object,
      default: () => {}
    },
    isLoadingDataFrames: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      formData: {},
      isChecking: false,
      isBinding: false,
      isUnbinding: false,
      currentBoundStatus: null
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId', 'refErrorResultSizeLimit']),
    isDataBindable () {
      return Object.values(this.checkedResult).every(value => value.bindable)
    },
    isCheckDisabled () {
      return Object.values(this.formData).some(value => value === null)
    },
    isBindBtnDisabled () {
      return Object.values(this.checkedResult).some(value => !value.bindable)
    },
    formattedData () {
      // 送進 Rawdata check/bind 的 request body
      return Object.keys(this.formData).reduce((acc, cur) => {
        acc[`${this.snakeToCamel(cur)}DataframeId`] = this.formData[cur]
        return acc
      }, {})
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.currentBoundStatus = this.originalBoundStatus
      this.formData = { ...this.parentFormData }
    },
    check () {
      if (this.isCheckDisabled) {
        return Message({
          message: this.$t('schedule.binding.pleaseSelectRawdata'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      const requestBody = {
        ...this.formattedData,
        projectId: this.scheduleProjectId,
        refErrorResultSizeLimit: this.refErrorResultSizeLimit
      }

      this.isChecking = true
      checkRawdata(requestBody)
        .then(res => {
          Object.keys(this.checkedResult)
            .forEach(key => {
              const checkedInfo = res[this.snakeToCamel(key)]
              const bindable = this.resultHandler.bindable(checkedInfo)
              const checkedResult = this.checkedResult[key]

              checkedResult.bindable = bindable
              if (checkedInfo.hasOwnProperty('headerErrorMessage')) {
                checkedResult.headerErrorMessage = checkedInfo.headerErrorMessage
              } else {
                checkedResult.headerErrorMessage = null
                checkedResult.columns = checkedInfo.columns
                checkedResult.totalRowCount = checkedInfo.rows
                checkedResult.applicableRowCount = checkedInfo.available
                checkedResult.notApplicableRowCount = checkedInfo.notApplicableRowIndexes.length
              }
            })

          // 全部資料表皆檢查通過
          const allPass = Object.values(this.checkedResult).every(value => !this.resultHandler.hasError(value))
          if (allPass) {
            Message({
              message: this.$t('schedule.binding.allRawdataDataIsValid'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.bind()
          }
        })
        .catch(() => {})
        .finally(() => this.isChecking = false)
    },
    bind () {
      const requestBody = {
        ...this.formattedData,
        projectId: this.scheduleProjectId
      }

      this.isBinding = true
      bindRawdata(requestBody)
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyBindRawdata'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.currentBoundStatus = true
          this.$emit('resetCheckedResult')
        })
        .catch(() => {})
        .finally(() => this.isBinding = false)
    },
    unbind () {
      if (!this.currentBoundStatus) {
        return Message({
          message: this.$t('schedule.binding.rawdataNotBeingBound'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      this.isUnbinding = true
      unbindRawdata(this.scheduleProjectId)
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyUnbindRawdata'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.currentBoundStatus = false
          this.$emit('resetCheckedResult')
          this.$emit('resetFormData')
        })
        .catch(() => {})
        .finally(() => this.isUnbinding = false)
    },
    snakeToCamel,
    snakeToPascal
  }
}
</script>

<style lang="scss" scoped></style>
