<template>
  <div class="display-scatter-probability-density-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
      @brushselected="brushRegionSelected"
    />
    <selected-region
      v-if="selectedData.length > 0"
      :title="$t('resultDescription.currentChosenData')"
      @save="saveFilter"
    >
      <div slot="selectedFilterRegion">
        <div
          v-for="(singleType, index) in selectedData"
          :key="index"
        >
          <div class="region-description">
            <div class="single-area">
              {{ $t('resultDescription.area') + (index + 1) }}:
              {{ singleType.properties.display_name }} {{ $t('resultDescription.between', {start: singleType.properties.start, end: singleType.properties.end }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
    <div 
      v-if="dataset.descriptions.length > 0"
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
import { commonChartOptions } from '@/components/display/common/chart-addon'
import i18n from '@/lang/index.js'
import { 
  getDrillDownTool, 
  xAxisDefault,
  yAxisDefault,
  color5,
  color12,
  convertHexToRGBA
} from '@/components/display/common/addons.js'

let scatterChartConfig = {
  xAxis: {
    type: 'value',
    scale: true,
    gridIndex: 1,
    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    axisTick: {
      length: 0
    }
  },
  yAxis: {
    type: 'value',
    show: false,
    scale: true,
    splitNumber: 1,
    gridIndex: 1,
    min: 0,
    max: 100,
  },
  chartData: {
    type: 'scatter',
    datasetIndex: 1,
    xAxisIndex: 1, 
    yAxisIndex: 1
  }
}

export default {
  name: 'DisplayScatterProbabilityDensityChart',
  props: {
    dataset: {
      type: Object,
      default: () => ({
        buckets: [],
        columns: [],
        descriptions: [],
        outliersBuckets: []
      })
    },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: [],
          yAxis: []
        }
      }
    },
    clusterInfos: {
      type: Array,
      default: () => ([])
    },
    coeffs: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      selectedData: [],
      lineChartPointAmount: 130,
      scatterChartIntervalAmount: this.dataset.buckets[0].length
    }
  },
  computed: {
    grid () {
      return [
        {
          height: '65%'
        },
        {
          top: '80.5%',
          height: '42'
        }
      ]
    },
    scatterChartDataset () {
      const xAxisMin = this.title.xAxis[0].min
      const xAxisMax = this.title.xAxis[0].max
      const xAxisTick = [...Array(this.scatterChartIntervalAmount).keys()].map(index => xAxisMin + (((xAxisMax - xAxisMin) / this.scatterChartIntervalAmount) / 2) + index * ((xAxisMax - xAxisMin) / this.scatterChartIntervalAmount))
      // y軸高度為 100, 50 為中心點
      const yAxisPosition = 50
      // 包含各分群及離群值資料
      return [
        ...this.dataset.buckets,
        ...(this.dataset.outliersBuckets.length > 0 && [this.dataset.outliersBuckets])
      ].map((cluster, index) => ({
        source: cluster.map((density, densityIndex) => ([xAxisTick[densityIndex], yAxisPosition, density]))
      }))
    },
    lineChartAxisTick () {
      const xAxisMin = this.title.xAxis[0].min
      const xAxisMax = this.title.xAxis[0].max
      return [...Array(this.lineChartPointAmount).keys()].map(index => {
        // 確保 x 軸最後一個值對齊資料最大值 
        return this.lineChartPointAmount - 1 === index ? xAxisMax : xAxisMin + index * ((xAxisMax - xAxisMin) / this.lineChartPointAmount)
      })
    },
    lineChartDataset () {
      return {
        source: [
          ['cluster', ...this.lineChartAxisTick],
          ...this.dataset.columns.map((column, index) => ([
            column,
            ...this.lineChartAxisTick.map(tick => this.calculateProbability(this.coeffs[index].mean, this.coeffs[index].sigma, tick))
          ]))
        ]
      }
    },
    visualMap () {
      // 確認是否有離群
      const scatterSeriesAmount = this.dataset.outliersBuckets.length > 0 ? this.dataset.buckets.length + 1 : this.dataset.buckets.length
      const maxValue = Math.max(...this.dataset.buckets.flat())
      return {
        show: false,
        // Scatter 取第三行作為畫點的資料依據
        dimension: 2,
        // Scatter 最小點的值
        min: 0,
        // Scatter 最大點的值
        max: maxValue,
        // 無資料的點需額外處理，所以設定在範圍外
        range: [1, maxValue],
        inRange: {
          // Scatter 點最小和最大的尺寸(pixel)
          // 只要有資料就有 5px：大小足以讓使用者看得到
          symbolSize: [5, 40]
        },
        outOfRange: {
          // 零比資料算範圍外，預設不顯示
          symbol: 'none'
        },
        // 取第幾筆 series 來畫點: scatter 排在 line chart 之後
        seriesIndex: [...Array(scatterSeriesAmount).keys()].map(i => this.dataset.columns.length + i)
      }
    },
    series () {
      return [
        ...this.dataset.columns.map((column, index) => {
          return { 
            type: 'line',
            name: column,
            smooth: true,
            datasetIndex: 0,
            seriesLayoutBy: 'row',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbol: 'none'
          }
        }),
        ...this.dataset.buckets.map((bucket, index) => {
          return {
            name: this.dataset.columns[index],
            type: 'scatter',
            datasetIndex: index + 1,
            xAxisIndex: 1, 
            yAxisIndex: 1
          }
        }),
        // 如果有離群值，呈現在 Scatter chart 上
        ...(this.dataset.outliersBuckets.length > 0 && [{
          name: this.$t('clustering.outlier'),
          type: 'scatter',
          datasetIndex: this.dataset.buckets.length + 1,
          xAxisIndex: 1, 
          yAxisIndex: 1
        }])
      ]
    },
    colorSet () {
      // 設定透明度讓 scatter chart 中重疊的點能被凸顯出來
      const opacity = 0.7
      // 如果沒有 outlier 會拿到空陣列
      const hasOutlier = this.dataset.outliersBuckets.length > 0
      const colorAmountNeeded = hasOutlier ? this.dataset.columns.length + 1 : this.dataset.columns.length
      let colorList
      switch (colorAmountNeeded) {
        case 1:
        case 2:
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
      const formatComma = this.formatComma
      const config = {
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.$route.name, this.title),
        tooltip: {
          ...commonChartOptions().tooltip,
          trigger: 'item',
          formatter (params) {
            const marker = params.marker ? params.marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>`
            return marker + params.seriesName + '<br/>' + i18n.t('clustering.piecesOfData', { amount: formatComma(params.data[2]) })
          }
        },
        grid: this.grid,
        dataset: [
          this.lineChartDataset,
          ...this.scatterChartDataset
        ],
        // Use visualMap to perform visual encoding.
        visualMap: this.visualMap,
        xAxis: [
          // line chart xAxis
          {
            ...xAxisDefault(),
            name: this.title.xAxis[0].display_name,
            type: 'category',
            gridIndex: 0,
            boundaryGap: false,
            axisTick: {
              show: false
            },
            // 統一由 scatter chart 顯示數值
            axisLabel: {
              show: false
            }
          },
          // scatter chart xAxis
          {
            ...xAxisDefault(),
            ...scatterChartConfig.xAxis,
            type: 'value',
            boundaryGap: false,
            min: this.title.xAxis[0].min,
            max: this.title.xAxis[0].max,
            scale: true,
            splitNumber: this.scatterChartIntervalAmount,
            interval: (this.title.xAxis[0].max - this.title.xAxis[0].min) / this.scatterChartIntervalAmount,
            gridIndex: 1,
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#A7A7A7'
              }
            },
            axisTick: {
              length: 0
            }
          }
        ],
        yAxis: [
          // line chart yAxis
          {
            ...yAxisDefault(),
            name: this.title.yAxis[0].display_name,
            gridIndex: 0,
          },
          // scatter chart yAxis
          scatterChartConfig.yAxis
        ],
        series: this.series,
        color: this.colorSet,
        legend: {
          ...commonChartOptions().legend,
          data: [
            ...this.dataset.columns,
            ...(this.dataset.outliersBuckets.length > 0 && [this.$t('clustering.outlier')])
          ]
        }
      }
      
      // 目前不提供觀看原始資料的功能
      config.toolbox.feature.dataView.show = false
      // 補上千分為逗號
      config.xAxis[1].axisLabel.formatter = value => formatComma(value)

      return config
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  },
  methods: {
    calculateProbability (mean, sigma, xAxisIndex) {
      return (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-1 * (Math.pow((xAxisIndex - mean), 2) / (2 * Math.pow(sigma, 2))))
    },
    brushRegionSelected (params) {
      if (params.batch[0].areas.length === 0) {
        this.selectedData = []
        return
      }

      this.selectedData = params.batch[0].areas.map(areaElement => {
        const coordRange = areaElement.coordRange
        return {
          type: 'range',
          properties: {
            dc_name: this.title.xAxis[0].dc_name,
            data_type: this.title.xAxis[0].data_type,
            display_name: this.title.xAxis[0].display_name,
            start: this.lineChartAxisTick[coordRange[0]],
            end: this.lineChartAxisTick[coordRange[1]]
          }
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
.display-scatter-probability-density-chart {
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