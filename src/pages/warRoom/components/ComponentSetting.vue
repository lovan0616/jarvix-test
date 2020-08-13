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
        class="setting__close-icon"
        @click="$emit('close')">
        <svg-icon 
          icon-class="close" 
          class="setting__header-icon"/>
      </span>
    </div>
    <section
      v-if="!isShowComponentDataSourceList"
      class="setting__content"
    >
      <div class="setting__block-container">
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
              @click="clearSelectedDataSource"
            >
              {{ $t('button.delete') }}
            </a>
          </div>
          <div
            class="setting__block-choose"
            @click="showComponentDataSourceList"
          >
            {{ componentDataSource.selectedDataSource.name || $t('warRoom.notChosen') }}
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
      </div>
      <div class="setting__button-block">
        <button 
          type="button"
          class="btn btn-outline setting__button-block-button--left"
          @click="saveSetting"
        >
          <svg-icon icon-class="delete" />
        </button>
        <button 
          type="button"
          class="btn btn-default setting__button-block-button--right"
          @click="saveSetting"
        >{{ $t('button.save') }}</button>
      </div>
    </section>
    <component-data-source-list
      v-if="isShowComponentDataSourceList"
      :component-type="componentType"
      :data-souce-list="componentDataSource.dataSouceList"
      @back="hideComponentDataSourceList"
      @select="updateSelectedDataSource"
    />
  </section>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import ComponentDataSourceList from './ComponentDataSourceList'

export default {
  name: 'ComponentSetting',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    ComponentDataSourceList
  },
  props: {
    componentType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      componentName: '未命名標題',
      isShowComponentDataSourceList: false,
      componentDataSource: {
        selectedDataSource: {},
        dataSouceList: {
          indexList: [],
          diagramList: []
        }
      },
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
  },
  methods: {
    saveSetting () {

    },
    showComponentDataSourceList () {
      this.isShowComponentDataSourceList = true
    },
    hideComponentDataSourceList () {
      this.isShowComponentDataSourceList = false
    },
    clearSelectedDataSource () {
      this.componentDataSource.selectedDataSource = {}
    },
    updateSelectedDataSource (item) {
      this.componentDataSource.selectedDataSource = item
      this.hideComponentDataSourceList()
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  &__content {
    justify-content: space-between;
  }

  &__button-block-button {
    &--left {
      min-width: 40px;
      padding: 0 2px;
    }

    &--right {
      min-width: 180px;
      font-weight: 600;
    }
  }
}
</style>