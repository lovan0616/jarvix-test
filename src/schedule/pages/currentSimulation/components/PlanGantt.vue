<template>
  <div
    :class="{'is-collapsed': isCollapsed}"
    class="plan-gantt gantt"
  >
    <div class="gantt__header">
      <h3 class="gantt__title">
        {{ $t('schedule.schedule.ganttChart') }}
      </h3>
      <div
        class="collapse-controller"
        @click="isCollapsed = !isCollapsed"
      >
        {{ isCollapsed ? $t('schedule.base.openCollapseItem') : $t('schedule.base.closeCollapseItem') }}
        <i class="icon el-icon-arrow-down" />
      </div>
    </div>
    <div class="gantt__content">
      <div class="gantt__info">
        <span class="gantt__info--description">
          {{ $t('schedule.schedule.ganttInfo') }}
        </span>
        <div class="schedule__header-legend">
          <job-status-legend :job-states="innerJobStates" />
        </div>
        <div class="gantt__select">
          <span class="gantt__select--label">
            {{ $t('schedule.simulation.scheduleResult.viewScale') }}
          </span>
          <default-select
            v-model="scale"
            :options="scaleList"
            class="gantt__select--input"
          />
        </div>
      </div>
      <gantt-chart
        :max-view-range="maxViewRange"
        :restrictions="restrictions"
        :scale="scale"
      />
    </div>
  </div>
</template>

<script>
import GanttChart from '@/schedule/components/chart/gantt/GanttChart'
import JobStatusLegend from '@/schedule/components/JobStatusLegend'
import { JOB_STATUS } from '@/schedule/utils/enum'
import moment from 'moment'

export default {
  name: 'PlanGantt',
  components: {
    GanttChart,
    JobStatusLegend
  },
  props: {
    planInfo: {
      type: Object,
      default: () => {}
    },
    restrictions: {
      type: Object,
      default: () => {}
    },
    jobStates: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isLoading: true,
      isJobEmpty: false,
      isCollapsed: false,
      scale: 720
    }
  },
  computed: {
    maxViewRange () {
      return {
        startTime: moment(this.planInfo.startDate).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.planInfo.endDate).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    scaleList () {
      return [
        {
          label: this.$t('schedule.simulation.scheduleResult.halfDay'),
          value: 60
        },
        {
          label: 1 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 120
        },
        {
          label: 3 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 360
        },
        {
          label: 7 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 720
        },
        {
          label: 14 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 1440
        }
      ]
    },
    innerJobStates () {
      return [
        JOB_STATUS.GENERAL,
        ...this.jobStates
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.gantt {
  &.is-collapsed {
    .gantt__content {
      max-height: 0;
      opacity: 0;
    }
    .icon {
      transform: rotate(180deg);
    }
  }

  &__header {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 0 0 14px;
    margin-bottom: 12px;
  }

  &__content {
    transition: opacity .2s ease, max-height .3s ease;
    max-height: 1000px; // 這邊設定這麼高，只是為了一定要給一個值 transition 才有效果
    opacity: 1;
    overflow: hidden;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    margin: 0;

    &:before {
      content: "";
      position: absolute;
      left: 0%;
      top: 37.5%;
      width: 6px;
      height: 6px;
      background: #2AD2E2;
    }
  }

  &__info {
    display: flex;
    flex-direction: row;

    &--description {
      font-size: 14px;
      line-height: 18px;
      margin-right: 16px;
      color: var(--color-text-light);
    }
  }

  &__select {
    flex: 1;
    text-align: right;

    &--label {
      font-size: 14px;
      line-height: 18px;
    }

    &--input {
      display: inline-block;
      width: 96px;
      &.default-select {
        padding-bottom: 0;
      }

      ::v-deep .el-input .el-input__inner {
        height: 30px;
        line-height: 30px;
      }

      ::v-deep .el-select__caret {
        color: var(--color-text-light);
        font-weight: bold;
      }
    }
  }

  .collapse-controller {
    cursor: pointer;
    font-size: 14px;
    .icon {
      transition: transform .3s ease;
    }
  }

}
</style>
