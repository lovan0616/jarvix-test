<template>
  <div class="form">
    <div class="form-label">
      {{ $t('schedule.setting.extraConstraintSetting') }}
      <div class="form-action">
        <button
          :disabled="isBindBtnDisabled"
          class="btn btn-default"
          @click="check"
        >
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
import { checkConstraints, bindConstraints } from '@/schedule/API/Bind'
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
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    isBindBtnDisabled () {
      return this.isChecking || this.isBinding || this.formattedConstraints.length === 0
    },
    formattedConstraints () {
      // 送進 Constraints check 的 request body
      return Object.keys(this.formData)
        .filter(key => this.formData[key] !== null)
        .map(key => ({
          code: key,
          dataframeId: this.formData[key]
        }))
    },
    bindableConstranints () {
      // 送進 Constraints bind 的 request body
      return this.formattedConstraints
        .filter(item => this.checkedResult[item.code].bindable || false)
    },
  },
  methods: {
    check () {
      const requestBody = {
        constraints: this.formattedConstraints,
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
          if (allFailed) {
            return Message({
              message: '額外限制資料檢查完成，資料格式錯誤',
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
            message: `已綁定額外資料限制資料表：${boundConstraintsString}`,
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
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
