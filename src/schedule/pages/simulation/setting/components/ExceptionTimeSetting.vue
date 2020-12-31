<template>
  <div class="exception-setting">
    <div class="setting__title">
      {{ title }}
    </div>
    <div class="setting__content">
      <span class="reminding">
        <i class="el-icon-warning-outline" />
        {{ $t('schedule.setting.availableWithinPeriod') }}
      </span>
      <div
        v-for="(period, index) in periods"
        :key="index + periods.length"
        class="time__wrapper"
      >
        <default-date-picker
          :deletable="true"
          :value="[period.startDatetime, period.endDatetime]"
          :picker-options="pickerOptions"
          @input="changePeriod($event, index)"
          @delete="deletePeriod(index)"
        />
      </div>
      <div class="add-btn__wrapper">
        <default-button
          class="add-btn"
          type="secondary"
          @click="addPeriod"
        >
          <i class="el-icon-plus" />
          {{ $t('schedule.setting.addPeriod') }}
        </default-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ExceptionTimeSetting',
  props: {
    title: {
      type: String,
      default: ''
    },
    periods: {
      type: Array,
      default: () => []
    },
    startDate: {
      type: String,
      default: ''
    },
    scheduleDays: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          const y = this.startDate.split('/')[0]
          const m = this.startDate.split('/')[1] - 1
          const d = this.startDate.split('/')[2]
          return time.getTime() < moment([y, m, d]).valueOf() ||
                 time.getTime() > moment([y, m, d]).add(this.scheduleDays, 'days').valueOf()
        }
      }
    }
  },
  methods: {
    addPeriod (index) {
      this.periods.push({
        startDatetime: '',
        endDatetime: ''
      })
    },
    deletePeriod (index) {
      this.periods.splice(index, 1)
    },
    changePeriod (newVal, index) {
      this.$set(this.periods[index], 'startDatetime', newVal[0])
      this.$set(this.periods[index], 'endDatetime', newVal[1])
    }
  }
}
</script>

<style lang="scss" scoped>
.exception-setting {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-top: 24px;
  .setting__title {
    flex: 0 0 140px;
    line-height: 32px;
    font-size: 14px;
  }
  .setting__content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
}
.time__wrapper {
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 16px;
}
.add-btn__wrapper {
  flex-basis: 100%;
}

.reminding {
  flex-basis: 100%;
  font-size: 12px;
  line-height: 32px;
  color: var(--color-warning);

}
</style>
