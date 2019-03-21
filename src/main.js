// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueEvents from 'vue-events'

import store from './store'
import '@/icons'

import './styles/components/task.scss'
import './styles/components/popup-guiding.scss'
import './styles/components/container/container-block.scss'
import './styles/components/container/container-card.scss'
import './styles/components/display/display-index-number.scss'
import './styles/components/display/display-index-number-diff.scss'
import './styles/App.scss'

import ElementUI from 'element-ui'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'

import Layout from './components/Layout.vue'
import Task from './components/Task.vue'
import ContainerBlock from './components/container/Container-block.vue'
import ContainerCard from './components/container/Container-card.vue'
import DisplayBasicChart from './components/display/Display-basic-chart.vue'
import DisplayBasicIndicator from './components/display/Display-basic-indicator.vue'
// import DisplayIndexNumber from './components/display/Display-index-number.vue'
// import DisplayIndexNumberDiff from './components/display/Display-index-number-diff.vue'
// import DisplayProcessFlowChart from './components/display/Display-process-flow-chart.vue'

import SyTable from './components/sy/Sy-table.vue'
import SyHolyGrail from './components/sy/Sy-holy-grail.vue'
import SySection from './components/sy/Sy-section.vue'
import SyBlock from './components/sy/Sy-block.vue'

import PreviewBookmark from './pages/Preview-bookmark.vue'

Vue.use(VueEvents)
Vue.use(ElementUI)

Vue.component('echart', ECharts)
Vue.component(SyBlock.name, SyBlock)
Vue.component(SySection.name, SySection)
Vue.component(SyHolyGrail.name, SyHolyGrail)
Vue.component(SyTable.name, SyTable)

Vue.component(Layout.name, Layout)
Vue.component(Task.name, Task)
Vue.component(ContainerBlock.name, ContainerBlock)
Vue.component(ContainerCard.name, ContainerCard)
Vue.component(DisplayBasicChart.name, DisplayBasicChart)
Vue.component(DisplayBasicIndicator.name, DisplayBasicIndicator)
// Vue.component(DisplayIndexNumber.name, DisplayIndexNumber)
// Vue.component(DisplayIndexNumberDiff.name, DisplayIndexNumberDiff)
// Vue.component(DisplayProcessFlowChart.name, DisplayProcessFlowChart)

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
