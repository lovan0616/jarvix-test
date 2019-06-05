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
          component: () => import('@/pages/result/Index'),
          children: [
            {
              path: 'preview',
              name: 'PageResultPreview',
              component: () => import('@/pages/result/ResultPreview')
            },
            {
              path: 'display',
              name: 'PageResultDisplay',
              component: () => import('@/pages/result/ResultDisplay')
            }
          ]
        },
        {
          path: 'pinboard',
          name: 'PagePinboard',
          component: () => import('@/pages/pinboard/Index')
        },
        {
          path: 'data-management',
          component: () => import('@/pages/dataManagement/Index'),
          children: [
            {
              path: '/',
              name: 'PageDataSourceList',
              component: () => import('@/pages/dataManagement/DataSourceList')
            },
            {
              path: ':id',
              name: 'PageDataFileList',
              component: () => import('@/pages/dataManagement/DataFileList')
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: () => import('@/pages/login/Index')
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
