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
            v-validate="'required'"
            v-model="warRoomData.publishName"
            name="warRoomName"
            class="input setting__block-text-input">
          <div 
            v-show="errors.has('warRoomName')"
            class="error-text"
          >{{ errors.first('warRoomName') }}</div>
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
            v-if="warRoomData.displayDateRangeSwitch && selectedTimeInterval === 'others'"
            class="setting__block-date-field date-picker"
          >
            <div class="date-picker__container">
              <el-date-picker
                v-validate="'required'"
                v-model="warRoomData.customStartTime"
                :picker-options="timeIntervalConstraint.customTimeInterval.pickerOptions"
                :placeholder="$t('warRoom.startDate')"
                :clearable="true"
                :class="{ 'has-error': errors.first('startTime') }"
                class="date-picker__item"
                size="small"
                type="date"
                name="startTime"/>
              <div class="date-picker__seperator">-</div>
              <el-date-picker
                v-model="warRoomData.customEndTime"
                :picker-options="timeIntervalConstraint.customTimeInterval.pickerOptions"
                :placeholder="'*' + $t('warRoom.endDate')"
                :clearable="true"
                class="date-picker__item"
                size="small"
                type="date"
                name="endTime"/>
            </div>
            <div
              v-show="errors.has('startTime')"
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
import { Message } from 'element-ui'
import {
  updateWarRoomSetting,
  deleteWarRoom
} from '@/API/WarRoom'

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
      isProcessing: false,
      timeIntervalConstraint: {
        timeIntervalList: [
          {
            value: '1+Hour',
            name: this.$t('warRoom.inHours', { number: 1 })
          },
          {
            value: '1+Day',
            name: this.$t('warRoom.inDays', { number: 1 })
          },
          {
            value: '1+Week',
            name: this.$t('warRoom.inWeeks', { number: 1 })
          },
          {
            value: '1+Month',
            name: this.$t('warRoom.inMonths', { number: 1 })
          },
          {
            value: '1+Season',
            name: this.$t('warRoom.inSeasons', { number: 1 })
          },
          {
            value: '1+Year',
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
      if (!this.warRoomData || !this.warRoomData.displayDateRangeSwitch) return null
      
      // 確認是否選擇預設區間
      if (this.warRoomData.recentTimeIntervalAmount && this.warRoomData.recentTimeIntervalUnit) {
        return `${this.warRoomData.recentTimeIntervalAmount}+${this.warRoomData.recentTimeIntervalUnit}`
      }
      
      // 如果沒有選擇預設則為自訂區間
      return 'others'
    }
  },
  mounted () {
    this.warRoomData = JSON.parse(JSON.stringify(this.configData))
  },
  methods: {
    saveSetting () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        const { war_room_id: warRoomId } = this.$route.params
        updateWarRoomSetting(warRoomId, this.warRoomData)
          .then(() => {
            this.$emit('update:config-data', this.warRoomData)
            this.$emit('close')
          })
          .finally(() => { this.isProcessing = false })
      })
    },
    deleteWarRoom () {
      const { war_room_id: warRoomId } = this.$route.params
      this.isProcessing = true
      deleteWarRoom(warRoomId)
        .then(() => {
          this.$router.push({ name: 'WarRoomList' })
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => { this.isProcessing = false })
    },
    updateTimeInterval (value) {
      const isDefaultTimeInterval = value.indexOf('+') !== -1

      // 選擇自訂
      if (!isDefaultTimeInterval) {
        this.warRoomData.recentTimeIntervalAmount = null
        this.warRoomData.recentTimeIntervalUnit = null
        return
      }

      // 選擇預設時間區間
      // 避免自訂欄位資料被清空觸發重新驗證，但欄位已經被 v-if 移除產生錯誤
      this.$validator.detach('startTime')
      this.warRoomData.recentTimeIntervalAmount = value.split('+')[0]
      this.warRoomData.recentTimeIntervalUnit = value.split('+')[1]
      this.warRoomData.customEndTime = null
      this.warRoomData.customStartTime = null
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  &__block-select {
    /deep/ .el-input__inner {
      border-bottom: 1px solid #FFFFFF;
    }
  }

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