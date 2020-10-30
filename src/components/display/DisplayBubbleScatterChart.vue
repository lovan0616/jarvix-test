<template>
  <div class="display-bubble-scatter-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
      @brushselected="brushRegionSelected"
    />
    <selected-region
      v-if="selectedData.length > 0"
      :title="$t('resultDescription.currentChosenArea')"
      @save="saveFilter"
    >
      <div 
        slot="selectedFilterRegion" 
        class="region-description">
        <div 
          v-for="(singleArea, index) in selectedData"
          :key="index"
          class="single-area"
        >
          {{ $t('resultDescription.area') + (index + 1) }}:
          <span
            v-for="(singleRestraint, restraintIndex) in singleArea.restraints"
            :key="'restraint' + index + '-' + restraintIndex"
          >
            {{ singleRestraint.properties.display_name }} {{ $t('resultDescription.between', {start: roundNumber(singleRestraint.properties.start), end: roundNumber(singleRestraint.properties.end) }) }}
            <span
              v-show="restraintIndex !== singleArea.restraints.length - 1"
            >、</span>
          </span>
        </div>
      </div>
    </selected-region>
    <div 
      v-if="dataset.descriptions && dataset.descriptions.length > 0"
      class="description"
    >
      <span 
        v-for="(description, index) in dataset.descriptions" 
        :key="index" 
        class="description__item">{{ description }}</span>
    </div>
  </div>
</template>
<script>
import { 
  colorOnly2,
  color5,
  color12,
  convertHexToRGBA,
  getDrillDownTool
} from './common/addons'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import chartVariable from '@/styles/chart/variables.scss'

let scatterBubleChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  xAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: chartVariable['splitLineColor']
      }
    }
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: chartVariable['splitLineColor']
      }
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: chartVariable['yAxisColor']
      }
    },
    scale: true
  },
  chartData: {
    name: null,
    type: 'scatter',
    large: true,
    symbolSize: null,
    label: {
      emphasis: {
        show: true,
        formatter (param) {
          return param.data[2]
        },
        position: 'top'
      }
    },
    itemStyle: {
      color: null
    },
    data: []
  }
}

