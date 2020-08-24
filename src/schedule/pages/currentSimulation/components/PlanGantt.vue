<template>
  <div
    class="plan-gantt gantt"
  >
    <div
      class="gantt__header"
    >
      <h3 class="gantt__title">
        {{ $t('schedule.schedule.ganttChart') }}
      </h3>
    </div>
    <div
      class="gantt__info"
    >
      <span
        class="gantt__info--description"
      >
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
    <div
      v-if="isLoading || isJobEmpty"
      class="empty-block"
    >
      <span
        v-if="isJobEmpty"
        class="empty-block__text"
      > {{ $t('schedule.table.noData') }} </span>
      <spinner v-else />
    </div>
    <v-gantt-chart
      v-else
      class="schedule-gantt-chart"
      :start-time="startTime"
      :end-time="endTime"
      :datas="ganttChartDataList"
      :cell-width="100"
      :cell-height="40"
      :title-height="56"
      :title-width="168"
      :scale="scale"
      :scroll-to-postion="position"
      @scroll-left="scrollToLeft"
    >
      <template v-slot:block="{ data, item }">
        <schedule-item
          :item="item"
          :display-time="scale"
          :searched-order-id="searchedOrderId"
          @search-order="searchOrder"
          @cancel-search-order="cancelSearchOrder"
        />
      </template>
      <template v-slot:left="{data}">
        <schedule-label
          :info="data"
          :cell-height="40"
        />
      </template>
      <template v-slot:title>
        {{ $t('schedule.simulation.scheduleResult.equipmentId') }}
      </template>
    </v-gantt-chart>
  </div>
</template>

<script>
import ScheduleItem from '@/schedule/pages/simulation/result/components/ScheduleItem'
import ScheduleLabel from '@/schedule/pages/simulation/result/components/ScheduleLabel'
import { getMachinePlanResult, getMachinePlanExcludeList } from '@/schedule/API/Plan'
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'PlanGantt',
  components: {
    ScheduleItem,
    ScheduleLabel
  },
  data () {
    return {
      isLoading: true,
      isJobEmpty: false,
      isProcessing: false,
      scale: 60,
      position: {},
      searchedOrderId: null,
      ganttChartDataList: [],
      startTime: null,
      endTime: null,
      timeLines: [{
        time: null,
        color: '#1eb8c7'
      }]
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['equipments']),
    scaleList () {
      const scales = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440]
      return scales.map(scale => {
        const value = parseInt(scale)
        let label
        if (value < 60) {
          label = value + this.$t('schedule.simulation.scheduleResult.minute')
        } else if (value >= 60 && value < 1440) {
          label = value / 60 + this.$t('schedule.simulation.scheduleResult.hour')
        } else {
          label = value / 1440 + this.$t('schedule.simulation.scheduleResult.day')
        }
        return {
          value,
          label
        }
      })
    }
  },
  mounted () {
    this.fetchGanttChartData()
  },
  methods: {
    ...mapMutations('scheduleSetting', ['setEquipments']),
    fetchGanttChartData () {
      this.isLoading = true
      this.ganttChartDataList = []

      const getOperationInfo = getMachinePlanResult(0, 0, true)
      const getExcludeInfo = getMachinePlanExcludeList()
      const getEquipmentInfo = this.$store.dispatch('scheduleSetting/getEquipments')

      Promise.all([getOperationInfo, getExcludeInfo, getEquipmentInfo])
        .then(([operateData, restData, equipmentData]) => {
          if (operateData.length === 0) {
            this.isLoading = false
            this.isJobEmpty = true
            return
          }
          const tempChartList = {}
          let startTime
          let endTime

          this.setEquipments(equipmentData)

          // 整理排除時段的資料
          restData = restData.reduce((acc, cur) => {
            const restSchedule = cur.reasons.map(reason => ({
              ...reason,
              equipmentId: cur.equipmentId
            }))
            acc.push(...restSchedule)
            return acc
          }, [])

          // 結合正常和排除時段的資料
          const schedule = [...operateData, ...restData]

          schedule.forEach(item => {
            if (!tempChartList[item.equipmentId]) {
              tempChartList[item.equipmentId] = {}
              tempChartList[item.equipmentId].gtArray = [{
                ...item,
                start: item.startTime || item.startDatetime,
                end: item.endTime || item.endDatetime
              }]
              tempChartList[item.equipmentId].id = item.equipmentId
              tempChartList[item.equipmentId].name = item.equipment
            } else {
              tempChartList[item.equipmentId].gtArray.push({
                ...item,
                start: item.startTime || item.startDatetime,
                end: item.endTime || item.endDatetime
              })
            }

            const currentStartTime = moment(item.startTime || item.startDatetime)
            const currentEndTime = moment(item.endTime || item.endDatetime)

            // 找出最早和最晚時間
            if (!startTime || !endTime) {
              startTime = currentStartTime
              endTime = currentEndTime
            } else {
              if (currentStartTime.diff(startTime) < 0) startTime = currentStartTime
              if (currentEndTime.diff(endTime) > 0) endTime = currentEndTime
            }
          })

          this.startTime = startTime.format('YYYY-MM-DD HH:mm:ss')
          this.endTime = endTime.format('YYYY-MM-DD HH:mm:ss')

          for (const equipmentId in tempChartList) {
            tempChartList[equipmentId].name = this.equipments.find(item => item.id === Number(equipmentId)).name
            this.ganttChartDataList.push(tempChartList[equipmentId])
          }

          this.isLoading = false
        })
    },
    scrollToLeft (value) {
      this.position = { x: value }
    },
    searchOrder (orderId) {
      this.searchedOrderId = orderId
    },
    cancelSearchOrder () {
      this.searchedOrderId = null
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
