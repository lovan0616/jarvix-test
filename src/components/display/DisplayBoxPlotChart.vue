<template>
  <div class="display-box-plot-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
      @brushselected="brushRegionSelected"
    >
    </v-echart>
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
          <div class="filter-description"
            v-if="singleType.type === 'enum'"
          >
            <div class="column-name">{{singleType.properties.display_name}} =</div>
            <div class="single-filter"
              v-for="(singleData, propertiesIndex) in singleType.properties.datavalues"
              :key="'enum-' + propertiesIndex"
            >{{ singleData }}<span v-show="propertiesIndex !== singleType.properties.datavalues.length - 1">、</span></div>
          </div>
          <div class="region-description"
            v-if="singleType.type === 'range'"
          >
            <div class="single-area">
              {{ $t('resultDescription.area') + (index + 1) }}:
              {{ singleType.properties.display_name }}{{ $t('resultDescription.between', {start: singleType.properties.start, end: singleType.properties.end }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
  </div>
</template>
<script>
import dataTool from 'echarts/dist/extension/dataTool'
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'

let boxPlotChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: false
    }
  },
  chartData: {
    name: 'boxplot',
    type: 'boxplot',
    data: [],
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    tooltip: {
      formatter (param) {
        return [
          'upper: ' + param.data[5],
          'Q3: ' + param.data[4],
          'median: ' + param.data[3],
          'Q1: ' + param.data[2],
          'lower: ' + param.data[1]
        ].join('<br/>')
      }
    }
  },
  outlier: {
    name: 'outlier',
    type: 'scatter',
    data: []
  }
}

export default {
  name: 'DisplayBoxPlotChart',
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
  methods: {
    brushRegionSelected (params) {
      if (params.batch[0].selected[0].dataIndex.length === 0) {
        this.selectedData = []
        return
      }
      this.selectedData = [{
        type: 'enum',
        properties: {
          dc_name: this.title.xAxis.dc_name,
          data_type: this.title.xAxis.data_type,
          display_name: this.title.xAxis.display_name,
          datavalues: params.batch[0].selected[0].dataIndex.map(element => {
            return this.dataset.index[element]
          })
        }
      }]
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  },
  computed: {
    chartData () {
      return dataTool.prepareBoxplotData(this.dataset.data)
    },
    chartOption () {
      let chartAddon = JSON.parse(JSON.stringify(chartOptions))
      chartAddon.xAxis = {...chartAddon.xAxis, ...boxPlotChartConfig.xAxis}
      chartAddon.tooltip.trigger = boxPlotChartConfig.tooltip.trigger
      chartAddon.xAxis.data = this.dataset.index
      chartAddon.xAxis.name = this.title.xAxis.display_name
      chartAddon.yAxis.name = this.title.yAxis.display_name
      boxPlotChartConfig.chartData.data = this.chartData.boxData
      boxPlotChartConfig.outlier.data = this.chartData.outliers
      chartAddon.series[0] = boxPlotChartConfig.chartData
      chartAddon.series[0].itemStyle.borderColor = '#4DE2F0'
      chartAddon.series[0].itemStyle.color = '#000'
      chartAddon.series[1] = boxPlotChartConfig.outlier
      chartAddon.series[1].itemStyle = {
        color: chartVariable['chartColorList-2']
      }
      chartAddon.toolbox.feature.dataView.show = false

      if (this.isPreview) this.previewChartSetting(chartAddon)

      return {
        ...chartAddon,
        brush: {
          toolbox: [''],
          xAxisIndex: 0,
          yAxisindex: 0
        }
      }
    },
    chartStyle () {
      return {
        width: '100%',
        height: '380px'
      }
    }
  }
}
</script>