export default {
  name: 'DisplayBubbleScatterChart',
  props: {
    dataset: {
      type: Object,
      default: () => {
        return {
          data: [],
          index: [],
          columns: []
        }
      }
    },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: null,
          yAxis: null
        }
      }
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedData: []
    }
  },
  computed: {
    colorList () {
      // 設定透明度讓 scatter chart 中重疊的點能被凸顯出來
      const opacity = 0.7
      // 如果沒有 outlier 會拿到空陣列
      const hasOutlier = this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0
      const colorAmountNeeded = hasOutlier ? this.dataset.columns.length + 1 : this.dataset.columns.length
      let colorList
      switch (colorAmountNeeded) {
        case 1:
        case 2:
          colorList = colorOnly2
          break
        case 3:
        case 4:
        case 5:
          colorList = color5
          break
        default:
          colorList = color12
          break
      }
      return colorList.map(color => convertHexToRGBA(color, opacity))
    },
    chartOption () {
      let chartAddon = {
        ...JSON.parse(JSON.stringify(chartOptions())),
        ...getDrillDownTool(this.$route.name, this.title)
      }
      chartAddon.series = []
      let maxValue = -Infinity
      let minValue = Infinity
      const minXaxis = this.title.xAxis[0].min
      const minYaxis = this.title.yAxis[0].min

      // 準備所有群的資料
      const groupList = [
        ...this.dataset.buckets,
        ...((this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0) && [this.dataset.outliersBuckets])
      ]
      
      // 準備所有欄位名稱
      const columns = [
        ...this.dataset.columns,
        ...((this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0) && [this.$t('clustering.outlier')]) 
      ]
      
      for (let i = 0; i < groupList.length; i++) {
        const groupData = groupList[i].reduce((acc, cur, index) => {
          // 排除值為 0 的點
          if (!cur[2]) return acc
          // 塞入資料名稱
          cur[3] = this.dataset.index ? this.dataset.index[index] : null
          // 塞入類別（組別）名稱
          cur[4] = columns[i] 
          // 資料最大值
          maxValue = Math.max(maxValue, cur[2])
          // 資料最小值
          minValue = Math.min(minValue, cur[2])
          acc.push(cur)
          return acc
        }, [])

        const config = JSON.parse(JSON.stringify(scatterBubleChartConfig))
        config.chartData.symbolSize = function (data) {
          if (!data[2]) return 0
          // 先 normalize 到小於 30
          const maxSymbolSize = 30
          const normalizeSymbolSize = (maxSymbolSize / maxValue) * data[2]
          // 最小值的點至少要是可視的
          const minSymbolSize = 6
          // 將值等比例縮放到指定範圍內
          return normalizeSymbolSize < minSymbolSize ? minSymbolSize : normalizeSymbolSize
        }

        // hover 過點的時候顯示資料量值
        config.chartData.label.emphasis.formatter = param => param.data[2]
        config.chartData.name = columns[i]
        config.chartData.itemStyle.color = this.colorList[i] || this.colorList[i % 10]
        config.chartData.data = groupData 
        // 定義每個維度的名稱，方便在 tooltip 取用
        config.chartData.dimensions = [this.title.xAxis[0].display_name, this.title.yAxis[0].display_name, 'value', 'dataName', 'serieName']
        chartAddon.series.push(config.chartData)
      }
      
      // x 軸設定
      chartAddon.xAxis = {
        ...chartAddon.xAxis, 
        ...scatterBubleChartConfig.xAxis,
        name: this.title.xAxis[0].display_name,
        min: minXaxis
      }

      // y 軸設定
      chartAddon.yAxis = {
        ...chartAddon.yAxis,
        ...scatterBubleChartConfig.yAxis,
        name: this.title.yAxis[0].display_name,
        min: minYaxis
      }

      chartAddon.tooltip.trigger = scatterBubleChartConfig.tooltip.trigger
      chartAddon.tooltip.formatter = params => {
        const marker = params.marker ? params.marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>`
        return `${marker} ${params.seriesName}<br>${params.dimensionNames[0]}：${params.data[0]}<br>${params.dimensionNames[1]}：${params.data[1]}`
      }

      // 設定 legend 顯示內容
      chartAddon.legend.data = [
        ...this.dataset.columns,
        ...((this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0) && [this.$t('clustering.outlier')])
      ]

      // 目前不提供觀看原始資料的功能
      chartAddon.toolbox.feature.dataView.show = false

      if (this.isPreview) this.previewChartSetting(chartAddon)
      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
    }
  },
  methods: {
    brushRegionSelected (params) {
      if (params.batch[0].areas.length === 0) {
        this.selectedData = []
        return
      }
      this.selectedData = params.batch[0].areas.map(areaElement => {
        let coordRange = areaElement.coordRange
        return {
          type: 'compound',
          restraints: [
            {
              type: 'range',
              properties: {
                dc_name: this.title.xAxis[0].dc_name,
                data_type: this.title.xAxis[0].data_type,
                display_name: this.title.xAxis[0].display_name,
                start: this.title.xAxis[0].stats_type.toLowerCase() === 'numeric' ? coordRange[0][0] : this.dataset.index[coordRange[0][0]],
                end: this.title.xAxis[0].stats_type.toLowerCase() === 'numeric' ? coordRange[0][1] : this.dataset.index[coordRange[0][1]]
              }
            },
            {
              type: 'range',
              properties: {
                dc_name: this.title.yAxis[0].dc_name,
                data_type: this.title.yAxis[0].data_type,
                display_name: this.title.yAxis[0].display_name,
                start: coordRange[1][0],
                end: coordRange[1][1]
              }
            }
          ]
        }
      })
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  },
}
</script>

<style lang="scss" scoped>
.display-bubble-scatter-chart {
  .description {
    margin-top: 40px;
    background: #141C1D;
    border-radius: 8px;
    padding: 10px 20px;

    &__item {
      font-size: 14px;
      letter-spacing: 0.1em;
    }
  }
}
</style>