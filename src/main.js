// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueEvents from 'vue-events'
import VeeValidate from 'vee-validate'
import store from './store'
import '@/utils/filters'
import '@/utils/mixins'
import '@/icons'
import './styles/App.scss'
import i18n from './lang/index.js'

import {
  Select,
  Option,
  Table,
  Autocomplete,
  TableColumn,
  Loading,
  Tabs,
  TabPane,
  Pagination
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
import Task from './components/Task.vue'
import ContainerBlock from './components/container/ContainerBlock.vue'
import ContainerCard from './components/container/ContainerCard.vue'
import DisplayBasicChart from './components/display/DisplayBasicChart.vue'
import SyTable from './components/table/SyTable.vue'
import PreviewBookmark from './components/PreviewBookmark.vue'
import ResultBoard from '@/components/resultBoard/ResultBoard'
import ResultBoardHeader from '@/components/resultBoard/ResultBoardHeader'
import ResultBoardBody from '@/components/resultBoard/ResultBoardBody'
import RootCauseBoardBody from '@/components/resultBoard/RootCauseBoardBody'
import DisplayAverageBarChart from '@/components/display/DisplayAverageBarChart'
import DisplayScatterChart from '@/components/display/DisplayScatterChart'
import DisplayHistogramChart from '@/components/display/DisplayHistogramChart'
import DisplayBoxPlotChart from '@/components/display/DisplayBoxPlotChart'
import DisplayTreeMapChart from '@/components/display/DisplayTreeMapChart'
import DisplayBubbleScatterChart from '@/components/display/DisplayBubbleScatterChart'
import DisplayGroupScatterChart from '@/components/display/DisplayGroupScatterChart'
import DisplayLineChart from '@/components/display/DisplayLineChart'
import DisplayPieChart from '@/components/display/DisplayPieChart'
import DisplayBarChart from '@/components/display/DisplayBarChart'
import DisplayChinaMap from '@/components/display/DisplayChinaMap'
import DisplayWorldMap from '@/components/display/DisplayWorldMap'
import DisplayPredictChart from '@/components/display/DisplayPredictChart'
import DisplayPivot from '@/components/display/DisplayPivot'
import PreviewPivot from '@/components/display/PreviewPivot'
import InsightsInfo from '@/components/display/InsightsInfo'
import RootCauseInfo from '@/components/display/RootCauseInfo'
import InsightTable from '@/components/display/InsightTable'
import IndicatorInfo from '@/components/display/IndicatorInfo'
import IndicatorsList from '@/components/display/IndicatorsList'
import NoResult from '@/components/display/NoResult'
import EmptyResult from '@/pages/result/components/EmptyResult'
import PreviewResultBoard from '@/components/PreviewResultBoard'
import TrendRootCause from '@/components/display/TrendRootCause'
import RootCauseItem from '@/components/display/RootCauseItem'
import RootCauseDescription from '@/components/display/RootCauseDescription'
import QuickStart from '@/components/display/QuickStart'

var Rollbar = require('vue-rollbar')

Vue.use(VueEvents)
// Element UI components
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Autocomplete)
Vue.use(Loading)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)

Vue.component('v-echart', ECharts)
Vue.component(Layout.name, Layout)
Vue.component(Task.name, Task)
Vue.component(PreviewBookmark.name, PreviewBookmark)
Vue.component(SyTable.name, SyTable)
Vue.component(InsightsInfo.name, InsightsInfo)
Vue.component(RootCauseInfo.name, RootCauseInfo)
Vue.component(InsightTable.name, InsightTable)
Vue.component(IndicatorInfo.name, IndicatorInfo)
Vue.component(IndicatorsList.name, IndicatorsList)
Vue.component(ResultBoard.name, ResultBoard)
Vue.component(ResultBoardHeader.name, ResultBoardHeader)
Vue.component(ResultBoardBody.name, ResultBoardBody)
Vue.component(RootCauseBoardBody.name, RootCauseBoardBody)
Vue.component(ContainerBlock.name, ContainerBlock)
Vue.component(ContainerCard.name, ContainerCard)
Vue.component(DisplayBasicChart.name, DisplayBasicChart)
Vue.component(DisplayAverageBarChart.name, DisplayAverageBarChart)
Vue.component(DisplayScatterChart.name, DisplayScatterChart)
Vue.component(DisplayGroupScatterChart.name, DisplayGroupScatterChart)
Vue.component(DisplayHistogramChart.name, DisplayHistogramChart)
Vue.component(DisplayBoxPlotChart.name, DisplayBoxPlotChart)
Vue.component(DisplayBubbleScatterChart.name, DisplayBubbleScatterChart)
Vue.component(DisplayTreeMapChart.name, DisplayTreeMapChart)
Vue.component(DisplayLineChart.name, DisplayLineChart)
Vue.component(DisplayPieChart.name, DisplayPieChart)
Vue.component(DisplayBarChart.name, DisplayBarChart)
Vue.component(DisplayChinaMap.name, DisplayChinaMap)
Vue.component(DisplayWorldMap.name, DisplayWorldMap)
Vue.component(DisplayPredictChart.name, DisplayPredictChart)
Vue.component(DisplayPivot.name, DisplayPivot)
Vue.component(PreviewPivot.name, PreviewPivot)
Vue.component(NoResult.name, NoResult)
Vue.component(EmptyResult.name, EmptyResult)
Vue.component(PreviewResultBoard.name, PreviewResultBoard)
Vue.component(TrendRootCause.name, TrendRootCause)
Vue.component(RootCauseItem.name, RootCauseItem)
Vue.component(RootCauseDescription.name, RootCauseDescription)
Vue.component(QuickStart.name, QuickStart)

Vue.use(VeeValidate, {
  // 避免自動 inject 到所有 component
  inject: false,
  // 語系
  locale: 'zh_CN',
  // 驗證字串
  dictionary: {
    zh_TW: {
      messages: {
        required () {
          return i18n.t('message.formColumnEmpty', 'zh-hant')
        },
        email () {
          return i18n.t('message.formMailWrong', 'zh-hant')
        },
        numeric () {
          return i18n.t('message.formNumberEmpty', 'zh-hant')
        },
        max (field, length) {
          return i18n.t('message.formCharacterOverMax', { max: length }, 'zh-hant')
        }
      }
    },
    zh_CN: {
      messages: {
        required () {
          return i18n.t('message.formColumnEmpty', 'zh-hans')
        },
        email () {
          return i18n.t('message.formMailWrong', 'zh-hans')
        },
        numeric () {
          return i18n.t('message.formNumberEmpty', 'zh-hans')
        },
        max (field, length) {
          return i18n.t('message.formCharacterOverMax', { max: length }, 'zh-hans')
        }
      }
    }
  }
})

// rollbar error tracking
Vue.use(Rollbar, {
  accessToken: process.env.ROLL_BAR,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.NODE_ENV,
  payload: {
    client: {
      javascript: {
        code_version: '1.0',
        source_map_enabled: true,
        guess_uncaught_frames: true
      }
    },
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
