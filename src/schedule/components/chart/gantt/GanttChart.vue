<template>
  <div
    id="my-gantt"
    :style="ganttInitialHeight && { height: ganttInitialHeight + 'px'}"
    class="gantt-wrapper"
  >
    <div
      v-if="isLoading"
      class="empty-block"
    >
      <spinner />
    </div>
    <div
      v-else-if="isJobEmpty"
      class="empty-block"
    >
      <span class="empty-block__text">{{ $t('schedule.base.noData') }}</span>
    </div>
    <div
      v-else-if="hasError"
      class="empty-block"
    >
      <span class="empty-block__text">{{ $t('schedule.base.hasError') }}</span>
    </div>
    <v-gantt-chart
      v-else
      id="my-gantt"
      :start-time="startTime"
      :end-time="endTime"
      :datas="filteredGanttChartDataList"
      :cell-width="100"
      :cell-height="40"
      :title-height="56"
      :title-width="168"
      :scale="scale"
      :scroll-to-postion="position"
      class="schedule-gantt-chart"
      @scroll-left="scrollToLeft"
    >
      <template v-slot:block="{ item }">
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
        <default-select
          v-if="operations.length > 0"
          v-model="selectedOperation"
          :placeholder="$t('schedule.simulation.machineResult.operation')"
          :options="operationOptions"
          filterable
          class="title-select"
        />
        <default-select
          v-if="equipments.length > 0"
          v-model="selectedEquipment"
          :placeholder="$t('schedule.simulation.machineResult.equipment')"
          :options="equipmentsOptions"
          filterable
          class="title-select"
        />
        <span v-else>
          {{ $t('schedule.simulation.scheduleResult.equipmentId') }}
        </span>
      </template>
    </v-gantt-chart>
  </div>
</template>

