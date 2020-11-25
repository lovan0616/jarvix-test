<template>
  <div class="display-scatter-cluster-chart">
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
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import { 
  getDrillDownTool,
  color5,
  color12,
  convertHexToRGBA 
} from '@/components/display/common/addons.js'
import i18n from '@/lang/index.js'
let scatterChartConfig = {
  xAxisSplitLine: {
    show: false
  },
  yAxisSplitLine: {
    lineStyle: {
      type: 'solid',
      color: chartVariable['splitLineColor']
    }
  },
  chartData: {
    symbolSize: 8,
    data: [],
    type: 'scatter',
    large: true
  }
}

export default {
  name: 'DisplayScatterClusterChart',
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
      default: () => ([])
    },
  },
  data () {
    return {
      selectedData: [],
      correlationLinePoint: 100
    }
  },
  computed: {
    chartOption () {
      let chartAddon = {...JSON.parse(JSON.stringify(chartOptions())), ...getDrillDownTool(this.$route.name, this.title)}
      let scatterOptions = JSON.parse(JSON.stringify(scatterChartConfig))
      
      this.$set(chartAddon.xAxis, 'splitLine', scatterOptions.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', scatterOptions.yAxisSplitLine)

      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis.name = this.title.yAxis[0].display_name

      chartAddon.xAxis.axisLine.onZero = false
      chartAddon.yAxis.axisLine.onZero = false

      // x 軸顯示區間
      chartAddon.xAxis.max = this.roundNumber(this.title.xAxis[0].max, 4)
      chartAddon.xAxis.min = this.roundNumber(this.title.xAxis[0].min, 4)

      // y 軸顯示區間
      chartAddon.yAxis.max = this.roundNumber(this.title.yAxis[0].max, 4)
      chartAddon.yAxis.min = this.roundNumber(this.title.yAxis[0].min, 4)

      // tooltip 顯示設定
      chartAddon.tooltip = {
        ...chartAddon.tooltip,
        confine: true,
        trigger: 'item',
        formatter: params => {
          const marker = params.marker ? params.marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>`
          return `${marker} ${params.seriesName}<br>${params.dimensionNames[0]}：${params.data[0]}<br>${params.dimensionNames[1]}：${params.data[1]}`
        }
      }

      // 不顯示"全選"按鈕
      if (this.dataset.buckets.length < 1) chartAddon.legend.selector = false

      // legend 顯示設定
      chartAddon.legend = {
        ...chartAddon.legend,
        data: [
          ...this.dataset.columns,
          ...((this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0) && [this.$t('clustering.outlier')])
        ]
      }

      // 計算總點數
      const dotsAmount = [].concat.apply([], [
        ...this.dataset.buckets,
        ...((this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0) && [this.dataset.outliersBuckets])
      ]).length

      // 一群組設定 serie
      this.dataset.buckets.forEach((group, index) => {
        chartAddon.series.push({
          ...scatterOptions.chartData,
          symbolSize: this.dotSize(dotsAmount),
          data: group,
          name: this.dataset.columns[index],
          dimensions: [this.title.xAxis[0].display_name, this.title.yAxis[0].display_name]
        })
      })
 
      // 處理分群分群
      if (this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0) {
        scatterOptions.chartData.symbolSize = this.dotSize(this.dataset.buckets.length)
        chartAddon.series.push({
          ...scatterOptions.chartData,
          data: this.dataset.outliersBuckets,
          name: this.$t('clustering.outlier'),
          dimensions: [this.title.xAxis[0].display_name, this.title.yAxis[0].display_name]
        })
      }

      // 組裝原始資料
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let maxLength = dataset.length > 1000 ? 1000 : dataset.length
        let table = '<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div>' +
          `<div style="margin-top: 16px;padding: 0 16px;">${maxLength === 1000 ? this.$t('resultDescription.displayTopData', {count: maxLength}) : this.$t('resultDescription.displayTotalData', {count: maxLength})}</div>` +
          '<table style="width:100%;padding: 0 16px;"><tbody><tr>' +
          `<td style="padding: 4px 12px;">${i18n.t('clustering.cluster')}</td>` +
          '<td style="padding: 4px 12px;">' + this.title.xAxis[0].display_name + '</td>' +
          '<td style="padding: 4px 12px;">' + this.title.yAxis[0].display_name + '</td>' +
          '</tr>'

        for (let serieIndex = 0; serieIndex < opt.series.length; serieIndex++) {
          const serieInfo = opt.series[serieIndex]
          for (let itemIndex = 0; itemIndex < serieInfo.data.length; itemIndex++) {
            table += `<tr style='background-color:${maxLength % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>
              <td style="padding: 4px 12px;">${serieInfo.name}</td><td style="padding: 4px 12px;">${serieInfo.data[itemIndex][0]}</td><td style="padding: 4px 12px;">${serieInfo.data[itemIndex][1]}</td>
            </tr>`
            maxLength--
            if (maxLength === 0) break
          }
        }

        table += '</tbody></table>'
        return table
      }

      // export data
      this.$nextTick(() => {
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            const groups = chartAddon.legend.data
            const groupsData = [
              ...this.dataset.buckets,
              ...((this.dataset.outliersBuckets && this.dataset.outliersBuckets.length > 0) && [this.dataset.outliersBuckets])
            ]
            const exportData = groupsData.reduce((acc, groupData, groupIndex) => {
              groupData.forEach(data => acc.push([groups[groupIndex], ...data]))
              return acc
            }, [])

            exportData.unshift([i18n.t('clustering.cluster'), this.title.xAxis[0].display_name, this.title.yAxis[0].display_name])
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })
      
      chartAddon.color = this.colorSet
      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
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
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  },
  methods: {
    dotSize (dataLength) {
      if (dataLength > 500 && dataLength < 1999) {
        return 4
      } else if (dataLength > 1999 && dataLength < 4999) {
        return 2
      } else if (dataLength > 4999) {
        return 1
      } else {
        return 8
      }
    },
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
                dc_id: this.title.xAxis[0].dc_id,
                data_type: this.title.xAxis[0].data_type,
                display_name: this.title.xAxis[0].display_name,
                start: this.title.xAxis[0].stats_type.toLowerCase() === 'numeric' ? coordRange[0][0] : this.dataset.index[coordRange[0][0]],
                end: this.title.xAxis[0].stats_type.toLowerCase() === 'numeric' ? coordRange[0][1] : this.dataset.index[coordRange[0][1]]
              }
            },
            {
              type: 'range',
              properties: {
                dc_id: this.title.yAxis[0].dc_id,
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
.display-scatter-cluster-chart {
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