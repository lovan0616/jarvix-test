<template>
  <el-popover
    popper-class="job-detail-dialog job"
    placement="bottom"
    trigger="hover"
    width="230"
  >
    <div
      slot="reference"
      :class="[item.type !== 'surgeory' ? 'job__chart--break' : 'job__chart--ordinary']"
    />
    <div class="job__detail">
      <div class="job__detail-description">
        <div>Patient ID: {{ item.patientId }}</div>
        <div>SurgeryType: {{ item.surgeryType }}</div>
        <div>Start: {{ item.start }}</div>
        <div>End: {{ item.end }}</div>
        <div>Type: {{ item.type }}</div>
      </div>
    </div>
  </el-popover>
</template>
<script>

export default {
  name: 'ScheduleItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    searchedOrderId: {
      type: Number,
      default: null
    }
  },
  methods: {
    // handleMouseEnter (orderId) {
    //   if (!orderId) return
    //   this.$emit('search-order', orderId)
    // },
    // handleMouseLeave (orderId) {
    //   if (!orderId) return
    //   this.$emit('cancel-search-order')
    // },
    // getHoursDiff (startTime, endTime) {
    //   const duration = moment(endTime).diff(moment(startTime), 'minutes')
    //   return `${this.padZero(Math.floor(duration / 60))} ${this.$t('schedule.base.hour')} ${this.padZero(duration % 60)} ${this.$t('schedule.base.minute')}`
    // },
    // padZero (value) {
    //   return value < 10 ? `0${value}` : value
    // }
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
    }

    &--ordinary {
      min-width: 1px;
      height: 25px;
      border-radius: 4px;
      background-color: #2AD2E2;
      margin: 7px 2px 0 0;
      transition: background-color .2s linear;
      &.active { background-color: var(--color-warning); }
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
