<template>
  <section class="setting">
    <div class="setting__header">
      <div class="setting__title">
        <svg-icon 
          icon-class="filter-setting" 
          class="setting__header-icon"/>
        {{ $t('warRoom.setting') }}
      </div>
      <span 
        class="setting__close-icon">
        <svg-icon 
          icon-class="close" 
          class="setting__header-icon"/>
      </span>
    </div>
    <section class="general-setting">
      <div class="setting__block">
        <div class="setting__block-title">
          {{ $t('warRoom.displayName') }}
        </div>
        <input
          v-model="componentName"
          class="input setting__block-text-input">
      </div>
      <div class="setting__block">
        <div class="setting__block-title">
          {{ $t('warRoom.sourceData') }}
          <a
            href="javascript:void(0);" 
            class="link"
          >
            {{ $t('button.delete') }}
          </a>
        </div>
        <div class="setting__block-choose">
          {{ selectedDataSource }}
          <svg-icon 
            icon-class="arrow-right" 
            class="icon"/>
        </div>
      </div>
      <div class="setting__block">
        <div class="setting__block-title">
          {{ $t('warRoom.updateFrequency') }}
          <el-switch
            v-model="updateFrequency.active"
            :disabled="isProcessing"
            :width="Number('32')"
            active-color="#2AD2E2"
            inactive-color="#324B4E"/>
        </div>
        <div
          v-if="updateFrequency.active"
          class="setting__block-select-field"
        >
          <default-select 
            v-validate="'required'"
            v-model="updateFrequency.selectedBasicSchedule"
            :option-list="updateFrequency.basicScheduleList"
            :placeholder="$t('warRoom.chooseUpdateFrequency')"
            :is-disabled="isProcessing"
            class="setting__block-select"
            name="updateFrequency"
          />
          <div 
            v-show="errors.has('updateFrequency')"
            class="error-text"
          >{{ errors.first('updateFrequency') }}</div>
        </div>
      </div>
      <div class="setting__block">
        <div class="setting__block-title">
          {{ $t('warRoom.timeIntervalConstraint') }}
          <el-switch
            v-model="timeIntervalConstraint.active"
            :disabled="isProcessing"
            :width="Number('32')"
            active-color="#2AD2E2"
            inactive-color="#324B4E"/>
        </div>
        <div
          v-if="timeIntervalConstraint.active"
          class="setting__block-select-field"
        >
          <default-select 
            v-validate="'required'"
            v-model="timeIntervalConstraint.selectedTimeInterval"
            :option-list="timeIntervalConstraint.timeIntervalList"
            :placeholder="$t('warRoom.chooseTimeInterval')"
            :is-disabled="isProcessing"
            class="setting__block-select"
            name="timeIntervalConstraint"
          />
          <div 
            v-show="errors.has('timeIntervalConstraint')"
            class="error-text"
          >{{ errors.first('timeIntervalConstraint') }}</div>
        </div>
        <div
          v-if="timeIntervalConstraint.active && timeIntervalConstraint.selectedTimeInterval === 'others'"
          :class="{ 'has-error': errors.first('startTime') }"
          class="setting__block-date-field date-picker"
        >
          <div class="date-picker__container">
            <el-date-picker
              v-model="timeIntervalConstraint.customTimeInterval.startTime"
              :picker-options="timeIntervalConstraint.customTimeInterval.pickerOptions"
              :placeholder="'*' + $t('warRoom.startDate')"
              :clearable="true"
              class="date-picker__item"
              size="small"
              type="date"
              name="startTime"/>
            <div class="date-picker__seperator">-</div>
            <el-date-picker
              v-model="timeIntervalConstraint.customTimeInterval.endTime"
              :picker-options="timeIntervalConstraint.customTimeInterval.pickerOptions"
              :placeholder="$t('warRoom.endDate')"
              :clearable="true"
              class="date-picker__item"
              size="small"
              type="date"
              name="endTime"/>
          </div>
          <div 
            class="error-text"
          >{{ errors.first('startTime') }}</div>
          <div class="date-picker__reminder">{{ '*' + $t('warRoom.timeIntervalReminder') }}</div>
        </div>
      </div>
      <div class="setting__block">
        <div class="setting__block-title">
          {{ $t('warRoom.thresholdSetting') }}
          <el-switch
            v-model="thresholdSetting.active"
            :disabled="isProcessing"
            :width="Number('32')"
            active-color="#2AD2E2"
            inactive-color="#324B4E"/>
        </div>
        <div
          v-if="thresholdSetting.active"
          class="setting__block-text"
        >
          <label class="input setting__block-text-label">
            {{ $t('warRoom.maxThreshold') }}
          </label>
          <input
            v-model="thresholdSetting.max"
            :placeholder="$t('warRoom.pleaseEnterValue')"
            name="maxThreshold"
            class="input setting__block-text-input">
          <label class="input setting__block-text-label">
            {{ $t('warRoom.minThreshold') }}
          </label>
          <input
            v-model="thresholdSetting.min"
            :placeholder="$t('warRoom.pleaseEnterValue')"
            name="minThreshold"
            class="input setting__block-text-input">
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'ComponentSetting',
  inject: ['$validator'],
  components: {
    DefaultSelect
  },
  data () {
    return {
      componentName: '未命名標題',
      selectedDataSource: '營運銷售概況',
      isProcessing: false,
      updateFrequency: {
        active: false,
        selectedBasicSchedule: null,
        basicScheduleList: [
          {
            value: '*/5 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 5 })
          },
          {
            value: '*/15 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 15 })
          },
          {
            value: '*/30 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 30 })
          },
          {
            value: '*/45 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 45 })
          },
          {
            value: '0 * * * *',
            name: this.$t('warRoom.everyHour')
          },
          {
            value: '0 0 * * *',
            name: this.$t('warRoom.everyDay')
          },
          {
            value: '0 0 * * 0',
            name: this.$t('warRoom.everyWeek')
          },
          {
            value: '0 0 1 * *',
            name: this.$t('warRoom.everyMonth')
          }
        ],
      },
      timeIntervalConstraint: {
        active: false,
        selectedTimeInterval: null,
        timeIntervalList: [
          {
            value: '*/5 * * * *',
            name: this.$t('warRoom.inHours', { number: 1 })
          },
          {
            value: '*/15 * * * *',
            name: this.$t('warRoom.inDays', { number: 1 })
          },
          {
            value: '*/30 * * * *',
            name: this.$t('warRoom.inWeeks', { number: 1 })
          },
          {
            value: '*/45 * * * *',
            name: this.$t('warRoom.inMonths', { number: 1 })
          },
          {
            value: '0 * * * *',
            name: this.$t('warRoom.inYears', { number: 1 })
          },
          {
            value: 'others',
            name: this.$t('warRoom.customize')
          }
        ],
        customTimeInterval: {
          startTime: '',
          endTime: '',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            firstDayOfWeek: 1
          }
        }
      },
      thresholdSetting: {
        active: false,
        max: '',
        min: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  width: 280px;
  &__header {
    display: flex;
    justify-content: space-between;
    padding: 16px 26px;
    border-bottom: 1px solid #464A50;
  }

  &__header-icon {
    color: #2AD2E2;
  }

  &__block {
    padding: 16px 26px;
    border-bottom: 1px solid #464A50;
  }

  &__block-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #AAAAAA;
    font-weight: 600;
  }

  &__block-text-input {
    line-height: 39px;
    font-size: 16px;
    color: #FFFFFF;
    border-bottom: 1px solid #FFFFFF;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 40px;
  }

  &__block-choose {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    cursor: pointer;
  }

  &__block-select {
    width: 100%;
    /deep/ .el-input__inner {
      padding-left: 0;
      border-bottom: 1px solid #FFFFFF;
    }
  }

  &__block-select-field {
    margin-top: 8px;
  }

  &__block-date-field {
    margin-top: 8px;
  }

  &__block-text-label {
    display: block;
    margin-top: 16px;
    border: 0;
  }

  .date-picker {
    &__container {
      display: flex;
      align-items: center;
    }

    &__seperator {
      padding: 0 8px;
    }

    &__reminder {
      margin-top: 8px;
      color: #FFDF6F;
      font-size: 12px;
    }

    /deep/ .el-input {
      &__prefix {
        display: none;
      }

      &__suffix {
        right: -3px;
      }

      &__inner {
        border: none;
        border-bottom: 1px solid #FFFFFF;
        border-radius: 0;
        font-size: 16px;
        padding-left: 0;
        padding-right: 20px;
        background-color: transparent;
        color: $theme-text-color;
      }
    }
  }
}
</style>