<template>
  <div class="block__form">
    <div
      v-for="option in alertThresholdOptions"
      :key="option.key"
      :disabled="isOff"
      class="input-radio-group"
    >
      <input
        :id="option.key"
        v-model="setting.alertType"
        :checked="option.key === originalSetting.alertType"
        :disabled="isOff"
        :value="option.key"
        class="input-radio"
        type="radio"
      >
      <label
        :for="option.key"
        class="input-radio-label"
      >
        {{ option.label }}
        <template v-if="option.key === setting.alertType && option.key !== ALERT_TYPE.ALERT_OFF">
          <default-input
            v-model="setting[snakeToCamel(option.key)]"
            :is-disabled="isOff"
            class="default-select-criteria"
            type="number"
          >
            <span
              v-if="option.key === ALERT_TYPE.ALERT_PERCENTAGE"
              slot="append"
            >%</span>
            <span
              v-if="option.key === ALERT_TYPE.ALERT_QUANTITY"
              slot="append"
            >{{ $t('schedule.base.unit') }}</span>
          </default-input>
        </template>
      </label>
    </div>
  </div>
</template>

<script>
import { ALERT_TYPE } from '@/schedule/utils/enum'
import { snakeToCamel } from '@/schedule/utils/mixins'

export default {
  name: 'RollingDelayCriteriaSetting',
  props: {
    originalSetting: {
      type: Object,
      default: () => {
        return {
          alertType: ALERT_TYPE.ALERT_PERCENTAGE, // ALERT_OFF, ALERT_QUANTITY, ALERT_PERCENTAGE
          alertThreshold: '100'
        }
      }
    }
  },
  data () {
    return {
      setting: {
        alertType: '',
        alertPercentage: '100',
        alertQuantity: '100'
      },
      ALERT_TYPE
    }
  },
  computed: {
    alertThresholdOptions () {
      return [
        { key: ALERT_TYPE.ALERT_PERCENTAGE, label: this.$t('schedule.rolling.alertThresholdByPercentage') },
        { key: ALERT_TYPE.ALERT_QUANTITY, label: this.$t('schedule.rolling.alertThresholdByQuantity') }
      ]
    },
    isOff () {
      return this.setting.alertType === ALERT_TYPE.ALERT_OFF
    }
  },
  watch: {
    'originalSetting.alertType' () {
      this.initSetting()
    },
    setting: {
      deep: true,
      handler (value) {
        const setting = {
          alertType: value.alertType,
          alertThreshold: Number(this.setting[snakeToCamel(value.alertType)])
        }
        this.$emit('change', setting)
      }
    }
  },
  mounted () {
    this.initSetting()
  },
  methods: {
    initSetting () {
      this.setting.alertType = this.originalSetting.alertType
      switch (this.setting.alertType) {
        case 'ALERT_PERCENTAGE':
          this.setting.alertPercentage = String(this.originalSetting.alertThreshold)
          break
        case 'ALERT_QUANTITY':
          this.setting.alertQuantity = String(this.originalSetting.alertThreshold)
      }
    },
    snakeToCamel
  }
}
</script>

<style lang="scss" scoped>
.default-select-criteria {
  display: inline-block;
}
.alert-off-reminder {
  margin: 0;
  line-height: 40px;
}
</style>
