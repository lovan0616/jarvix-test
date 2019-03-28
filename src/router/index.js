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
        },
        {
          path: 'pinboard',
          name: 'PagePinboard',
          component: () => import('@/pages/pinboard/Index')
        }
      ]
    }
  ],
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
