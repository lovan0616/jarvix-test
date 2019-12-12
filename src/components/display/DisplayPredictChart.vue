<template>
  <div class="predict-question-block">
    <div class="display-predict-chart">
      <v-echart
        :style="chartStyle"
        :options="options"
        auto-resize
        @brushselected="brushRegionSelected"
      >
      </v-echart>
    </div>
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
              {{ singleType.properties.display_name }}{{ $t('resultDescription.between', {start: singleType.properties.start, end: singleType.properties.end }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
    <div class="predict-detail-region"
      v-if="info.length > 0"
    >
      <div class="block-title">{{ $t('resultDescription.predictionInfo') }}</div>
      <div class="predict-detail-block">
        <div class="single-info-block"
          v-for="(singleInfo, index) in info"
          :key="index"
        >
          <div class="info-target">{{ $t("resultDescription.timeOfPredictionInterval", {time: singleInfo.time}) }}</div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.predictionMax') }}</div><div class="info-content">{{ singleInfo.max }}</div></div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.predictionMin') }}</div><div class="info-content">{{ singleInfo.min }}</div></div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.confidenceInterval') }}</div><div class="info-content">{{ singleInfo.diff }}</div></div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.confidenceIndex') }}</div><div class="info-content confidence">{{ singleInfo.conf }}</div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
import {
  getDrillDownTool,
  colorDefault,
  colorOnly1,
  colorOnly2,
  color3,
  color10,
  xAxisDefault,
  yAxisDefault
} from './common/addons'

export default {
  name: 'DisplayPredictChart',
  props: {
    dataset: { type: [Object, Array, String], default: () => ([]) },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: null,
          yAxis: null
        }
      }
    },
    info: {
      type: Array,
      default () {
        return []
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
    _dataset () {
      let result
      if (typeof this.dataset === 'string') result = JSON.parse(this.dataset)
      else result = this.dataset

      // 如果有 column 經過 Number() 後為數字 ，echart 會畫不出來，所以補個空格給他
      if (result.columns) {
        result.columns = result.columns.map(element => {
          return isNaN(Number(element)) ? element : ' ' + element
        })
      }

      return result
    },
    chartStyle () {
      return {
        width: '100%',
        height: this.isPreview ? '200px' : '380px'
      }
    },
    dataList () {
      if ((this._dataset instanceof Array)) return this._dataset
      else return this.tobeDataset(this._dataset)
    },
    series () {
      return this._dataset.columns.map((v, colIndex) => {
        let item = {
          name: v,
          type: 'line'
        }
        switch (colIndex) {
          case 0:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: 'transparent'
            }
            break
          case 1:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: 'transparent'
            }
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
          case 2:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: colorOnly1
            }
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
          case 3:
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
        }
        return item
      })
    },
    options () {
      let config = {
        xAxis: xAxisDefault(),
        yAxis: yAxisDefault(),
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.title),
        dataset: {
          source: this.dataList
        },
        series: this.series,
        color: this.colorList
      }
      // 為了讓只有 line chart 跟 bar chart 才顯示，所以加在這邊
      config.toolbox.feature.magicType.show = true
      config.xAxis.name = this.title.xAxis.display_name ? this.title.xAxis.display_name.replace(/ /g, '\r\n') : this.title.xAxis.display_name
      config.yAxis.name = this.title.yAxis.display_name
      config.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.dataset[0].source
        let table = '<table style="width:100%;padding: 0 16px;white-space:nowrap;"><tbody>'
        for (let i = 0; i < dataset.length; i++) {
          let tableData = dataset[i].reduce((acc, cur) => {
            return acc + '<td style="padding: 4px 12px;">' + cur + '</td>'
          }, '')
          table += `<tr style='background-color:${i % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>${tableData}</tr>`
        }
        table += '</tbody></table>'
        return table
      }

      if (this.isPreview) this.previewChartSetting(config)
      return config
    },
    colorList () {
      switch (this.dataList[0].length) {
        case 2:
          return colorOnly1
        case 3:
          return colorOnly2
        case 4:
          return color3
        case 6:
          return colorDefault
        default:
          return color10
      }
    }
  },
  methods: {
    tobeDataset (data) {
      const result = [['index']]
      result[0] = result[0].concat(data.columns)
      data.data.forEach((row, rowIndex) => {
        const rowData = [data.index[rowIndex]].concat(row)
        result.push(rowData)
      })
      return result
    },
    brushRegionSelected (params) {
      this.selectedData = params.batch[0].areas.map(areaElement => {
        let coordRange = areaElement.coordRange
        return {
          type: 'range',
          properties: {
            dc_name: this.title.xAxis.dc_name,
            data_type: this.title.xAxis.data_type,
            display_name: this.title.xAxis.display_name,
            start: this.dataset.index[coordRange[0]],
            end: this.dataset.index[coordRange[1]]
          }
        }
      })
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  }
}
</script>
<style lang="scss" scoped>
.predict-question-block {
  .display-predict-chart {
    width: 100%;
    margin-bottom: 16px;
  }
  .predict-detail-region {
    .block-title {
      font-size: 24px;
      margin-bottom: 24px;
      font-weight: 600;
    }
  }
  .predict-detail-block {
    display: flex;
    flex-wrap: wrap;

    .single-info-block {
      width: 24.25%;
      background-color: $theme-bg-color;
      border-radius: 8px;
      padding: 20px;
      margin-right: 1%;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .info-title {
    width: 100px;
  }
  .info-detail {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .info-target {
    color: $theme-color-primary;
    margin-bottom: 8px;
  }
}
</style>
