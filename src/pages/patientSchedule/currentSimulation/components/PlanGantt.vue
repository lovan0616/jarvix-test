<template>
  <div class="plan-gantt gantt">
    <div class="gantt__header">
      <h3 class="gantt__title">
        Gantt Chart
      </h3>
    </div>
    <div class="gantt__info">
      <span class="gantt__info--description">
        OT Room Gantt
      </span>
      <div class="gantt__select">
        <span class="gantt__select--label">
          View Point
        </span>
        <default-select
          v-model="scale"
          :options="scaleList"
          class="gantt__select--input"
        />
      </div>
    </div>
    <spinner v-if="isLoading"/>
    <v-gantt-chart
      v-else
      :datas="ganttChartDataList"
      :cell-width="100"
      :cell-height="40"
      :title-height="56"
      :title-width="168"
      :scale="scale"
      :scroll-to-postion="position"
      start-time="2021-01-07 08:10:00"
      end-time="2021-01-10 17:45:50"
      class="schedule-gantt-chart"
      @scroll-left="scrollToLeft"
    >
      <template v-slot:block="{ data, item }">
        <schedule-item
          :item="item"
          :display-time="scale"
        />
      </template>
      <template v-slot:left="{data}">
        <schedule-label
          :info="data"
          :cell-height="40"
        />
      </template>
      <template v-slot:title>
        Room ID
      </template>
    </v-gantt-chart>
  </div>
</template>

<script>
import ScheduleItem from '@/pages/patientSchedule/simulation/result/components/ScheduleItem'
import ScheduleLabel from '@/pages/patientSchedule/simulation/result/components/ScheduleLabel'
import { mapState } from 'vuex'

export default {
  name: 'PlanGantt',
  components: {
    ScheduleItem,
    ScheduleLabel
  },
  data () {
    return {
      isLoading: false,
      scale: 360,
      position: {},
      ganttChartDataList: [
        {
          'gtArray': [
            {
              type: 'surgeory', // 或者可以填入其他手術室排除時段，名稱打什麼都可以
              roomName: 'Room_1',
              patientId: 'AC000001',
              surgeon: 'John',
              surgeryTime: '10:00 - 15:00',
              surgeryType: 'CKK2-1234',
              assistant: 'Patrick W.',
              anesthetist: 'H.W.L.',
              plannedDate: '2021/3/1',
              priority: 1,
              start: '2021-01-07 08:10',
              end: '2021-01-08 06:00'
            },
            {
              type: 'surgeory',
              roomName: 'Room_1',
              patientId: 'AC000001',
              surgeon: 'John',
              surgeryTime: '10:00 - 15:00',
              surgeryType: 'CKK2-1234',
              assistant: 'Patrick W.',
              anesthetist: 'H.W.L.',
              plannedDate: '2021/3/1',
              priority: 1,
              start: '2021-01-08 09:00',
              end: '2021-01-09 08:37'
            },
            {
              type: 'Cleaning', // 手術室排除事件
              start: '2021-01-08 07:00',
              end: '2021-01-08 08:00'
            }
          ],
          name : 'Room_1' // 顯示在甘特圖左邊的手術室名稱
        }
      ]
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['equipments']),
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
  methods: {
    scrollToLeft (value) {
      this.position = { x: value }
    }
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
      width: 96px;

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

  /deep/.gantt-timeline {
    margin-left: 0 !important;
  }

  /deep/ .gantt-container {
    width: 100% !important;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /deep/ .gantt-scroll-y {
    display: none;
  }

  .empty-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    background: var(--color-bg-gray);
    border-radius: 8px;

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
      margin-bottom: 16px;
    }
  }
}
</style>
