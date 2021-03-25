<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.setting.extraConstraintSetting') }}
      <div class="form-action">
        <button
          :disabled="isUnbinding"
          class="btn btn-outline"
          @click="unbind"
        >
          <spinner 
            v-show="isUnbinding" 
            size="10"/>
          {{ $t('schedule.binding.unbind') }}
        </button>
        <button
          :disabled="isChecking"
          class="btn btn-default"
          @click="check"
        >
          <spinner 
            v-show="isChecking" 
            size="10"/>
          {{ $t('schedule.binding.check') }}
        </button>
        <button
          :disabled="isBinding || bindableConstranints.length === 0"
          class="btn btn-default"
          @click="bind"
        >
          <spinner 
            v-show="isBinding" 
            size="10"/>
          {{ $t('schedule.binding.bind') }}
        </button>
      </div>
    </div>
    <div class="form-fields">
      <div class="form-fields-description">
        <span>{{ $t('schedule.binding.pleaseSelectDataFrames') }}</span>
        <span>{{ $t('schedule.binding.select') }}</span>
      </div>
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
          v-model="formData[file.code].dataframeId"
          :options="options"
        />
        <binding-checked-info
          v-if="resultHandler.hasError(checkedResult, file.code)"
          :info="checkedResult[file.code]"
          @bind="bind"
        />

        <label 
          :class="{'checkbox--active': formData[file.code].isSelected}"
          class="checkbox">
          <div class="checkbox-label">
            <input
              v-model="formData[file.code].isSelected"
              type="checkbox"
            >
            <div class="checkbox-square"/>
          </div>
        </label>
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
    validConstraints () {
      // 有選值、有勾選的 constraints
      return Object.keys(this.formData)
        .filter(key => this.formData[key].dataframeId !== null && this.formData[key].isSelected)
        .map(key => ({
          code: key,
          dataframeId: this.formData[key].dataframeId
        }))
    },
    validCodes () {
      // 有選值、有勾選的 constraint codes
      return Object.keys(this.formData)
        .filter(key => this.formData[key].dataframeId !== null && this.formData[key].isSelected)
    },
    bindableConstranints () {
      // 有選值、有勾選的、且檢查通過的 constraints
      return this.validConstraints
        .filter(item => this.checkedResult[item.code].bindable)
    },
    options () {
      return [ { value: null, label: this.$t('editing.defaultOption') }, ...this.dataFrameOptions ]
    }
  },
  methods: {
    check () {
      if (this.validConstraints.length === 0) {
        return Message({
          message: this.$t('schedule.binding.pleaseSelectConstraint'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      const requestBody = {
        constraints: this.validConstraints,
        projectId: this.scheduleProjectId
      }

      this.isChecking = true
      checkConstraints(requestBody)
        .then(dataframeCheckedResults => {
          
          dataframeCheckedResults.forEach(({ code, result }) => {
            const bindable = this.resultHandler.bindable(result)
            const checkedResult = this.checkedResult[code]

            checkedResult.bindable = bindable
            if (result.hasOwnProperty('headerErrorMessage')) {
              checkedResult.headerErrorMessage = result.headerErrorMessage
            } else {
              checkedResult.headerErrorMessage = null
              checkedResult.columns = result.columns
              checkedResult.totalRowCount = result.rows
              checkedResult.applicableRowCount = result.available
              checkedResult.notApplicableRowCount = result.notApplicableRowIndexes.length
            }
          })

          // 全部資料表皆檢查通過
          const allPass = Object.keys(this.checkedResult)
            .filter(fileCode => this.validCodes.includes(fileCode))
            .every(fileCode => !this.resultHandler.hasError(this.checkedResult[fileCode]))
          if (allPass) {
            Message({
              message: this.$t('schedule.binding.allConstraintsDataIsValid'),
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
          this.$emit('resetCheckedResult', this.validCodes)
        })
        .catch(() => {})
        .finally(() => this.isBinding = false)
    },
    unbind () {
      if (this.validConstraints.length === 0) {
        return Message({
          message: this.$t('schedule.binding.pleaseSelectConstraint'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }

      this.isUnbinding = true
      unbindConstraint({
        codes: this.validCodes,
        projectId: this.scheduleProjectId
      })
        .then(() => {
          Message({
            message: this.$t('schedule.binding.successfullyUnbindConstraint'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          // 解除綁定後，把畫面上相關資訊清空
          this.$emit('resetCheckedResult', this.validCodes)
          this.validCodes.forEach(code => {
            this.formData[code] = {
              dataframeId: null,
              isSelected: false
            }
          })
        })
        .finally(() => this.isUnbinding = false)
    },
    snakeToCamel,
    snakeToPascal
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
