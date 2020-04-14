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
          component: () => import('@/components/layout/HomeLayout'),
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
          path: 'pinboard',
          component: () => import('@/pages/pinboard/Index'),
          children: [
            {
              path: '/',
              name: 'PagePinboardList',
              component: () => import('@/pages/pinboard/PinboardList')
            },
            {
              path: ':id',
              name: 'PagePinboard',
              component: () => import('@/pages/pinboard/Pinboard')
            }
          ]
        },
        // FIXME for poc/foxconn_molding
        {
          path: 'algorithm',
          component: () => import('@/pages/algorithm/Index'),
          children: [
            {
              path: '/',
              name: 'PageAlgorithmList',
              component: () => import('@/pages/algorithm/AlgorithmList')
            },
            {
              path: 'create',
              name: 'PageAlgorithmCreate',
              component: () => import('@/pages/algorithm/Create')
            },
            {
              path: '1',
              name: 'PageAlgorithmEdit1',
              component: () => import('@/pages/algorithm/Edit1')
            },
            {
              path: '2',
              name: 'PageAlgorithmEdit2',
              component: () => import('@/pages/algorithm/Edit2')
            }
          ]
        },
        // 該頁面名稱如果為側邊導覽列第一層 meta 需設定 isMainNav 為 true
        // 如果第一層下有子功能列表 isMainNav 設定在子層 redirect 模組
        // meta 中 layer 用來設定從 management 模組往下到自己的路徑
        // 當前頁面側邊導覽列第一層要顯示哪個模組，layer 就寫到那個模組為止
        {
          path: 'account',
          component: () => import('@/pages/management/Index'),
          children: [
            {
              path: 'account-management',
              component: () => import('@/pages/management/account/AccountManagement'),
              children: [
                {
                  path: '/',
                  redirect: { name: 'AccountUserManagement' },
                  name: 'AccountManagement',
                  meta: {
                    isMainNav: true
                  }
                },
                {
                  path: 'user-management',
                  component: () => import('@/pages/userManagement/Index'),
                  name: 'AccountUserManagement',
                  meta: {
                    layers: ['account', 'account-management']
                  }
                },
                {
                  path: 'group-management',
                  component: () => import('@/pages/management/account/GroupManagement'),
                  name: 'AccountGroupManagement',
                  meta: {
                    layers: ['account', 'account-management']
                  }
                }
              ]
            },
            {
              path: 'function-description',
              name: 'FunctionDescription',
              component: () => import('@/pages/functionDescription/Index'),
              meta: {
                isMainNav: true,
                layers: ['account', 'function-description']
              }
            }
          ]
        },
        {
          path: 'group',
          component: () => import('@/pages/management/Index'),
          children: [
            // TODO: 開發帳戶管理時需更新此路由階層、補上 meta 和 layer
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
        }
      ]
    },
    {
      path: '/login',
      name: 'PageLogin',
      component: () => import('@/pages/login/Index')
    },
    {
      path: '/signup',
      name: 'PageSignup',
      component: () => import('@/pages/signup/Index')
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
