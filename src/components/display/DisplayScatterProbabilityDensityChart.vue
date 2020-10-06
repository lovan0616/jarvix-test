<template>
  <div class="display-scatter-chart">
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
  </div>
</template>
<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
// import { chartOptions } from '@/components/display/common/chart-addon.js'
import { 
  getDrillDownTool, 
  xAxisDefault,
  yAxisDefault,
  colorOnly1,
  colorOnly2,
  color5,
  color12,
  convertHexToRGBA
} from '@/components/display/common/addons.js'

const dataset = {
  "buckets": [
    [
      0,
      0,
      0,
      69228,
      139624,
      92214,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15235,
      47311,
      50981,
      21432,
      19413,
      7854,
      2635,
      1336,
      171,
      0,
      0,
      0
    ],
    [
      62346,
      68676,
      114855,
      37137,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    [
      0,
      0,
      0,
      0,
      0,
      0,
      114328,
      76773,
      58516,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  ],
  columns: [
    "分群1",
    "分群2",
    "分群3",
    "分群4"
  ],
  outliersBuckets: [0.0, 3, 0.0, 0.0, 4545, 0.0, 5, 0.0, 0.0, 0.0, 44444, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
}

const title = {
  "xAxis": [
    {
      "max": 87,
      "min": 17,
      "dc_id": 76503,
      "dc_name": "c2",
      "operator": null,
      "data_type": "float",
      "drillable": true,
      "is_feature": null,
      "lowerLimit": null,
      "stats_type": "numeric",
      "upperLimit": null,
      "display_name": "Customer Age"
    }
  ],
  "yAxis": [
    {
      "max": null,
      "min": null,
      "dc_id": null,
      "dc_name": null,
      "operator": null,
      "data_type": "float",
      "drillable": false,
      "is_feature": null,
      "lowerLimit": null,
      "stats_type": "numeric",
      "upperLimit": null,
      "display_name": "机率密度"
    }
  ]
}

const coeffs = [
  {
    "mean": 32.593814296451704,
    "sigma": 3.5178274853382203
  },
  {
    "mean": 52.409166442280224,
    "sigma": 7.310968102541258
  },
  {
    "mean": 23.874248868056263,
    "sigma": 3.8420538879024315
  },
  {
    "mean": 41.89275214357233,
    "sigma": 4.149040604210672
  }
]

const clusterInfos = [
  {
    "q1":4.01,
    "q3":25.0,
    "max":46.43,
    "min":-21.01,
    "std":13.578603473347332,
    "mean":15.220344027141243,
    "count":16801,
    "media":null
  },
  {
    "q1":379.0,
    "q3":630.5,
    "max":855.5,
    "min":302.0,
    "std":154.4791649415892,
    "mean":512.7103524037416,
    "count":4597,
    "media":null
  },
  {
    "q1":71.0,
    "q3":187.0,
    "max":301.71,
    "min":-142.0,
    "std":80.41516664973683,
    "mean":129.6391881527415,
    "count":12256,
    "media":null
  },
  {
    "q1":942.5,
    "q3":1251.9025,
    "max":2291.99,
    "min":-620.0,
    "std":357.57576241185376,
    "mean":1087.4730741797432,
    "count":1402,
    "media":null
  }
]

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
      default: null
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
    clusterInfos: {
      type: Array,
      default: null
    },
    coefficients: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      selectedData: [],
      lineChartPointAmount: 130,
      scatterChartIntervalAmount: 20
    }
  },
  computed: {
    grid () {
      return [
        {
          height: '69%'
        },
        {
          top: '84.5%',
          height: '42'
        }
      ]
    },
    scatterChartDataset () {
      const xAxisMin = title.xAxis[0].min
      const xAxisMax = title.xAxis[0].max
      const xAxisTick = [...Array(this.scatterChartIntervalAmount).keys()].map((index) => xAxisMin + (((xAxisMax - xAxisMin) / this.scatterChartIntervalAmount) / 2) + (index + 1) * ((xAxisMax - xAxisMin) / this.scatterChartIntervalAmount))
      // min: 0, max: 100, 50 為中心
      const yAxisPosition = 50
      // 包含各分群及離群值資料
      return [
        ...dataset.buckets,
        ...(dataset.outliersBuckets !== null && [dataset.outliersBuckets])
      ].map((group, index) => ({
        source: group.map((density, densityIndex) => ([xAxisTick[densityIndex], yAxisPosition, density]))
      }))
    },
    lineChartAxisTick () {
      const xAxisMin = title.xAxis[0].min
      const xAxisMax = title.xAxis[0].max
      return [...Array(this.lineChartPointAmount).keys()].map((index) => {
        // 確保 x 軸最後一個值對齊資料最大值
        return this.lineChartPointAmount - 1 === index ? xAxisMax : xAxisMin + index * ((xAxisMax - xAxisMin) / this.lineChartPointAmount)
      })
    },
    lineChartDataset () {
      return {
        source: [
          ['group', ...this.lineChartAxisTick],
          ...dataset.columns.map((column, index) => ([
            column,
            ...this.lineChartAxisTick.map(tick => this.calculateProbability (coeffs[index].mean, coeffs[index].sigma, tick))
          ]))
        ]
      }
    },
    visualMap () {
      // 確認是否有離群
      const scatterSeriesAmount = dataset.outliersBuckets ? dataset.buckets.length + 1 : dataset.buckets.length
      return {
        show: false,
        // Scatter 取第三行作為畫點的資料依據
        dimension: 2,
        // Scatter 最小點的值
        min: 0,
        // Scatter 最大點的值
        max: Math.max(...dataset.buckets.flat()),
        inRange: {
          // Scatter 點最小和最大的尺寸(pixel)
          symbolSize: [0, 40]
        },
        // 取第幾筆 series 來畫點: scatter 排在 line chart 之後
        seriesIndex: [...Array(scatterSeriesAmount).keys()].map(i => dataset.columns.length + i)
      }
    },
    series () {
      return [
        ...dataset.columns.map((column, index) => {
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
        ...dataset.buckets.map((bucket, index) => {
          return {
            name: dataset.columns[index],
            type: 'scatter',
            datasetIndex: index + 1,
            xAxisIndex: 1, 
            yAxisIndex: 1
          }
        }),
        ...(dataset.outliersBuckets !== null && [{
          name: this.$t('clustering.outlier'),
          type: 'scatter',
          datasetIndex: dataset.buckets.length + 1,
          xAxisIndex: 1, 
          yAxisIndex: 1
        }])
      ]
    },
    colorSet () {
      const opacity = 0.7
      const hasOutlier = dataset.outliersBuckets !== null
      const colorAmountNeeded = hasOutlier ? dataset.columns.length + 1 : dataset.columns.length
      let colorList
      switch (colorAmountNeeded) {
        case 2:
          colorList = colorOnly1
          break
        case 3:
          colorList = colorOnly2
          break
        case 4:
        case 5:
        case 6:
          colorList = color5
          break
        default:
          colorList = color12
          break
      }
      return colorList.map(color => convertHexToRGBA(color, opacity))
    },
    chartOption () {
      const config = {
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.$route.name, this.title),
        tooltip: {
          ...commonChartOptions().tooltip,
          trigger: 'item',
          formatter (params) {
            const marker = params.marker ? params.marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>`
            return marker + params.seriesName + '<br/>' + '資料密集程度：' + params.data[2]
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
          {
            ...xAxisDefault(),
            name: title.xAxis[0].display_name,
            type: 'category',
            gridIndex: 0,
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          {
            ...xAxisDefault(),
            ...scatterChartConfig.xAxis,
            type: 'value',
            boundaryGap: false,
            min: title.xAxis[0].min,
            max: title.xAxis[0].max,
            scale: true,
            splitNumber: dataset.buckets[0].length,
            interval: (title.xAxis[0].max - title.xAxis[0].min) / dataset.buckets[0].length,
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
          {
            ...yAxisDefault(),
            name: title.yAxis[0].display_name,
            gridIndex: 0,
          },
          scatterChartConfig.yAxis
        ],
        series: this.series,
        color: this.colorSet,
        legend: {
          ...commonChartOptions().legend,
          data: [
            ...dataset.columns,
            ...(dataset.outliersBuckets !== null && [this.$t('clustering.outlier')])
          ]
        }
      }
      
      // 目前不提供觀看原始資料的功能
      config.toolbox.feature.dataView.show = false

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
        let coordRange = areaElement.coordRange
        return {
          type: 'range',
          properties: {
            dc_name: title.xAxis[0].dc_name,
            data_type: title.xAxis[0].data_type,
            display_name: title.xAxis[0].display_name,
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
