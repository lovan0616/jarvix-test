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
      v-if="tempdataset.descriptions.length > 0"
      class="description"
    >
      <span 
        v-for="(description, index) in tempdataset.descriptions" 
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
  colorOnly1,
  colorOnly2,
  color5,
  color12,
  convertHexToRGBA
} from '@/components/display/common/addons.js'

const dataset = {
  buckets: [
    [
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
      166669,
      166083,
      82875,
      166474,
      166384
    ],
    [
      166863,
      166259,
      83320,
      166493,
      83033,
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
      0,
      0,
      0,
      83302,
      166261,
      82891,
      166693,
      166034,
      83181,
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
      82730,
      83329,
      166127,
      166561,
      83325,
      82772,
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
    '分群1',
    '分群2',
    '分群3',
    '分群4'
  ],
  descriptions: [
    'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
    '各群體佔比是相近的'
  ],
  outliersBuckets: [
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
    22220,
    0,
    43234320,
    0,
    0
  ]
}

const title = {
  xAxis: [
    {
      max: 34,
      min: 1,
      dc_id: 85523,
      dc_name: 'c14',
      operator: null,
      data_type: 'float',
      drillable: true,
      is_feature: null,
      lowerLimit: null,
      stats_type: 'numeric',
      upperLimit: null,
      display_name: '产业分类'
    }
  ],
  yAxis: [
    {
      max: null,
      min: null,
      dc_id: null,
      dc_name: null,
      operator: null,
      data_type: 'float',
      drillable: false,
      is_feature: null,
      lowerLimit: null,
      stats_type: 'numeric',
      upperLimit: null,
      display_name: '機率密度'
    }
  ]
}

const coeffs = [
  {
    mean: 29.89549808649133,
    sigma: 2.8500383413556407
  },
  {
    mean: 4.585607921365213,
    sigma: 2.529768736285726
  },
  {
    mean: 21.064455017673314,
    sigma: 3.3602524970243968
  },
  {
    mean: 12.446362832805706,
    sigma: 3.0366968420488014
  }
]

const clusterInfos = [
  {
    q1: 28,
    q3: 32,
    max: 34,
    min: 26,
    std: 2.582930385664334,
    mean: 30.000086842087683,
    count: 748485,
    media: null
  },
  {
    q1: 2,
    q3: 6,
    max: 8,
    min: 1,
    std: 2.2915316814337983,
    mean: 4.497241609206449,
    count: 665968,
    media: null
  },
  {
    q1: 19,
    q3: 23,
    max: 25,
    min: 17,
    std: 2.582260457415511,
    mean: 20.999533648154234,
    count: 748362,
    media: null
  },
  {
    q1: 11,
    q3: 14,
    max: 16,
    min: 9,
    std: 2.289851225778988,
    mean: 12.501113043059725,
    count: 664844,
    media: null
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
      default: () => ({
  buckets: [
    [
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
      166669,
      166083,
      82875,
      166474,
      166384
    ],
    [
      166863,
      166259,
      83320,
      166493,
      83033,
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
      0,
      0,
      0,
      83302,
      166261,
      82891,
      166693,
      166034,
      83181,
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
      82730,
      83329,
      166127,
      166561,
      83325,
      82772,
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
    '分群1',
    '分群2',
    '分群3',
    '分群4'
  ],
  descriptions: [
    'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
    '各群體佔比是相近的'
  ],
  outliersBuckets: [
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
    22220,
    0,
    43234320,
    0,
    0
  ]
})
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
      scatterChartIntervalAmount: 20,
      tempdataset: null
    }
  },
  computed: {
    grid () {
      return [
        {
          height: '67%'
        },
        {
          top: '82.5%',
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
        ...(dataset.outliersBuckets.length > 0 && [dataset.outliersBuckets])
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
      const scatterSeriesAmount = dataset.outliersBuckets.length > 0 ? dataset.buckets.length + 1 : dataset.buckets.length
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
        ...(dataset.outliersBuckets.length > 0 && [{
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
      const hasOutlier = dataset.outliersBuckets.length > 0
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
            return marker + params.seriesName + '<br/>' + i18n.t('clustering.piecesOfData', { amount: params.data[2] })
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
            ...(dataset.outliersBuckets.length > 0 && [this.$t('clustering.outlier')])
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
  created() {
    this.tempdataset = dataset
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