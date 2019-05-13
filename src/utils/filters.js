import Vue from 'vue'

// 標註千分位
Vue.filter('formatComma', str => {
  return str ? str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : str
})
