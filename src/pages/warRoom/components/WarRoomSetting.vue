<template>
  <section class="setting">
    <div class="setting__header">
      <div class="setting__title">
        <svg-icon 
          icon-class="control-board" 
          class="setting__header-icon"/>
        {{ $t('warRoom.warRoomSetting') }}
      </div>
      <span
        class="setting__close-icon"
        @click="$emit('close')">
        <svg-icon 
          icon-class="close" 
          class="setting__header-icon"/>
      </span>
    </div>
    <section class="setting__content">
      <div class="setting__block-container">
        <div class="setting__block">
          <div class="setting__block-title">
            {{ $t('warRoom.publishedName') }}
          </div>
          <input
            v-model="publishedName"
            class="input setting__block-text-input">
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
      </div>
      <div class="setting__button-block">
        <button 
          type="button"
          class="btn btn-outline setting__button-block-button--left"
          @click="deleteWarRoom"
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
  </section>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'WarRoomSetting',
  inject: ['$validator'],
  components: {
    DefaultSelect
  },
  data () {
    return {
      publishedName: '未命名戰情室',
      isProcessing: false,
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
      }
    }
  },
  methods: {
    saveSetting () {

    },
    deleteWarRoom () {

    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
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