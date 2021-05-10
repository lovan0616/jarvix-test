<template>
  <div class="plan-gantt gantt">
    <div class="gantt__header">
      <h3 class="gantt__title">
        {{ $t('schedule.schedule.ganttChart') }}
      </h3>
    </div>
    <div class="gantt__info">
      <span class="gantt__info--description">
        {{ $t('schedule.schedule.ganttInfo') }}
      </span>
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
    <gantt-chart :scale="scale" />
  </div>
</template>

<script>
import GanttChart from '@/schedule/components/chart/gantt/GanttChart'

export default {
  name: 'PlanGantt',
  components: {
    GanttChart
  },
  data () {
    return {
      isLoading: true,
      isJobEmpty: false,
      scale: 60,
    }
  },
  computed: {
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
  &__header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    margin-bottom: 12px;
    cursor: pointer;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    margin-top: 0;
    margin-bottom: 0;

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

      /deep/ .el-input .el-input__inner {
        height: 30px;
        line-height: 30px;
      }

      /deep/ .el-select__caret {
        color: var(--color-text-light);
        font-weight: bold;
      }
    }
  }

}
</style>
