// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueEvents from 'vue-events'
import VeeValidate, { Validator } from 'vee-validate'
import VueGtag from 'vue-gtag'
import store from './store'
import '@/utils/filters'
import '@/utils/mixins'
import '@/icons'
import './styles/App.scss'
import i18n from './lang/index.js'

import {
  Button,
  DatePicker,
  TimeSelect,
  Popover,
  InputNumber,
  Checkbox,
  Input,
  Select,
  Option,
  Table,
  Autocomplete,
  TableColumn,
  Loading,
  Tabs,
  TabPane,
  Pagination,
  Collapse,
  CollapseItem,
  Tooltip,
  Switch,
  Menu,
  Submenu,
  MenuItem
} from 'element-ui'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/boxplot'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/custom'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataset'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/geo'
import 'echarts-stat'

import Layout from './components/Layout.vue'
import Task from './components/display/Task.vue'
import DisplayBasicChart from './components/display/DisplayBasicChart.vue'
import SyTable from './components/table/SyTable.vue'
import PreviewDataSource from './components/PreviewDataSource.vue'
import ResultBoard from '@/components/resultBoard/ResultBoard'
import ResultBoardHeader from '@/components/resultBoard/ResultBoardHeader'
import ResultBoardBody from '@/components/resultBoard/ResultBoardBody'
import GeneralResult from '@/components/resultBoard/GeneralResult'
import CorrelationExplorationResult from '@/components/resultBoard/CorrelationExplorationResult'
import RootCauseResult from '@/components/resultBoard/RootCauseResult'
import MultiResult from '@/components/resultBoard/MultiResult'
import MultiResultV2 from '@/components/resultBoard/MultiResultV2'
import DataPreviewLayout from '@/components/resultBoard/DataPreviewLayout'
import RootCauseBoardBody from '@/components/resultBoard/RootCauseBoardBody'
import DisplayAverageBarChart from '@/components/display/DisplayAverageBarChart'
import DisplayScatterChart from '@/components/display/DisplayScatterChart'
// import DisplayHistogramChart from '@/components/display/DisplayHistogramChart'
import DisplayComputedHistogramChart from '@/components/display/DisplayComputedHistogramChart'
// import DisplayBoxPlotChart from '@/components/display/DisplayBoxPlotChart'
import DisplayComputedBoxPlotChart from '@/components/display/DisplayComputedBoxPlotChart'
import DisplayTreeMapChart from '@/components/display/DisplayTreeMapChart'
import DisplayBubbleScatterChart from '@/components/display/DisplayBubbleScatterChart'
import DisplayGroupScatterChart from '@/components/display/DisplayGroupScatterChart'
import DisplayLineChart from '@/components/display/DisplayLineChart'
import DisplayStackLineChart from '@/components/display/DisplayStackLineChart'
import DisplayGroupLineChart from '@/components/display/DisplayGroupLineChart'
import DisplayCompositionLineChart from '@/components/display/DisplayCompositionLineChart'
import DisplayPieChart from '@/components/display/DisplayPieChart'
import DisplayBarChart from '@/components/display/DisplayBarChart'
import DisplayStackBarChart from '@/components/display/DisplayStackBarChart'
// 多 Y 軸
import DisplayMultiAxisBarChart from '@/components/display/DisplayMultiAxisBarChart'
import DisplayMultiAxisLineChart from '@/components/display/DisplayMultiAxisLineChart'
// 水平方向 bar chart
import DisplayParallelBarChart from '@/components/display/DisplayParallelBarChart'
import DisplayChinaMap from '@/components/display/DisplayChinaMap'
import DisplayWorldMap from '@/components/display/DisplayWorldMap'
import DisplayPredictChart from '@/components/display/DisplayPredictChart'
import DisplayHeatMapChart from '@/components/display/DisplayHeatMapChart'
import DisplaySankeyChart from '@/components/display/DisplaySankeyChart'
import DisplayCorrelationFeatures from '@/components/display/DisplayCorrelationFeatures'
import DisplayPivotTable from '@/components/display/DisplayPivotTable'
// import DisplayPivot from '@/components/display/DisplayPivot'
import RootCauseInfo from '@/components/display/RootCauseInfo'
import InsightTable from '@/components/display/InsightTable'
import SelectedRegion from '@/components/display/SelectedRegion'
import NoResult from '@/components/display/NoResult'
import EmptyResult from '@/pages/result/components/EmptyResult'
import PreviewResultBoard from '@/components/PreviewResultBoard'
import TrendRootCause from '@/components/display/TrendRootCause'
import RootCauseItem from '@/components/display/RootCauseItem'
import CorrelationInsight from '@/components/display/CorrelationInsight'
import RootCauseDescription from '@/components/display/RootCauseDescription'
import Spinner from '@/components/Spinner'
import ArrowButton from '@/components/resultBoard/ArrowButton'
import DisplayNoAnswerInfo from '@/components/display/DisplayNoAnswerInfo'

