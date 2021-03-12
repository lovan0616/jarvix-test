<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.setting.extraConstraintSetting') }}
      <div class="form-action">
        <button
          :disabled="isUnbinding"
          class="btn btn-default"
          @click="unbind"
        >
          <spinner 
            v-show="isUnbinding" 
            size="10"/>
          {{ $t('schedule.binding.unbind') }}
        </button>
        <button
          :disabled="isBinding"
          class="btn btn-default"
          @click="check"
        >
          <spinner 
            v-show="isBinding" 
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
        <span class="field-label">{{ $t(`schedule.setting.extraConstraint${snakeToPascal(file.code)}`) }}</span>
        <spinner 
          v-if="isLoadingDataFrames" 
          :title="$t('editing.dataDownloading')"
          class="dataframe-loading-spinner" 
          size="10"/>
        <default-select
          v-else
          v-model="formData[file.code]"
          :options="options"
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
import { checkConstraints, bindConstraints, unbindConstraint } from '@/schedule/API/Bind'
import { Message } from 'element-ui'
import { snakeToCamel, snakeToPascal } from '@/schedule/utils/mixins'
import BindingCheckedInfo from './BindingCheckedInfo'

export default {
  name: 'BindConstraint',
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
      isBinding: false,
      isUnbinding: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    isBindBtnDisabled () {
      return this.isChecking || this.isBinding || this.selectedConstraints.length === 0
    },
    selectedConstraints () {
      return Object.keys(this.formData)
        .filter(key => this.formData[key] !== null)
        .map(key => ({
          code: key,
          dataframeId: this.formData[key]
        }))
    },
    selectedCodes () {
      return this.selectedConstraints.reduce((acc, cur) => acc.concat(cur.code), [])
    },
    bindableConstranints () {
      return this.selectedConstraints
        .filter(item => this.checkedResult[item.code].bindable || false)
    },
    options () {
      const options = [ ...this.dataFrameOptions ]
      options.unshift({ value: null, label: this.$t('editing.defaultOption') })
      return options
    }
  },
  methods: {
    check () {
      if (this.selectedConstraints.length === 0) {
        return Message({
          message: this.$t('schedule.binding.pleaseSelectConstraint'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      const requestBody = {
        constraints: this.selectedConstraints,
        projectId: this.scheduleProjectId
      }

      this.isChecking = true
      checkConstraints(requestBody)
        .then(dataframeCheckedResults => {
          
          dataframeCheckedResults.forEach(({ code, result }) => {
            const bindable = this.resultHandler.bindable(result)
            this.checkedResult[code].bindable = bindable
            if (result.hasOwnProperty('headerErrorMessage')) {
              this.checkedResult[code].headerErrorMessage = result.headerErrorMessage
            } else {
              this.checkedResult[code].headerErrorMessage = null
              this.checkedResult[code].columns = result.columns
              this.checkedResult[code].applicableRowCount = result.available
              this.checkedResult[code].notApplicableRowCount = result.notApplicableRowIndexes.length
            }
          })

          const allFailed = Object.values(this.checkedResult).every(value => !value.bindable)
          // 全部資料都無法做綁定才擋下，有可以綁定的就送去綁定
          if (allFailed) {
            return Message({
              message: this.$t('schedule.binding.allConstraintsDataIsInvalid'),
              type: 'warning',
              duration: 3 * 1000,
              showClose: true
            })
          }
          this.bind()
        })
        .catch(() => {})
        .finally(() => this.isChecking = false)
    },
    bind () {
      if (this.selectedConstraints.length === 0) {
        return Message({
          message: this.$t('schedule.binding.pleaseSelectConstraint'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      const requestBody = {
        constraints: this.bindableConstranints,
        projectId: this.scheduleProjectId
      }

      this.isBinding = true
      bindConstraints(requestBody)
        .then(() => {
          const boundConstraintsString = (this.bindableConstranints.reduce((acc, cur) => {
            return acc.concat('"' + this.$t(`schedule.setting.extraConstraint${this.snakeToPascal(cur.code)}`) + '"')
          }, [])).join(', ')
          Message({
            message: `${this.$t('schedule.binding.successfullyBindConstraints')}：${boundConstraintsString}`,
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => this.isBinding = false)
    },
    unbind () {
      if (this.selectedConstraints.length === 0) {
        return Message({
          message: this.$t('schedule.binding.pleaseSelectConstraint'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      this.isUnbinding = true
      unbindConstraint({
        codes: this.selectedCodes,
        projectId: this.scheduleProjectId
      })
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyUnbindConstraint'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.$emit('resetFormData')
          this.$emit('resetCheckedResult')
        })
        .finally(() => this.isUnbinding = false)
    },
    snakeToCamel,
    snakeToPascal
  }
}
</script>

<style lang="scss" scoped></style>
