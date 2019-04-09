// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueEvents from 'vue-events'

import store from './store'
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
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/legend'

import Layout from './components/Layout.vue'
import Task from './components/Task.vue'
import ContainerBlock from './components/container/ContainerBlock.vue'
import ContainerCard from './components/container/ContainerCard.vue'
import DisplayBasicChart from './components/display/DisplayBasicChart.vue'
import SyTable from './components/sy/SyTable.vue'
import PreviewBookmark from './components/PreviewBookmark.vue'
import InsightsInfo from '@/pages/result/components/InsightsInfo'
import IndicatorsInfo from '@/pages/result/components/IndicatorsInfo'
import ResultBoard from '@/components/resultBoard/ResultBoard'
import ResultBoardHeader from '@/components/resultBoard/ResultBoardHeader'
import ResultBoardBody from '@/components/resultBoard/ResultBoardBody'
import DisplayAverageBarChart from '@/components/display/DisplayAverageBarChart'
import DisplayScatterChart from '@/components/display/DisplayScatterChart'

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
Vue.component(IndicatorsInfo.name, IndicatorsInfo)
Vue.component(ResultBoard.name, ResultBoard)
Vue.component(ResultBoardHeader.name, ResultBoardHeader)
Vue.component(ResultBoardBody.name, ResultBoardBody)
Vue.component(DisplayAverageBarChart.name, DisplayAverageBarChart)
Vue.component(DisplayScatterChart.name, DisplayScatterChart)
Vue.component(Layout.name, Layout)
Vue.component(Task.name, Task)
Vue.component(ContainerBlock.name, ContainerBlock)
Vue.component(ContainerCard.name, ContainerCard)
Vue.component(DisplayBasicChart.name, DisplayBasicChart)
Vue.component(PreviewBookmark.name, PreviewBookmark)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
