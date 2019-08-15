import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '@/components/layout/Applayout'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
    },
    {
      path: '/kyc',
      name: 'PageKYC',
      component: () => import('@/pages/kyc/Index')
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
