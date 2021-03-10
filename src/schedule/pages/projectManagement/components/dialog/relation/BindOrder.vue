<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.binding.globalSetting') }}（{{ $t('editing.isRequired') }}）
      <div class="form-action">
        <button
          v-if="checkedResult.bindable"
          :disabled="isBindBtnDisabled"
          class="btn btn-default"
          @click="bind">
          <spinner 
            v-show="isBinding" 
            size="10"/>
          {{ $t('schedule.binding.bind') }}
        </button>
        <button
          v-else
          :disabled="isCheckBtnDisabled"
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
          v-model="innerValue"
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
import { checkOrder, bindOrder } from '@/schedule/API/Bind'
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
      innerValue: null,
      isChecking: false,
      isBinding: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    isCheckBtnDisabled () {
      return this.innerValue === null || this.isChecking
    },
    isBindBtnDisabled () {
      return this.isBinding || !this.checkedResult || Boolean(this.checkedResult.headerErrorMessage)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.innerValue = this.formData
    },
    check () {
      const requestBody = {
        dataframeId: this.innerValue,
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
        .catch(() => {})
        .finally(() => this.isChecking = false)
    },
    bind () {
      this.isBinding = true
      bindOrder({
        dataframeId: this.innerValue,
        projectId: this.scheduleProjectId
      })
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyBindOrder'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => this.isBinding = false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
