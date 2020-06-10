import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '@/components/layout/AppLayout'
import store from '../store'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'

Vue.use(Router)

const router = new Router({
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
              component: () => import('@/pages/datasourceDashboard/Index')
            },
            {
              path: 'result',
              name: 'PageResult',
              component: () => import('@/pages/result/Index')
            }
          ]
        },
        {
          path: 'groupless-guidance',
          name: 'PageGrouplessGuidance',
          component: () => import('@/components/layout/GrouplessLayout'),
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
        // meta 使用 permission 指定路由權限
        {
          path: 'account',
          component: () => import('@/pages/management/Index'),
          children: [
            {
              path: 'account-management',
              component: () => import('@/pages/accountManagement/Index'),
              children: [
                {
                  path: '/',
                  redirect: { name: 'AccountUserManagement' },
                  name: 'AccountManagement',
                  meta: {
                    isMainNav: true,
                    icon: 'account-management'
                  }
                },
                {
                  path: 'user-management',
                  component: () => import('@/pages/userManagement/Index'),
                  name: 'AccountUserManagement',
                  meta: {
                    layers: ['account', 'account-management'],
                    permission: ['account_update_user']
                  }
                },
                {
                  path: 'group-management',
                  component: () => import('@/pages/accountGroupManagement/AccountGroupList'),
                  name: 'AccountGroupManagement',
                  meta: {
                    layers: ['account', 'account-management'],
                    permission: ['account_read_group']
                  }
                },
                {
                  path: 'group-management/create',
                  component: () => import('@/pages/accountGroupManagement/EditAccountGroup'),
                  name: 'CreateAccountGroup',
                  meta: {
                    layers: ['account', 'account-management'],
                    accountPermission: ['account_create_group'],
                    isHiddenNav: true
                  }
                },
                {
                  path: 'group-management/:id',
                  component: () => import('@/pages/accountGroupManagement/EditAccountGroup'),
                  name: 'EditAccountGroup',
                  meta: {
                    layers: ['account', 'account-management'],
                    accountPermission: ['account_update_group'],
                    isHiddenNav: true
                  }
                },
                {
                  path: 'info',
                  component: () => import('@/pages/accountInformation/Index'),
                  name: 'AccountInformation',
                  meta: {
                    layers: ['account', 'account-management'],
                    permission: ['account_read_user']
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
                layers: ['account', 'function-description'],
                icon: 'description'
              }
            }
          ]
        },
        {
          path: 'group',
          component: () => import('@/pages/management/Index'),
          children: [
            {
              path: 'datasource-management',
              component: () => import('@/pages/dataManagement/Index'),
              children: [
                {
                  path: '/',
                  redirect: { name: 'DataSourceList' },
                  name: 'DataSourceManagement',
                  meta: {
                    isMainNav: true,
                    icon: 'database'
                  }
                },
                {
                  path: 'datasource-list',
                  name: 'DataSourceList',
                  component: () => import('@/pages/dataManagement/DataSourceList'),
                  meta: {
                    layers: ['group', 'datasource-management'],
                    permission: ['group_read_user', 'group_read_data']
                  }
                }
              ]
            },
            {
              path: 'datasource-management/datasource-list',
              component: () => import('@/pages/dataManagement/Index'),
              children: [
                {
                  path: ':id',
                  redirect: to => ({name: 'DataFileList', params: {id: to.params.id}}),
                  name: 'DataFileManagement',
                  meta: {
                    isMainNav: true,
                    icon: 'database'
                  }
                },
                {
                  path: ':id/datafile-list',
                  name: 'DataFileList',
                  component: () => import('@/pages/dataManagement/DataFileList'),
                  meta: {
                    layers: ['group', 'datasource-management/datasource-list'],
                    permission: ['group_read_user', 'group_read_data']
                  }
                }
              ]
            },
            {
              path: 'user-management',
              component: () => import('@/pages/groupUserManagement/Index'),
              beforeEnter: (to, from, next) => {
                // 個人版 不能進入成員管理頁面
                if (store.state.userManagement.license.maxUser !== 1) {
                  next()
                } else {
                  router.push(from)
                }
              },
              children: [
                {
                  path: ':group_id',
                  redirect: to => ({name: 'GroupUserList', params: {group_id: to.params.group_id}}),
                  name: 'GroupUserManagement',
                  meta: {
                    isMainNav: true,
                    icon: 'userManage'
                  }
                },
                {
                  path: ':group_id',
                  component: () => import('@/pages/groupUserManagement/GroupUserList'),
                  name: 'GroupUserList',
                  meta: {
                    layers: ['group', 'user-management'],
                    permission: ['account_read_group']
                  }
                },
                {
                  path: ':group_id/create',
                  component: () => import('@/pages/groupUserManagement/GroupCreateUser'),
                  name: 'GroupCreateUser',
                  meta: {
                    layers: ['group', 'user-management'],
                    permission: ['account_create_group_user', 'group_create_user'],
                    isHiddenNav: true
                  }
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

router.beforeEach(async (to, from, next) => {
  // Declare routes without authentication
  const pathWithoutAuth = ['PageLogin', 'PageSignup']
  if (pathWithoutAuth.includes(to.name)) {
    next()
    return
  }

  // 將欲前往的頁面存取下來，避免使用者 token 失效被重新登入使用
  store.commit('setting/setCurrentRoute', to)

  // 處理頁面重整時 store 為空需重新取得使用者資料
  const userName = store.state.userManagement.userName
  if (!userName) await store.dispatch('userManagement/getUserInfo')

  // 確認 account 和 group 權限都符合
  const hasPermission = store.getters['userManagement/hasPermission']
  for (let i = 0; i < to.matched.length; i++) {
    if (!to.matched[i].meta || !to.matched[i].meta.permission || hasPermission(to.matched[i].meta.permission)) continue

    next(from.path)
    return Message({
      message: i18n.t('errorMessage.lackOfPermission'),
      type: 'error',
      duration: 3 * 1000
    })
  }
  next()
})

// 處理如果有版本更新結果前端拿不到對應 js 的處理
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)

  if (isChunkLoadFailed) {
    Message({
      message: i18n.t('errorMessage.versionUpdate'),
      type: 'error',
      duration: 3 * 1000
    })
    window.setTimeout(() => {
      window.location.reload()
    }, 2000)
  }
})

export default router
