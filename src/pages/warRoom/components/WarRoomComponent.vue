<template>
  <div
    :class="{ 'card--focused': isFocusing }"
    class="card"
  >
    <div class="card__header">
      <div class="card__title">{{ componentBasicInfo.config.displayName }}</div>
      <div
        v-if="isEditable"
        class="card__control"
      >
        <a
          href="javascript:void(0);" 
          class="link action-link"
          @click="editSetting"
        >
          <svg-icon
            icon-class="filter-setting" 
            class="icon"/>
        </a>
        <a
          href="javascript:void(0);" 
          class="link action-link"
          @click="viewConstraint"
        >
          <svg-icon
            icon-class="filter" 
            class="icon"/>
        </a>
      </div>
    </div>
    <div class="card__body">
      <spinner
        v-if="isLoading"
        class="task-spinner"
      />
      <no-result
        v-else-if="isError"
        :message="errorMessage"
      />
      <template v-else-if="diagram">
        <component
          :is="componentName"
          :dataset="componentData.dataset"
          :title="componentData.title"
          :message="componentData.message"
          :segmentation="componentData.segmentation"
          :info="componentData.info || componentData.data"
          :features="componentData.features"
          :confidence="componentData.confidence"
          :formula="componentData.displayCoefficients"
          :coefficients="componentData.coeffs"
          :text="componentData.text"
          :chart-data="componentData.chart_data"
          :notes="componentData.notes"
          :causes="componentData.causes"
          :description="componentData.description"
          :total="componentData.total"
          :item-count="componentData.item_count"
          :key="componentId"
          :show-toolbox="showToolbox"
          :custom-chart-style="customChartStyle"
          class="card__body-data"
        />
      </template>
    </div>
  </div>
</template>

<script>
import {
  getComponentInfo,
  getPublishedComponentInfo
} from '@/API/WarRoom'
import DisplayIndexInfo from './DisplayIndexInfo'

const dummyIndexComponentData = {
  "componentId": 0,
  "config": {
    "boundSwitch": true,
    "customEndTime": "2020-01-23",
    "customStartTime": "2020-01-23",
    "displayDateRangeSwitch": true,
    "displayName": "北部地區銷售量",
    "isAutoRefresh": true,
    "lowerBound": "string",
    "question": "string",
    "recentTimeIntervalAmount": 0,
    "recentTimeIntervalUnit": "Second",
    "refreshFrequency": "string",
    "upperBound": "string"
  },
  diagramData: {
    "id":286931,
    "resultId":55025,
    "diagram":"index_info",
    "data":{
      "title":{
        "xAxis":[
          {
            "dc_id":null,
            "dc_name":"c0",
            "operator":null,
            "data_type":"int",
            "drillable":true,
            "is_feature":null,
            "stats_type":"numeric",
            "upperLimit":null,
            "display_name":"Number"
          }
        ],
        "yAxis":[
          {
            "dc_id":null,
            "dc_name":null,
            "operator":null,
            "data_type":null,
            "drillable":false,
            "is_feature":null,
            "stats_type":null,
            "upperLimit":null,
            "display_name":"總數量"
          }
        ]
      },
      "dataset":{
        "data": 81223
      },
      "question":null
    },
    "status":"Complete",
    "handlerFunction":null,
    "page":0,
    "singlePage":true,
    "isAutoRefresh":null
  },
  "diagramName": "string",
  "orderSequence": 0,
  "restriction": {},
  "selectedColumns": {}
}

const dummyDiagramComponentData = {
  "componentId": 2,
  "config": {
    "boundSwitch": true,
    "customEndTime": "2020-01-23",
    "customStartTime": "2020-01-23",
    "displayDateRangeSwitch": true,
    "displayName": "北部地區銷售量",
    "isAutoRefresh": true,
    "lowerBound": "string",
    "question": "string",
    "recentTimeIntervalAmount": 0,
    "recentTimeIntervalUnit": "Second",
    "refreshFrequency": "string",
    "upperBound": "string"
  },
  diagramData: {
    "id":286931,
    "resultId":55025,
    "diagram":"computed_histogram",
    "data":{
      "title":{
        "xAxis":[
          {
            "dc_id":null,
            "dc_name":"c0",
            "operator":null,
            "data_type":"int",
            "drillable":true,
            "is_feature":null,
            "stats_type":"numeric",
            "upperLimit":null,
            "display_name":"Number"
          }
        ],
        "yAxis":[
          {
            "dc_id":null,
            "dc_name":null,
            "operator":null,
            "data_type":null,
            "drillable":false,
            "is_feature":null,
            "stats_type":null,
            "upperLimit":null,
            "display_name":"總數量"
          }
        ]
      },
      "dataset":{
        "data":[
          null,
          2.0,
          2.0,
          4.0,
          2.0,
          1.0,
          2.0,
          1.0,
          1.0,
          2.0,
          2.0,
          4.0,
          null,
          8.0
        ],
        "range":[
          7952.59,
          1123213.32
        ]
      },
      "question":null
    },
    "status":"Complete",
    "handlerFunction":null,
    "page":0,
    "singlePage":true,
    "isAutoRefresh":null
  },
  "diagramName": "string",
  "orderSequence": 0,
  "restriction": {},
  "selectedColumns": {}
}

