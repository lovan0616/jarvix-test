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
  </div>
</template>
<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
// import { chartOptions } from '@/components/display/common/chart-addon.js'
import { 
  getDrillDownTool, 
  xAxisDefault,
  yAxisDefault,
  color5
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
  outliersBuckets: null
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
      correlationLinePoint: 100
    }
  },
  computed: {
    grid () {
      return [
        {
          height: '65%'
        },
        {
          top: '80%',
          height: '41px'
        }
      ]
    },
    scatterChartDataset () {
      const intervalAmount = 20
      const xAxisMin = title.xAxis[0].min
      const xAxisMax = title.xAxis[0].max
      const xAxisTick = [...Array(intervalAmount).keys()].map((index) => xAxisMin + (index + 1) * (((xAxisMax - xAxisMin) / intervalAmount) / 2))
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
    lineChartDataset () {
      const lineChartPointAmount = 20
      const xAxisMin = title.xAxis[0].min
      const xAxisMax = title.xAxis[0].max
      const xAxisTick = [...Array(lineChartPointAmount).keys()].map((index) => xAxisMin + index * ((xAxisMax - xAxisMin) / lineChartPointAmount))
      return {
        source: [
          ['group', ...xAxisTick],
          ...dataset.columns.map((column, index) => ([
            column,
            ...xAxisTick.map((tick, tickIndex) => this.calculateProbability (coeffs[index].mean, coeffs[index].sigma, tickIndex))
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
        max: 15,
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
          name: 'outlier',
          type: 'scatter',
          datasetIndex: dataset.buckets.length + 1,
          xAxisIndex: 1, 
          yAxisIndex: 1
        }])
      ]
    },
    chartOption () {
      let config = {
        grid: this.grid,
        xAxis: [
          {
            ...xAxisDefault(),
            name: title.xAxis[0].display_name,
            gridIndex: 0,
            boundaryGap: false,
            axisLabel: {
              show: false
            },
            min: title.xAxis[0].min,
            max: title.xAxis[0].max
          },
          {
            ...xAxisDefault(),
            ...scatterChartConfig.xAxis,
            min: title.xAxis[0].min,
            max: title.xAxis[0].max,
            splitNumber: dataset.buckets.length,
            interval: (title.xAxis[0].max - title.xAxis[0].min) / dataset.buckets.length,
          }
        ],
        yAxis: [
          {
            ...yAxisDefault(),
            name: title.yAxis[0].display_name,
            gridIndex: 0
          },
          scatterChartConfig.yAxis
        ],
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.$route.name, this.title),
        tooltip: {
          ...commonChartOptions().tooltip,
          trigger: 'item',
          formatter (params) {
            console.log(params)
            return `${params.seriesName}<br />${params.value}`
          },
        },
        dataset: [
          this.lineChartDataset,
          ...this.scatterChartDataset
        ],
        visualMap: this.visualMap,
        series: this.series,
        color: color5
      }

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
      console.log(params)
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
                start: this.title.xAxis[0].stats_type === 'numeric' ? coordRange[0][0] : this.dataset.index[coordRange[0][0]],
                end: this.title.xAxis[0].stats_type === 'numeric' ? coordRange[0][1] : this.dataset.index[coordRange[0][1]]
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
