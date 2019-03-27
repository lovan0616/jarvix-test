import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '@/components/layout/Applayout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'PageIndex',
          component: () => import('@/pages/Index')
        },
        {
          path: 'result',
          name: 'PageResult',
          component: () => import('@/pages/result/Index')
        }
      ]
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: () => import('@/pages/login/Index')
    }
  ]
})
