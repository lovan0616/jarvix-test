<template>
  <div class="block__form">
    <div
      v-for="option in updateTypeOptions"
      :key="option.key"
      :disabled="!isBoundWithProductionProgress && option.key !== UPDATE_TYPE.OFF"
      class="input-radio-group"
    >
      <input
        :id="option.key"
        v-model="setting.updateType"
        :checked="option.key === setting.updateType"
        :value="option.key"
        :disabled="!isBoundWithProductionProgress"
        class="input-radio"
        type="radio"
        @change="onSelectedUpdateTypeChanged"
      >
      <label
        :for="option.key"
        class="input-radio-label option-label"
      >
        {{ option.label }}
        <template v-if="option.key === UPDATE_TYPE.PRESET && setting.updateType === UPDATE_TYPE.PRESET">
          <default-select
            v-model="setting.updateSystemInterval"
            :options="intervalOption"
            @input="onIntervalChanged(UPDATE_TYPE.PRESET, $event)"
          />
        </template>
        <template v-if="option.key === UPDATE_TYPE.CUSTOM && setting.updateType === UPDATE_TYPE.CUSTOM">
          <default-input
            v-model="setting.updateCustomInterval"
            type="number"
            @input="onIntervalChanged(UPDATE_TYPE.CUSTOM, $event)"
          />分鐘
        </template>
      </label>
    </div>
  </div>
</template>

<script>
import { UPDATE_TYPE } from '@/schedule/utils/enum'

export default {
  name: 'AutoUpdateProduceStatusSetting',
  props: {
    originalSetting: {
      type: Object,
      default: () => {
        return {
          updateType: 'OFF',
          updateInterval: null
        }
      }
    },
    isBoundWithProductionProgress: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      setting: {
        updateType: 'OFF',
        updateInterval: null,
        updateSystemInterval: '60',
        updateCustomInterval: '100'
      },
      UPDATE_TYPE
    }
  },
  computed: {
    updateTypeOptions () {
      return [
        { key: UPDATE_TYPE.PRESET, label: this.$t('schedule.rolling.autoUpdateBySystemDefault') },
        { key: UPDATE_TYPE.CUSTOM, label: this.$t('schedule.rolling.autoUpdateByCustom') },
        { key: UPDATE_TYPE.OFF, label: this.$t('schedule.rolling.disable') }
      ]
    },
    intervalOption () {
      return [
        { value: '1', label: this.$t('schedule.base.everyMinute', { number: 1 }) },
        { value: '5', label: this.$t('schedule.base.everyMinute', { number: 5 }) },
        { value: '15', label: this.$t('schedule.base.everyMinute', { number: 15 }) },
        { value: '30', label: this.$t('schedule.base.everyMinute', { number: 30 }) },
        { value: '60', label: this.$t('schedule.base.everyMinute', { number: 60 }) },
        { value: '1440', label: this.$t('schedule.base.everyHour', { number: 24 }) },
        { value: '10080', label: this.$t('schedule.base.everyDay', { number: 7 }) },
        { value: '43200', label: this.$t('schedule.base.everyDay', { number: 30 }) }
      ]
    }
  },
  watch: {
    isBoundWithProductionProgress (value) {
      // 綁定狀態改變，後端會將後台設定 - 塞入預設值
      if (!value) {
        this.setting.updateType = UPDATE_TYPE.OFF
      }
    }
  },
  mounted () {
    this.setting.updateType = this.originalSetting.updateType
    switch (this.setting.updateType) {
      case UPDATE_TYPE.PRESET:
        this.setting.updateSystemInterval = String(this.originalSetting.updateInterval)
        break
      case UPDATE_TYPE.CUSTOM:
        this.setting.updateCustomInterval = String(this.originalSetting.updateInterval)
    }
  },
  methods: {
    onSelectedUpdateTypeChanged () {
      if (this.setting.updateType !== UPDATE_TYPE.OFF) return
      this.$emit('change', {
        updateType: UPDATE_TYPE.OFF,
        updateInterval: null
      })
    },
    onIntervalChanged (updateType, updateInterval) {
      this.$emit('change', { updateType, updateInterval })
    }
  }
}
</script>

<style lang="scss" scoped>
.option-label {
  height: 40px;
  display: flex;
  align-items: center;
  .default-select {
    margin-bottom: 0;
    padding-bottom: 0;
    margin-left: 8px;
    ::v-deep .el-input__inner {
      height: 39px;
      line-height: 39px;
    }
  }
  .default-input {
    margin-left: 8px;
  }
}
</style>
