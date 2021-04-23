<template>
  <el-popover
    popper-class="job-detail-dialog job"
    placement="bottom"
    trigger="hover"
    width="260"
  >
    <div
      slot="reference"
      :class="['job__chart', getScheduleItemClass(item.type, item.priority)]"
    >
      {{ shouldShowLabel(item.type) ? item.type : null }}
    </div>
    <div class="job__detail">
      <div class="job__detail-description">
        <div v-if="item.patientID">Patient ID: {{ item.patientID }}</div>
        <div v-if="item.surgeryType">Surgery Type: {{ item.surgeryType }}</div>
        <div>Type: {{ item.type }}</div>
        <div>Start: {{ item.start }}</div>
        <div>End: {{ item.end }}</div>
        <div v-if="item.noShowProbability">No Show Probability: {{ item.noShowProbability }}</div>
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
    shouldShowLabel (type) {
      return type !== 'surgery' && type !== 'stay'
    },
    getScheduleItemClass (type, priority) {
      switch (priority) {
        case 1:
          return 'job__chart--highlight'
      }

      switch (type) {
        case 'surgery':
        case 'stay':
          return 'job__chart--ordinary'
      }
      return 'job__chart--break'
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
    text-transform: capitalize;
    height: 25px;
    border-radius: 4px;
    margin-top: 7px;
    font-size: 12px;
    line-height: 23px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
    &:hover {
      background-color: $theme-color-warning;
    }
    &--highlight {
      background-color: $theme-color-danger;
    }
    &--break {
      color: var(--color-text);
      border: 1px solid #FFFFFF;
    }

    &--ordinary {
      min-width: 1px;
      background-color: #2AD2E2;
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
