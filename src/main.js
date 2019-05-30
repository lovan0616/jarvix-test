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

import {
  Select,
  Option,
  Table,
  Autocomplete,
  TableColumn,
  Loading
} from 'element-ui'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/boxplot'
import 'echarts/lib/chart/custom'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/legend'
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
import DisplayAverageBarChart from '@/components/display/DisplayAverageBarChart'
import DisplayScatterChart from '@/components/display/DisplayScatterChart'
import DisplayHistogramChart from '@/components/display/DisplayHistogramChart'
import DisplayBoxPlotChart from '@/components/display/DisplayBoxPlotChart'
import InsightsInfo from '@/components/display/InsightsInfo'
import IndicatorInfo from '@/components/display/IndicatorInfo'
import IndicatorsList from '@/components/display/IndicatorsList'

Vue.use(VueEvents)
// Element UI components
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Autocomplete)
Vue.use(Loading)

Vue.component('echart', ECharts)
Vue.component(SyTable.name, SyTable)
Vue.component(InsightsInfo.name, InsightsInfo)
Vue.component(IndicatorInfo.name, IndicatorInfo)
Vue.component(IndicatorsList.name, IndicatorsList)
Vue.component(ResultBoard.name, ResultBoard)
Vue.component(ResultBoardHeader.name, ResultBoardHeader)
Vue.component(ResultBoardBody.name, ResultBoardBody)
Vue.component(DisplayAverageBarChart.name, DisplayAverageBarChart)
Vue.component(DisplayScatterChart.name, DisplayScatterChart)
Vue.component(DisplayHistogramChart.name, DisplayHistogramChart)
Vue.component(DisplayBoxPlotChart.name, DisplayBoxPlotChart)
Vue.component(Layout.name, Layout)
Vue.component(Task.name, Task)
Vue.component(ContainerBlock.name, ContainerBlock)
Vue.component(ContainerCard.name, ContainerCard)
Vue.component(DisplayBasicChart.name, DisplayBasicChart)
Vue.component(PreviewBookmark.name, PreviewBookmark)
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
          return '欄位不得空白'
        },
        email () {
          return '信箱格式錯誤'
        },
        numeric () {
          return '請輸入數字'
        },
        max (field, length) {
          return `最多${length}個字元`
        }
      }
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
