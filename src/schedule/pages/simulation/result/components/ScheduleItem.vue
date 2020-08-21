<template>
  <el-popover
    popper-class="job-detail-dialog job"
    placement="bottom"
    trigger="hover"
    width="230"
  >
    <div
      slot="reference"
      :class="[item.reason ? 'job__chart--break' : 'job__chart--ordinary', { 'active': item.orderId === searchedOrderId }]"
      @mouseenter="handleMouseEnter(item.orderId)"
      @mouseleave="handleMouseLeave(item.orderId)"
    >
      {{ item.reason ? $t(`schedule.setting.${item.reason}`) : null }}
    </div>
    <div class="job__detail">
      <div class="job__detail-title">
        {{ item.reason ? $t(`schedule.setting.${item.reason}`) : `${$t('schedule.simulation.scheduleResult.job')}：${item.order}` }}
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
            {{ $t('schedule.simulation.machineResult.arriveTime') }}：{{ item.end }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.checkinTime') }}：{{ item.checkinTime }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.checkoutTime') }}：{{ item.checkoutTime }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.endTime') }}：{{ item.endTime }}
          </div>
          <div class="job__detail-info-row">
            {{ $t('schedule.simulation.machineResult.startTime') }}：{{ item.startTime }}
          </div>
        </template>
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
    handleMouseEnter (orderId) {
      if (!orderId) return
      this.$emit('search-order', orderId)
    },
    handleMouseLeave (orderId) {
      if (!orderId) return
      this.$emit('cancel-search-order')
    }
  }
}
</script>
<style lang="scss" scoped>
.job {
  &__detail-title {
    font-weight: 600;
    color: #43bac3;
    margin-bottom: 8px;
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
      height: 25px;
      border-radius: 4px;
      background-color: #2AD2E2;
      margin: 7px 2px 0 2px;
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