// 排程
import vGanttChart from 'v-gantt-chart'
import DefaultButton from '@/schedule/components/DefaultButton.vue'
import DefaultInput from '@/schedule/components/DefaultInput.vue'
import DefaultSelect from '@/schedule/components/DefaultSelect.vue'
import DefaultDatePicker from '@/schedule/components/DefaultDatePicker.vue'
// import Spinner from '@/schedule/components/Spinner.vue'

var Rollbar = require('vue-rollbar')

Vue.use(VueEvents)
// Element UI components
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(Popover)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Autocomplete)
Vue.use(Loading)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.use(vGanttChart)

Vue.component('v-echart', ECharts)
Vue.component(Layout.name, Layout)
Vue.component(Task.name, Task)
Vue.component(PreviewDataSource.name, PreviewDataSource)
Vue.component(SyTable.name, SyTable)
Vue.component(RootCauseInfo.name, RootCauseInfo)
Vue.component(InsightTable.name, InsightTable)
Vue.component(ResultBoard.name, ResultBoard)
Vue.component(ResultBoardHeader.name, ResultBoardHeader)
Vue.component(ResultBoardBody.name, ResultBoardBody)
Vue.component(GeneralResult.name, GeneralResult)
Vue.component(CorrelationExplorationResult.name, CorrelationExplorationResult)
Vue.component(RootCauseResult.name, RootCauseResult)
Vue.component(MultiResult.name, MultiResult)
Vue.component(MultiResultV2.name, MultiResultV2)
Vue.component(DataPreviewLayout.name, DataPreviewLayout)
Vue.component(RootCauseBoardBody.name, RootCauseBoardBody)
Vue.component(DisplayBasicChart.name, DisplayBasicChart)
Vue.component(DisplayAverageBarChart.name, DisplayAverageBarChart)
Vue.component(DisplayScatterChart.name, DisplayScatterChart)
Vue.component(DisplayGroupScatterChart.name, DisplayGroupScatterChart)
// Vue.component(DisplayHistogramChart.name, DisplayHistogramChart)
Vue.component(DisplayComputedHistogramChart.name, DisplayComputedHistogramChart)
// Vue.component(DisplayBoxPlotChart.name, DisplayBoxPlotChart)
Vue.component(DisplayComputedBoxPlotChart.name, DisplayComputedBoxPlotChart)
Vue.component(DisplayBubbleScatterChart.name, DisplayBubbleScatterChart)
Vue.component(DisplayTreeMapChart.name, DisplayTreeMapChart)
Vue.component(DisplayLineChart.name, DisplayLineChart)
Vue.component(DisplayStackLineChart.name, DisplayStackLineChart)
Vue.component(DisplayGroupLineChart.name, DisplayGroupLineChart)
Vue.component(DisplayCompositionLineChart.name, DisplayCompositionLineChart)
Vue.component(DisplayStackBarChart.name, DisplayStackBarChart)
Vue.component(DisplayPieChart.name, DisplayPieChart)
Vue.component(DisplayBarChart.name, DisplayBarChart)
Vue.component(DisplayMultiAxisBarChart.name, DisplayMultiAxisBarChart)
Vue.component(DisplayMultiAxisLineChart.name, DisplayMultiAxisLineChart)
Vue.component(DisplayParallelBarChart.name, DisplayParallelBarChart)
Vue.component(DisplayChinaMap.name, DisplayChinaMap)
Vue.component(DisplayWorldMap.name, DisplayWorldMap)
Vue.component(DisplayPredictChart.name, DisplayPredictChart)
// Vue.component(DisplayPivot.name, DisplayPivot)
Vue.component(DisplayPivotTable.name, DisplayPivotTable)
Vue.component(DisplayHeatMapChart.name, DisplayHeatMapChart)
Vue.component(DisplaySankeyChart.name, DisplaySankeyChart)
Vue.component(DisplayCorrelationFeatures.name, DisplayCorrelationFeatures)
Vue.component(SelectedRegion.name, SelectedRegion)
Vue.component(NoResult.name, NoResult)
Vue.component(EmptyResult.name, EmptyResult)
Vue.component(PreviewResultBoard.name, PreviewResultBoard)
Vue.component(TrendRootCause.name, TrendRootCause)
Vue.component(RootCauseItem.name, RootCauseItem)
Vue.component(CorrelationInsight.name, CorrelationInsight)
Vue.component(RootCauseDescription.name, RootCauseDescription)
Vue.component(Spinner.name, Spinner)
Vue.component(ArrowButton.name, ArrowButton)
Vue.component(DisplayNoAnswerInfo.name, DisplayNoAnswerInfo)

