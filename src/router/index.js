import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PageIndex',
      component: () => import('@/pages/Index')
    },
    {
      path: '/result',
      name: 'PageResult',
      component: () => import('@/pages/result/Index')
    }
  ]
})
