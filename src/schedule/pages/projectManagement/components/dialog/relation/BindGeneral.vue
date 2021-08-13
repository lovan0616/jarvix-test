<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.binding.generalSetting') }}
      <div class="form-action">
        <button
          :disabled="isUnbinding || isNoneDataframeChecked"
          class="btn btn-outline"
          @click="unbind"
        >
          {{ $t('schedule.binding.unbind') }}
        </button>
        <button
          :disabled="isChecking || isNoneDataframeChecked"
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
          :disabled="isBinding || isNoneDataframeChecked || isNoneDataframeBindable"
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
      <div class="form-fields-description">
        <span>{{ $t('schedule.binding.pleaseSelectDataFrames') }}</span>
        <span>{{ $t('schedule.binding.select') }}</span>
      </div>

      <!-- 資料表：工單 -->
      <div class="form-field">
        <span class="field-label">*{{ $t('schedule.setting.generalJob') }}</span>
        <spinner
          v-if="isLoadingDataFrames"
          :title="$t('editing.dataDownloading')"
          class="dataframe-loading-spinner"
          size="10"
        />
        <default-select
          v-else
          v-model="formData.JOB.dataframeId"
          :options="dataFrameOptions"
        />
        <binding-checked-info
          v-if="resultHandler.hasError(checkedResult, 'JOB')"
          :info="checkedResult.JOB"
          @bind="bindJob"
        />
        <label
          :class="{'checkbox--active': formData.JOB.isSelected}"
          class="checkbox"
        >
          <div class="checkbox-label">
            <input
              v-model="formData.JOB.isSelected"
              type="checkbox"
            >
            <div class="checkbox-square" />
          </div>
        </label>
      </div>

      <!-- 資料表：生產狀況 -->
      <div class="form-field">
        <span class="field-label">{{ $t('schedule.setting.generalProductionProgress') }}</span>
        <spinner
          v-if="isLoadingDataFrames"
          :title="$t('editing.dataDownloading')"
          class="dataframe-loading-spinner"
          size="10"
        />
        <default-select
          v-else
          v-model="formData.PRODUCTION_PROGRESS.dataframeId"
          :options="dataFrameOptions"
        />
        <binding-checked-info
          v-if="resultHandler.hasError(checkedResult, 'PRODUCTION_PROGRESS')"
          :info="checkedResult.PRODUCTION_PROGRESS"
          @bind="bindProductionProgress"
        />
        <label
          :class="{'checkbox--active': formData.PRODUCTION_PROGRESS.isSelected}"
          class="checkbox"
        >
          <div class="checkbox-label">
            <input
              v-model="formData.PRODUCTION_PROGRESS.isSelected"
              type="checkbox"
            >
            <div class="checkbox-square" />
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  checkOrder,
  bindOrder,
  unbindOrder,
  checkProductionProgress,
  bindProductionProgress,
  unbindProductionProgress
} from '@/schedule/API/Bind'
import { Message } from 'element-ui'
import { snakeToPascal } from '@/schedule/utils/mixins'
import BindingCheckedInfo from './BindingCheckedInfo'

