<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.binding.globalSetting') }}（{{ $t('editing.isRequired') }}）
      <div class="form-action">
        <button
          :disabled="isUnbinding"
          class="btn btn-default"
          @click="unbind"
        >
          {{ $t('schedule.binding.unbind') }}
        </button>
        <button
          v-if="checkedResult.bindable"
          :disabled="isBinding"
          class="btn btn-default"
          @click="bind">
          <spinner 
            v-show="isBinding" 
            size="10"/>
          {{ $t('schedule.binding.bind') }}
        </button>
        <button
          v-else
          :disabled="isChecking"
          class="btn btn-default"
          @click="check">
          <spinner 
            v-show="isChecking" 
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
          v-model="innerFormData"
          :options="dataFrameOptions"
        />
        <binding-checked-info
          v-if="resultHandler.hasError(checkedResult)"
          :info="checkedResult"
          @bind="bind"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { checkOrder, bindOrder, unbindOrder } from '@/schedule/API/Bind'
import { Message } from 'element-ui'
import BindingCheckedInfo from './BindingCheckedInfo'

export default {
  name: 'BindOrder',
  components: {
    BindingCheckedInfo
  },
  props: {
    formData: {
      type: Number,
      default: null
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
      innerFormData: null,
      isChecking: false,
      isBinding: false,
      isUnbinding: false,
      currentBoundStatus: null
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId'])
  },
  watch: {
    // 例如資料源重新綁定，外層會一起清空資料表
    formData (value) {
      this.innerFormData = value
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.innerFormData = this.formData
      this.currentBoundStatus = this.originalBoundStatus
    },
    check () {
      if (!this.innerFormData) {
        return Message({
          message: this.$t('schedule.binding.pleaseSelectOrder'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      const requestBody = {
        dataframeId: this.innerFormData,
        projectId: this.scheduleProjectId
      }

      this.isChecking = true
      checkOrder(requestBody)
        .then(res => {
          const bindable = this.resultHandler.bindable(res)
          this.checkedResult.bindable = bindable
          if (res.hasOwnProperty('headerErrorMessage')) {
            this.checkedResult.headerErrorMessage = res.headerErrorMessage
          } else {
            this.checkedResult.headerErrorMessage = null
            this.checkedResult.columns = res.columns
            this.checkedResult.applicableRowCount = res.available
            this.checkedResult.notApplicableRowCount = res.notApplicableRowIndexes.length
          }
          
          if (!this.resultHandler.hasError(this.checkedResult)) {
            Message({
              message: this.$t('schedule.binding.allOrderDataIsValid'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.bind()
          }
        })
        .catch(error => {
          if (error.hasOwnProperty('headerErrorMessage')) {
            this.checkedResult.headerErrorMessage = error.headerErrorMessage
          } 
        })
        .finally(() => this.isChecking = false)
    },
    bind () {
      this.isBinding = true
      bindOrder({
        dataframeId: this.innerFormData,
        projectId: this.scheduleProjectId
      })
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyBindOrder'),
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
          message: this.$t('schedule.binding.orderNotBeingBound'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      this.isUnbinding = true
      unbindOrder (this.scheduleProjectId)
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyUnbindOrder'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.currentBoundStatus = false
          this.innerFormData = null
          this.$emit('resetCheckedResult')
        })
        .catch(() => {})
        .finally(() => this.isUnbinding = false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
