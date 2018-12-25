import Vue from 'vue'
import Router from 'vue-router'
import PageIndex from '@/pages/Index'
import PageResult from '@/pages/Result'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PageIndex',
      component: PageIndex
    },
    {
      path: '/result',
      name: 'PageResult',
      component: PageResult
    }
  ]
})