Vue.component('DefaultButton', DefaultButton)
Vue.component('DefaultInput', DefaultInput)
Vue.component('DefaultSelect', DefaultSelect)
Vue.component('DefaultDatePicker', DefaultDatePicker)
// Vue.component('Spinner', Spinner)

/** Custom Rule */
Validator.extend('requireOneNumeric', function (value) {
  return /.*[0-9].*/i.test(value)
})

Validator.extend('letterSpace', function (value) {
  // 含簡繁體、英文、空格
  return /^[\u4e00-\u9fa5_a-zA-Z0-9\s]*$/i.test(value) && !Number(value)
})

Vue.use(VeeValidate, {
  // 避免自動 inject 到所有 component
  inject: false,
  // 語系
  locale: 'zh_TW',
  // 驗證字串
  dictionary: {
    zh_TW: {
      messages: {
        required () {
          return i18n.t('message.formColumnEmpty')
        },
        email () {
          return i18n.t('message.formMailWrong')
        },
        numeric () {
          return i18n.t('message.formNumberEmpty')
        },
        max (field, length) {
          return i18n.t('message.formCharacterOverMax', { max: length })
        },
        min (field, length) {
          return i18n.t('message.formCharacterOverMin', { min: length })
        },
        requireOneNumeric (field) {
          return i18n.t('message.formNumericeOverOne')
        },
        confirmed () {
          return i18n.t('message.pleaseConfirmPassword')
        },
        letterSpace () {
          return i18n.t('message.formLetterSpaceEmpty')
        }
      }
    },
    zh_CN: {
      messages: {
        required () {
          return i18n.t('message.formColumnEmpty')
        },
        email () {
          return i18n.t('message.formMailWrong')
        },
        numeric () {
          return i18n.t('message.formNumberEmpty')
        },
        max (field, length) {
          return i18n.t('message.formCharacterOverMax', { max: length })
        },
        min (field, length) {
          return i18n.t('message.formCharacterOverMin', {min: length})
        },
        requireOneNumeric (field) {
          return i18n.t('message.formNumericeOverOne')
        },
        confirmed () {
          return i18n.t('message.pleaseConfirmPassword')
        },
        letterSpace () {
          return i18n.t('message.formLetterSpaceEmpty')
        }
      }
    }
  }
})

Vue.use(VueGtag, {
  disableScriptLoad: true,
  config: {
    id: 'UA-152823461-1',
    params: {
      send_page_view: false
    }
  }
}, router)

// rollbar error tracking
Vue.use(Rollbar, {
  accessToken: process.env.ROLL_BAR,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: window.location.hostname === 'sygps.sis.ai' || window.location.hostname === 'jarvix.sis.ai',
  environment: window.location.hostname,
  payload: {
    client: {
      javascript: {
        code_version: '1.0',
        source_map_enabled: true,
        guess_uncaught_frames: true
      }
    },
    // person: {
    //   id: this.userInfo.account,
    //   username: res.account,
    //   email: this.userInfo.account
    // },
    server: {
      host: window.location.host
    }
  }
})

Vue.config.productionTip = false
Vue.config.errorHandler = err => {
  Vue.rollbar.error(err)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>'
})
