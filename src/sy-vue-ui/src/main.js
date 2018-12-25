import Vue from 'vue'
import App from './App.vue'

import './styles/element-ui.scss'
import './styles/sy-ui.scss'

import ElementUI from 'element-ui'
Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