<script>
import ScheduleItem from './ScheduleItem'
import ScheduleLabel from './ScheduleLabel'
import { getMachinePlanResult, getMachinePlanExcludeList } from '@/schedule/API/Plan'
import { getMachineSimulateResult, getMachineSimulateExcludeList } from '@/schedule/API/Simulation'
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'GanttChart',
  components: {
    ScheduleItem,
    ScheduleLabel
  },
  props: {
    currentSolutionId: {
      type: Number,
      default: null
    },
    scale: {
      type: Number,
      default: 60
    },
    searchString: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: true,
      isJobEmpty: false,
      hasError: false,
      position: {},
      searchedOrderId: null,
      ganttChartDataList: [],
      startTime: null,
      endTime: null,
      timeLines: [{
        time: null,
        color: '#1eb8c7'
      }],
      selectedEquipment: '',
      selectedOperation: '',
      operations: [],
      equipments: [],
      ganttInitialHeight: null
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    ...mapState('simulation', ['planId']),
    isSimulating () {
      return this.$route.name === 'SimulationResult'
    },
    equipmentsOptions () {
      const all = { value: null, label: this.$t('schedule.setting.allEquipment') }
      const equipmentOptinos = this.equipments.map(item => ({ value: item, label: item }))
      return [all, ...equipmentOptinos]
    },
    operationOptions () {
      const all = { value: null, label: this.$t('schedule.setting.allOperation') }
      const operationOptinos = this.operations.map(item => ({ value: item, label: item }))
      return [all, ...operationOptinos]
    },
    filters () {
      const equipmentFilter = item => item.equipment === this.selectedEquipment
      const operationFilter = item => item.operation === this.selectedOperation
      return [
        ...(Boolean(this.selectedEquipment) && [equipmentFilter]),
        ...(Boolean(this.selectedOperation) && [operationFilter]),
      ]
    },
    filteredGanttChartDataList () {
      // 甘特圖上 filters 功能
      return this.filters.reduce((d, f) => d.filter(f) , this.ganttChartDataList)
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

      const getOperationInfo = this.isSimulating
        ? getMachineSimulateResult(this.planId, this.currentSolutionId, 0, 0, true)
        : getMachinePlanResult({
            projectId: this.scheduleProjectId,
            page: 0,
            size: 20,
            fetchAll: true,
            keyword: this.searchString
          })
      const getExcludeInfo = this.isSimulating
        ? getMachineSimulateExcludeList(this.planId, this.currentSolutionId)
        : getMachinePlanExcludeList(this.scheduleProjectId)

      Promise.all([getOperationInfo, getExcludeInfo])
        .then(([operateData, restData]) => {
          if (operateData.length === 0) {
            this.isLoading = false
            this.isJobEmpty = true
            return
          }
          const tempChartList = {}
          let startTime
          let endTime

          // 集成此次模擬的工序選單
          this.operations = operateData.reduce((acc, cur) => {
            if (!acc.includes(cur.operation)) acc.push(cur.operation)
            return acc
          }, [])

          // 正常工作時段資料
          operateData.forEach(item => {
            // 使用「工序 + 機台」作為甘特圖每條 row 的 key
            const rowKey = `${item.operation}_${item.equipment}`

            if (!tempChartList[rowKey]) {
              tempChartList[rowKey] = {}
              tempChartList[rowKey].gtArray = [{
                ...item,
                start: this.getStartTime(item),
                end: this.getEndTime(item)
              }]
              tempChartList[rowKey].equipment = item.equipment
              tempChartList[rowKey].operation = item.operation
            } else {
              tempChartList[rowKey].gtArray.push({
                ...item,
                start: this.getStartTime(item),
                end: this.getEndTime(item)
              })
            }
          })

          // 排除時段資料
          const rowValues = Object.values(tempChartList)
          restData = restData.reduce((acc, cur) => {
            // 整理排除時段的資料
            const restSchedule = cur.reasons.map(reason => ({
              ...reason,
              equipment: cur.equipment
            }))
            acc.push(...restSchedule)
            return acc
          }, [])
          restData.forEach(item => {
            // 如果此排除機台有參與任何工序，則將此排除事件安插進該資料列當中
            // 所以如果此排除機台有參與五個工序，這個排除事件就會在甘特圖上出現五次
            const attendingRows = rowValues.filter(value => value.equipment === item.equipment)
            if (attendingRows.length > 0) {
              attendingRows.forEach(row => {
                row.gtArray.push({
                  ...item,
                  start: this.getStartTime(item),
                  end: this.getEndTime(item)
                })
              })
            } else {
              // 如果此排除機台在此次模擬當中，沒有參與任何工序，就另外呈現在最下方
              // 使用「機台」作為甘特圖每條 row 的 key
              const rowKey = item.equipment
              if (!tempChartList[rowKey]) {
                tempChartList[rowKey] = {}
                tempChartList[rowKey].gtArray = [{
                  ...item,
                  start: this.getStartTime(item),
                  end: this.getEndTime(item)
                }]
                tempChartList[rowKey].equipment = item.equipment
                tempChartList[rowKey].reason = item.reason
              } else {
                tempChartList[rowKey].gtArray.push({
                  ...item,
                  start: this.getStartTime(item),
                  end: this.getEndTime(item)
                })
              }
            }
          })

          // 設定甘特圖最早和最晚的時間
          const schedule = [...operateData, ...restData]
          schedule.forEach(item => {

            // 集成此次模擬的機台選單
            if (!this.equipments.includes(item.equipment)) this.equipments.push(item.equipment)

            const currentStartTime = moment(this.getStartTime(item))
            const currentEndTime = moment(this.getEndTime(item))
            
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

          // 最後將集成好的資料放進甘特圖中
          for (const rowKey in tempChartList) {
            this.ganttChartDataList.push(tempChartList[rowKey])
          }

          this.isLoading = false

          this.$nextTick(() => {
            // 抓取整個組件初始高度，主要是避免之後操作 filter 時由於甘特圖高度變小而畫面位移
            const ganttDom = document.getElementById('my-gantt')
            if (ganttDom) this.ganttInitialHeight = ganttDom.offsetHeight
          })
        })
          .catch(() => this.hasError = true)
    },
    scrollToLeft (value) {
      this.position = { x: value }
    },
    searchOrder (orderId) {
      this.searchedOrderId = orderId
    },
    cancelSearchOrder () {
      this.searchedOrderId = null
    },
    getStartTime (item) { return item.startTime || item.startDatetime },
    getEndTime (item) { return item.endTime || item.endDatetime }
  }
}
</script>

<style lang="scss" scoped>

.gantt-wrapper {
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
/deep/ .schedule-gantt-chart  {
  $label-width: 300px;
  .gantt-leftbar-wrapper, .gantt-header-title {
    width: $label-width !important;
  }
  .gantt-leftbar {
    min-height: 100px;
  }
  .gantt-scroll-x {
    margin-left: $label-width !important;
    width: calc(100% - #{$label-width}) !important;
  }
  .gantt-header-title {
    display: flex;
  }
  .gantt-container {
    width: 100% !important;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    .gantt-timeline {
      margin-left: -30px !important;
    }
    .gantt-blocks {
      height: 100% !important;
      .gantt-block:only-child {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100px;
        width: calc(100vw - 430px); // 讓 no data 維持在可視區域
        &::before {
          content: 'No Data';
        }
      }
    }
  }
  .gantt-scroll-y {
    display: none;
  }
}
/deep/ .title-select {
  .el-input__inner {
    text-align: center;
    border-bottom: none;
    line-height: 30px;
    height: 30px;
  }
}
</style>