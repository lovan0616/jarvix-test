<template>
  <el-popover
    popper-class="job-detail-dialog job"
    placement="bottom"
    trigger="hover"
    width="230"
  >
    <div
      slot="reference"
      :class="[item.reason ? 'job__chart--break' : 'job__chart--ordinary', { 'active': item.job === searchedJob }]"
      :style="{ 'background-color': itemBackgroundColor }"
      @mouseenter="handleMouseEnter(item.job)"
      @mouseleave="handleMouseLeave(item.job)"
    >
      {{ item.reason ? $t(`schedule.setting.${item.reason}`) : null }}
    </div>
    <div class="job__detail">
      <div class="job__detail-title">
        {{ item.reason ? $t(`schedule.setting.${item.reason}`) : `${$t('schedule.simulation.scheduleResult.jobNo')}：${item.job}` }}
      </div>
      <div class="job__detail-description">
        <template v-if="item.reason">
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.scheduleResult.startTime') }}：{{ item.start }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.scheduleResult.endTime') }}：{{ item.end }}
          </div>
        </template>
        <template v-else>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.changeLineTime') }}：{{ getHoursDiff(item.checkinTime, item.startTime) }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.produceTime') }}：{{ getHoursDiff(item.startTime, item.endTime) }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.checkinTime') }}：{{ item.checkinTime }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.checkoutTime') }}：{{ item.checkoutTime }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.product') }}：{{ item.product }}
          </div>
        </template>
      </div>
    </div>
  </el-popover>
</template>
<script>
import moment from 'moment'
import jobColorVar from '@/schedule/styles/common/_variables.scss'

export default {
  name: 'ScheduleItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    searchedJob: {
      type: String,
      default: ''
    },
    jobStates: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      jobColorVar
    }
  },
  computed: {
    itemBackgroundColor () {
      return this.item.reason ? 'transparent' : jobColorVar[this.jobState.toLowerCase()]
    },
    jobState () {
      if (!this.item.withinScheduleTime && this.item.delayed) return this.jobStates.OVERDUE_DELAY
      if (this.item.delayed) return this.jobStates.DELAYED
      if (!this.item.withinScheduleTime) return this.jobStates.OVERDUE
      if (this.item.scheduled) return this.jobStates.SCHEDULED
      return this.jobStates.GENERAL
    }
  },
  methods: {
    handleMouseEnter (job) {
      if (!job) return
      this.$emit('search-job', job)
    },
    handleMouseLeave (job) {
      if (!job) return
      this.$emit('cancel-search-job')
    },
    getHoursDiff (startTime, endTime) {
      const duration = moment(endTime).diff(moment(startTime), 'minutes')
      return `${this.padZero(Math.floor(duration / 60))} ${this.$t('schedule.base.hour')} ${this.padZero(duration % 60)} ${this.$t('schedule.base.minute')}`
    },
    padZero (value) {
      return value < 10 ? `0${value}` : value
    }
  }
}
</script>
<style lang="scss" scoped>
.job {
  &__detail-title {
    font-weight: 600;
    margin-bottom: 16px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #555858;
    }
  }

  &__chart {
    &--break {
      height: 25px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 23px;
      margin-top: 7px;
      color: var(--color-text);
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: top;
      border: 1px solid #FFFFFF;
      cursor: pointer;
    }

    &--ordinary {
      min-width: 1px;
      height: 25px;
      border-radius: 4px;
      margin: 7px 2px 0 0;
      transition: background-color .2s linear;
      cursor: pointer;
      &.active { background-color: #AAA !important; }
    }
  }

  &__detail-info-row {
    font-size: 12px;
    color: #fff;
    &:not(:last-child) { margin-bottom: 4px; }
  }
}
</style>
<style lang="scss">
.job-detail-dialog.el-popover {
  border-radius: 8px;
  box-shadow: 0 4px 4px 0 rgba(26, 56, 62, 0.5);
  border: solid 1px #4de2f0;
  background-color: rgba(24, 24, 24, 0.95);

  &[x-placement^=top] .popper__arrow::after {
    border-top-color: #4de2f0;
    bottom: 0;
  }
  &[x-placement^=bottom] .popper__arrow::after {
    border-bottom-color: #4de2f0;
    top: 0;
  }
}
</style>