export default {
  name: 'WarRoomComponent',
  components: {
    DisplayIndexInfo
  },
  props: {
    componentId: {
      type: Number,
      default: null
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    isFocusing: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      question: '',
      isTaskComplete: true,
      showToolbox: false,
      customChartStyle: {
        width: '100%', 
        height: '100%',
      },
      diagram: null,
      isLoading: true,
      componentName: null,
      componentData: null,
      isError: false,
      errorMessage: '',
      timeoutFunction: null,
      autoRefreshFunction: null,
      componentBasicInfo: {}
    }
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
    if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    autoRefreshData () {
      this.isLoading = true
      this.fetchData().then(taskData => {
        this.componentData = taskData
        this.isLoading = false
      })
    },
    fetchData () {
      const { war_room_id: warRoomId } = this.$route.params
      window.clearTimeout(this.timeoutFunction)
      this.isLoading = true
      getComponentInfo(warRoomId, this.componentId)
        .then(response => {
          const { diagramData, ...componentBasicInfo } = dummyDiagramComponentData
          switch (dummyDiagramComponentData.diagramData.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => { this.fetchData() }, 1000)
              break
            case 'Complete': {
              window.clearTimeout(this.timeoutFunction)
              this.diagram = dummyDiagramComponentData.diagramData.diagram
              this.componentName = this.getChartTemplate(this.diagram)
              let responseData = dummyDiagramComponentData.diagramData.data

              let isAutoRefresh = componentBasicInfo.config.isAutoRefresh
              if(isAutoRefresh && !this.isEditable) {
                this.autoRefreshFunction = window.setTimeout(() => {
                  this.fetchData()
                }, this.convertRefreshFrequency(componentBasicInfo.config) * 1000)
              }
              
              // 判斷是否為 圖表
              if (responseData.dataset.data.length === 0) {
                this.isLoading = false
                this.isError = true
                this.errorMessage = this.$t('message.emptyResult')
              } else {
                this.componentData = responseData
              }

              this.componentBasicInfo = componentBasicInfo
              this.isLoading = false
              break
            }
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              window.clearTimeout(this.timeoutFunction)
              this.isLoading = false
              this.isError = true
              this.errorMessage = this.$t('message.systemIsError')
              break
          }
        }).catch(() => {
          this.isLoading = false
          this.isError = true
          this.errorMessage = this.$t('message.systemIsError')
        })
    },
    viewConstraint() {
      this.$emit('check-constraint', this.componentBasicInfo)
    },
    editSetting() {
      this.$emit('check-setting', this.componentBasicInfo)
    },
    convertRefreshFrequency (cronTab) {
      switch (cronTab) {
        case '*/5 * * * *':
          return 5 * 60 * 1000
        case '*/15 * * * *':
          return 15 * 60 * 1000
        case '*/30 * * * *':
          return 30 * 60 * 1000
        case '*/45 * * * *':
          return 45 * 60 * 1000
        case '0 * * * *':
          return 60 * 60 * 1000
        case '0 0 * * *':
          return 24 * 60 * 60 * 1000
        case '0 0 * * 0':
          return 7 * 24 * 60 * 1000
        case '0 0 1 * *':
          return 30 * 7 * 24 * 60 * 1000
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  height: 100%;
  width: 0; // 讓卡片能響應式縮小
  height: auto;
  border-radius: 5px;
  background: #1C2424;
  padding: 16px;
  background: #192323;
  display: flex;
  flex-direction: column;
  cursor: grab;
  border: 1px solid transparent;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    height: 20px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #DDDDDD;
  }

  &__control {
    display: none;
    line-height: 20px;
    .icon { color: #2AD2E2; }
  }

  &__body {
    flex: 1;
  }

  &__body-data {
    height: 100%;
  }

  &--focused {
    border: 1px solid #2AD2E2;
  }

  &.sortable-chosen,
  &.sortable-drag {
    cursor: grabbing;
  }

  &.sortable-ghost {
    opacity: .4;
  }

  &.disabled {
    cursor: no-drop;
  }

  &:hover {
    background: #202D2D;
    .card__control {
      display: block;
    }
  }

  .spinner-block {
    height: 100%;
    padding: 0;
  }
}
</style>