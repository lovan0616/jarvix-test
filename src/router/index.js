import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '@/components/layout/AppLayout'
import store from '../store'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'
const groupId = store.getters['userManagement/getCurrentGroupId'] || 82

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
        // meta 使用 accountPermission & groupPermission 指定路由權限
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
                    isMainNav: true
                  }
                },
                {
                  path: 'user-management',
                  component: () => import('@/pages/userManagement/Index'),
                  name: 'AccountUserManagement',
                  meta: {
                    layers: ['account', 'account-management'],
                    accountPermission: ['account_update_user']
                  }
                },
                {
                  path: 'group-management',
                  component: () => import('@/pages/accountManagement/GroupManagement'),
                  name: 'AccountGroupManagement',
                  meta: {
                    layers: ['account', 'account-management'],
                    accountPermission: ['account_update_user']
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
            },
            {
              path: 'user-management',
              component: () => import('@/pages/groupUserManagement/Index'),
              children: [
                {
                  path: '/',
                  redirect: { name: 'GroupUserList', params: {group_id: groupId} },
                  name: 'GroupUserManagement',
                  meta: {
                    isMainNav: true
                  }
                },
                {
                  path: ':group_id',
                  component: () => import('@/pages/groupUserManagement/GroupUserList'),
                  name: 'GroupUserList',
                  meta: {
                    layers: ['group', 'user-management'],
                    accountPermission: ['account_update_user']
                  }
                },
                {
                  path: ':group_id/create',
                  component: () => import('@/pages/groupUserManagement/GroupCreateUser'),
                  name: 'GroupCreateUser',
                  meta: {
                    layers: ['group', 'user-management'],
                    accountPermission: ['account_update_user'],
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

  // 處理頁面重整時 store 為空需重新取得使用者資料
  const userName = store.state.userManagement.userName
  try {
    if (!userName) await store.dispatch('userManagement/getUserInfo')
  } catch (error) {
    // Debug 使用
    console.log(error)
  }

  // 確認 account 和 group 權限都符合
  const hasAccountPermission = store.getters['userManagement/hasAccountPermission']
  const hasGroupPermission = store.getters['userManagement/hasGroupPermission']
  for (let i = 0; i < to.matched.length; i++) {
    if (!to.matched[i].meta) continue

    let passAccountPermission
    let passGroupPermission

    if (to.matched[i].meta.accountPermission) {
      passAccountPermission = to.matched[i].meta.accountPermission.every(code => hasAccountPermission(code))
    } else {
      passAccountPermission = true
    }

    if (to.matched[i].meta.groupPermission) {
      passGroupPermission = to.matched[i].meta.groupPermission.every(code => hasGroupPermission(code))
    } else {
      passGroupPermission = true
    }

    if (passAccountPermission && passGroupPermission) continue

    next(from.path)
    return Message({
      message: i18n.t('errorMessage.lackOfPermission'),
      type: 'error',
      duration: 3 * 1000
    })
  }
  next()
})

export default router
