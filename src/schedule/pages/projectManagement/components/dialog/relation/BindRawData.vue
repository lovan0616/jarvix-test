<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.setting.commonDataSetting') }}（{{ $t('editing.isRequired') }}）
      <div class="form-action">
        <button
          v-if="isDataBindable"
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
      <div
        v-for="file in files"
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
import { checkRawdata, bindRawdata } from '@/schedule/API/Bind'
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
    formData: {
      type: Object,
      default: () => {}
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
      isChecking: false,
      isBinding: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    isDataBindable () {
      return Object.values(this.checkedResult).every(value => value.bindable)
    },
    isCheckBtnDisabled () {
      return this.isChecking || Object.values(this.formData).some(value => value === null)
    },
    isBindBtnDisabled () {
      return this.isBinding || Object.values(this.checkedResult).some(value => !value.bindable)
    },
    formattedData () {
      // 送進 Rawdata check/bind 的 request body
      return Object.keys(this.formData).reduce((acc, cur) => {
        acc[`${this.snakeToCamel(cur)}DataframeId`] = this.formData[cur]
        return acc
      }, {})
    }
  },
  methods: {
    check () {
      const requestBody = {
        ...this.formattedData,
        projectId: this.scheduleProjectId
      }

      this.isChecking = true
      checkRawdata(requestBody)
        .then(res => {
          Object.keys(this.checkedResult)
            .forEach(key => {
              const checkedInfo = res[this.snakeToCamel(key)]
              console.log(key, checkedInfo)
              const bindable = this.resultHandler.bindable(checkedInfo)
              console.log(bindable)
              this.checkedResult[key].bindable = bindable
              if (checkedInfo.hasOwnProperty('headerErrorMessage')) {
                this.checkedResult[key].headerErrorMessage = checkedInfo.headerErrorMessage
              } else {
                this.checkedResult[key].headerErrorMessage = null
                this.checkedResult[key].columns = checkedInfo.columns
                this.checkedResult[key].applicableRowCount = checkedInfo.available
                this.checkedResult[key].notApplicableRowCount = checkedInfo.notApplicableRowIndexes.length
              }
            })

          // 全部資料表皆檢查通過
          const allPass = Object.values(this.checkedResult).every(value => value.bindable)
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
          this.resetCheckedInfoRawdata()
        })
        .catch(() => {})
        .finally(() => this.isBinding = false)
    },
    snakeToCamel,
    snakeToPascal
  }
}
</script>

<style lang="scss" scoped></style>
