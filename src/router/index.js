import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '@/components/layout/AppLayout'

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
          name: 'PagePinboardList',
          component: () => import('@/pages/pinboard/Index')
        },
        {
          path: 'pinboard/:id',
          name: 'PagePinboard',
          component: () => import('@/pages/pinboard/Pinboard')
        },
        // FIXME for poc/foxconn_molding
        // {
        //   path: 'algorithm',
        //   name: 'PageAlgorithmList',
        //   component: () => import('@/pages/algorithm/Index')
        // },
        // {
        //   path: 'algorithm/create',
        //   name: 'PageAlgorithmCreate',
        //   component: () => import('@/pages/algorithm/Create')
        // },
        // {
        //   path: 'algorithm/1',
        //   name: 'PageAlgorithmEdit1',
        //   component: () => import('@/pages/algorithm/Edit1')
        // },
        // {
        //   path: 'algorithm/2',
        //   name: 'PageAlgorithmEdit2',
        //   component: () => import('@/pages/algorithm/Edit2')
        // },
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
        },
        {
          path: 'user-management',
          name: 'UserManagement',
          component: () => import('@/pages/userManagement/Index')
        },
        {
          path: 'function-description',
          name: 'FunctionDescription',
          component: () => import('@/pages/functionDescription/Index')
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