export default {
  name: 'BindGeneral',
  components: {
    BindingCheckedInfo
  },
  props: {
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
      isUnbinding: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    isNoneDataframeChecked () {
      return Object.values(this.formData).every(item => !item.isSelected)
    },
    isNoneDataframeBindable () {
      return Object.values(this.checkedResult).every(item => !item.bindable)
    }
  },
  watch: {
    // 例如資料源重新綁定，外層會一起清空資料表
    parentFormData () {
      this.formData = {
        JOB: { dataframeId: null, isSelected: true },
        PRODUCTION_PROGRESS: { dataframeId: null, isSelected: false }
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.formData = this.parentFormData
      this.formData.JOB.isSelected = true // 預設勾選起來
    },
    check () {
      if (this.formData.JOB.isSelected) this.checkJob()
      if (this.formData.PRODUCTION_PROGRESS.isSelected) this.checkProductionProgress()
    },
    bind () {
      if (this.formData.JOB.isSelected) this.bindJob()
      if (this.formData.PRODUCTION_PROGRESS.isSelected) this.bindProductionProgress()
    },
    unbind () {
      if (this.formData.JOB.isSelected) this.unbindJob()
      if (this.formData.PRODUCTION_PROGRESS.isSelected) this.unbindProductionProgress()
    },
    checkJob (code = 'JOB') {
      if (!this.formData[code].dataframeId) {
        return this.openMessage(this.$t('schedule.binding.pleaseSelectOrder'))
      }

      this.isChecking = true
      checkOrder(this.getRequestBody(code))
        .then(res => {
          this.setCheckedResult(res, code)
          if (!this.resultHandler.hasError(this.checkedResult[code])) this.bindJob()
        })
        .catch(error => {
          if (error.hasOwnProperty('headerErrorMessage')) {
            this.checkedResult[code].headerErrorMessage = error.headerErrorMessage
          }
        })
        .finally(() => this.isChecking = false)
    },
    bindJob (code = 'JOB') {
      if (!this.formData[code].dataframeId) {
        return this.openMessage(this.$t('schedule.binding.pleaseSelectOrder'))
      }

      this.isBinding = true
      bindOrder(this.getRequestBody(code))
        .then(() => {
          this.openMessage(this.$t('schedule.binding.successfullyBindOrder', 'success'))
          this.$emit('resetCheckedResult', code)
        })
        .catch(() => {})
        .finally(() => this.isBinding = false)
    },
    unbindJob (code = 'JOB') {
      if (!this.formData[code].dataframeId) {
        this.openMessage(this.$t('schedule.binding.orderNotBeingBound'))
        return
      }

      this.isUnbinding = true
      unbindOrder(this.scheduleProjectId)
        .then(() => {
          this.openMessage(this.$t('schedule.binding.successfullyUnbindOrder'), 'success')
          this.formData[code].dataframeId = null
          this.$emit('resetCheckedResult', code)
        })
        .catch(() => {})
        .finally(() => this.isUnbinding = false)
    },
    checkProductionProgress (code = 'PRODUCTION_PROGRESS') {
      if (!this.formData[code].dataframeId) {
        return this.openMessage(this.$t('schedule.binding.pleaseSelectProductProgress'))
      }

      this.isChecking = true
      checkProductionProgress(this.getRequestBody(code))
        .then(res => {
          this.setCheckedResult(res, code)
          if (!this.resultHandler.hasError(this.checkedResult[code])) this.bindProductionProgress()
        })
        .catch(error => {
          if (error.hasOwnProperty('headerErrorMessage')) {
            this.checkedResult[code].headerErrorMessage = error.headerErrorMessage
          }
        })
        .finally(() => this.isChecking = false)
    },
    bindProductionProgress (code = 'PRODUCTION_PROGRESS') {
      if (!this.formData[code].dataframeId) {
        return this.openMessage(this.$t('schedule.binding.pleaseSelectProductProgress'))
      }

      this.isBinding = true
      bindProductionProgress(this.getRequestBody(code))
        .then(() => {
          this.openMessage(this.$t('schedule.binding.successfullyBindProductionProgress'), 'success')
          this.$emit('resetCheckedResult', code)
          this.$emit('setIsBoundWithProductionProgress', true)
        })
        .finally(() => this.isBinding = false)
    },
    unbindProductionProgress (code = 'PRODUCTION_PROGRESS') {
      if (!this.formData[code].dataframeId) {
        return this.openMessage(this.$t('schedule.binding.productionProgressNotBeingBound'))
      }

      this.isUnbinding = true
      unbindProductionProgress(this.scheduleProjectId)
        .then(() => {
          this.openMessage(this.$t('schedule.binding.successfullyUnbindProductionProgress'), 'success')
          this.formData[code].dataframeId = null
          this.$emit('resetCheckedResult', code)
          this.$emit('setIsBoundWithProductionProgress', false)
        })
        .catch(() => {})
        .finally(() => this.isUnbinding = false)
    },
    setCheckedResult (res, code) {
      const bindable = this.resultHandler.bindable(res)
      this.checkedResult[code].bindable = bindable
      if (res.hasOwnProperty('headerErrorMessage')) {
        this.checkedResult[code].headerErrorMessage = res.headerErrorMessage
      } else {
        this.checkedResult[code].headerErrorMessage = null
        this.checkedResult[code].columns = res.columns
        this.checkedResult[code].totalRowCount = res.rows
        this.checkedResult[code].applicableRowCount = res.available
        this.checkedResult[code].notApplicableRowCount = res.notApplicableRowIndexes.length
      }
    },
    getRequestBody (code) {
      return {
        dataframeId: this.formData[code].dataframeId,
        projectId: this.scheduleProjectId
      }
    },
    openMessage (message, type = 'warning') {
      Message({
        message,
        type,
        duration: 3 * 1000,
        showClose: true
      })
    },
    snakeToPascal
  }
}
</script>
