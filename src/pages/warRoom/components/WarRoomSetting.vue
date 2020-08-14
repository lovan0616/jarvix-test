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
            v-model="warRoomData.publishName"
            class="input setting__block-text-input">
        </div>
        <div class="setting__block">
          <div class="setting__block-title">
            {{ $t('warRoom.timeIntervalConstraint') }}
            <el-switch
              v-model="warRoomData.displayDateRangeSwitch"
              :disabled="isProcessing"
              :width="Number('32')"
              active-color="#2AD2E2"
              inactive-color="#324B4E"/>
          </div>
          <div
            v-if="warRoomData.displayDateRangeSwitch"
            class="setting__block-select-field"
          >
            <default-select 
              v-validate="'required'"
              :value="selectedTimeInterval"
              :option-list="timeIntervalConstraint.timeIntervalList"
              :placeholder="$t('warRoom.chooseTimeInterval')"
              :is-disabled="isProcessing"
              class="setting__block-select"
              name="timeIntervalConstraint"
              @change="updateTimeInterval"
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
  props: {
    configData: {
      type: Object,
      default: () => ({
        customEndTime: null,
        customStartTime: null,
        displayDateRangeSwitch: false,
        publishName: null,
        recentTimeIntervalAmount: null,
        recentTimeIntervalUnit: null
      })
    }
  },
  data () {
    return {
      warRoomData: null,
      publishedName: '未命名戰情室',
      isProcessing: false,
      timeIntervalConstraint: {
        timeIntervalList: [
          {
            value: '1Hour',
            name: this.$t('warRoom.inHours', { number: 1 })
          },
          {
            value: '1Day',
            name: this.$t('warRoom.inDays', { number: 1 })
          },
          {
            value: '1Week',
            name: this.$t('warRoom.inWeeks', { number: 1 })
          },
          {
            value: '1Month',
            name: this.$t('warRoom.inMonths', { number: 1 })
          },
          {
            value: '1Season',
            name: this.$t('warRoom.inSeasons', { number: 1 })
          },
          {
            value: '1Year',
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
  computed: {
    selectedTimeInterval () {
      if (!this.warRoomData) return null
      // 確認使用者是自訂時間區間或選擇預設選項
      if (!this.warRoomData.customStartTime) return 'others'
      return this.warRoomData.recentTimeIntervalAmount + this.warRoomData.recentTimeIntervalUnit
    }
  },
  mounted () {
    this.warRoomData = JSON.parse(JSON.stringify(this.configData))
  },
  methods: {
    saveSetting () {

    },
    deleteWarRoom () {

    },
    updateTimeInterval (value) {
    
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