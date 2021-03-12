import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from '@/components/layout/AppLayout'
import store from '../store'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'
import ScheduleRouter from '@/schedule/router'

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
          beforeEnter: (to, from, next) => {
            const accountId = store.getters['userManagement/getCurrentAccountId']
            const groupId = store.getters['userManagement/getCurrentGroupId']
            if (!accountId) {
              Message({
                message: i18n.t('errorMessage.lackOfPermission'),
                type: 'error',
                duration: 3 * 1000,
                showClose: true
              })
              return next({name: 'PageLogin'})
            }
            if (!groupId) return next({ name: 'PageGrouplessGuidance', params: { 'account_id': accountId } })
            next({ name: 'PageIndex', params: { 'account_id': accountId, 'group_id': groupId } })
          }
        },
        {
          path: 'account/:account_id',
          component: () => import('@/pages/account/Index'),
          children: [
            // 該頁面名稱如果為側邊導覽列第一層 meta 需設定 isMainNav 為 true
            // 如果第一層下有子功能列表 isMainNav 設定在子層 redirect 模組
            // meta 中 layer 用來設定從 management 模組往下到自己的路徑
            // 當前頁面側邊導覽列第一層要顯示哪個模組，layer 就寫到那個模組為止
            // meta 使用 permission 指定路由權限
            {
              path: 'management',
              component: () => import('@/pages/management/Index'),
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
                  path: 'update-license',
                  component: () => import('@/pages/updateLicense/Index'),
                  name: 'UpdateLicense',
                  meta: {
                    layers: ['account/:account_id', 'management'],
                    permission: ['account_create_group']
                  }
                },
                {
                  path: 'info',
                  component: () => import('@/pages/accountInformation/Index'),
                  name: 'AccountInformation',
                  meta: {
                    layers: ['account/:account_id', 'management'],
                    permission: ['account_read_user']
                  }
                },
                {
                  path: 'users',
                  component: () => import('@/pages/userManagement/Index'),
                  name: 'AccountUserManagement',
                  meta: {
                    layers: ['account/:account_id', 'management'],
                    permission: ['account_update_user']
                  }
                },
                {
                  path: 'groups',
                  component: () => import('@/pages/accountGroupManagement/AccountGroupList'),
                  name: 'AccountGroupManagement',
                  meta: {
                    layers: ['account/:account_id', 'management'],
                    permission: ['account_read_group']
                  }
                },
                {
                  path: 'groups/create',
                  component: () => import('@/pages/accountGroupManagement/EditAccountGroup'),
                  name: 'CreateAccountGroup',
                  meta: {
                    layers: ['account/:account_id', 'management'],
                    accountPermission: ['account_create_group'],
                    isHiddenNav: true
                  }
                },
                {
                  path: 'groups/:id/edit',
                  component: () => import('@/pages/accountGroupManagement/EditAccountGroup'),
                  name: 'EditAccountGroup',
                  meta: {
                    layers: ['account/:account_id', 'management'],
                    accountPermission: ['account_update_group'],
                    isHiddenNav: true
                  }
                },
                {
                  path: 'function-description',
                  name: 'FunctionDescription',
                  component: () => import('@/pages/functionDescription/Index'),
                  meta: {
                    isMainNav: true,
                    layers: ['account/:account_id', 'management', 'function-description'],
                    icon: 'description'
                  }
                },
              ],
            },
            {
              path: 'pinboard',
              component: () => import('@/pages/pinboard/Index'),
              children: [
                {
                  path: '/',
                  name: 'PersonalPagePinboardList',
                  component: () => import('@/pages/pinboard/PinboardList')
                },
                {
                  path: ':id',
                  name: 'PersonalPagePinboard',
                  component: () => import('@/pages/pinboard/Pinboard')
                }
              ]
            },
            {
              path: 'group',
              name: 'group',
              component: () => import('@/pages/group/Index'),
              children: [
                {
                  path: 'groupless-guidance',
                  name: 'PageGrouplessGuidance',
                  component: () => import('@/components/layout/GrouplessLayout'),
                },
                {
                  path: ':group_id',
                  component: () => import('@/pages/group/Index'),
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
                      path: 'pinboard',
                      component: () => import('@/pages/pinboard/Index'),
                      children: [
                        {
                          path: '/',
                          name: 'ProjectPagePinboardList',
                          component: () => import('@/pages/pinboard/PinboardList')
                        },
                        {
                          path: ':id',
                          name: 'ProjectPagePinboard',
                          component: () => import('@/pages/pinboard/Pinboard')
                        }
                      ]
                    },
                    {
                      path: 'war-room',
                      component: () => import('@/pages/warRoom/Index'),
                      children: [
                        {
                          path: '/',
                          name: 'WarRoomList',
                          component: () => import('@/pages/warRoom/WarRoomList')
                        },
                        {
                          path: ':war_room_id',
                          name: 'WarRoom',
                          component: () => import('@/pages/warRoom/WarRoom')
                        }
                      ]
                    },
                    {
                      path: 'mini-apps',
                      component: () => import('@/pages/miniApp/Index'),
                      children: [
                        {
                          path: '/',
                          name: 'MiniAppList',
                          component: () => import('@/pages/miniApp/miniAppList/Index')
                        },
                        {
                          path: ':mini_app_id',
                          name: 'MiniApp',
                          component: () => import('@/pages/miniApp/miniApp/Index'),
                          meta: {
                            isHeaderHidden: true,
                            isSideNavHidden: true
                          }
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
                    {
                      path: 'datasource',
                      component: () => import('@/pages/management/Index'),
                      children: [
                        {
                          path: '/',
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
                              path: '/',
                              name: 'DataSourceList',
                              component: () => import('@/pages/dataManagement/DataSourceList'),
                              meta: {
                                layers: ['account/:account_id', 'group', ':group_id', 'datasource', '/'],
                                permission: ['group_read_user', 'group_read_data']
                              }
                            }
                          ]
                        },
                        {
                          path: ':id',
                          component: () => import('@/pages/dataManagement/Index'),
                          children: [
                            {
                              path: '/',
                              redirect: to => ({ name: 'DataFileList' }),
                              name: 'DataFileManagement',
                              meta: {
                                isMainNav: true,
                                icon: 'database'
                              }
                            },
                            {
                              path: '/',
                              name: 'DataFileList',
                              component: () => import('@/pages/dataManagement/DataFileList'),
                              meta: {
                                layers: ['account/:account_id', 'group', ':group_id', 'datasource', ':id'],
                                permission: ['group_read_user', 'group_read_data']
                              }
                            }
                          ]
                        },
                      ]
                    },
                    {
                      path: 'users',
                      component: () => import('@/pages/management/Index'),
                      beforeEnter: (to, from, next) => {
                        // 個人版 不能進入成員管理頁面
                        store.state.userManagement.license.maxUser !== 1 ? next() : next(from)
                      },
                      children: [
                        {
                          path: '/',
                          redirect: to => ({ name: 'GroupUserList' }),
                          name: 'GroupUserManagement',
                          meta: {
                            isMainNav: true,
                            icon: 'userManage'
                          }
                        },
                        {
                          path: '/',
                          component: () => import('@/pages/groupUserManagement/GroupUserList'),
                          name: 'GroupUserList',
                          meta: {
                            layers: ['account/:account_id', 'group', ':group_id', 'users'],
                            permission: ['group_read_user']
                          }
                        },
                        {
                          path: 'create',
                          component: () => import('@/pages/groupUserManagement/GroupCreateUser'),
                          name: 'GroupCreateUser',
                          meta: {
                            layers: ['account/:account_id', 'group', ':group_id', 'users'],
                            permission: ['account_create_group_user', 'group_create_user'],
                            isHiddenNav: true
                          }
                        }
                      ]
                    },
                    {
                      path: 'model',
                      component: () => import('@/pages/management/Index'),
                      children: [
                        {
                          path: '/',
                          component: () => import('@/pages/modelManagement/Index'),
                          children: [
                            {
                              path: '/',
                              redirect: { name: 'ModelList' },
                              name: 'ModelManagement',
                              meta: {
                                isMainNav: true,
                                icon: 'algo'
                              }
                            },
                            {
                              path: '/',
                              name: 'ModelList',
                              component: () => import('@/pages/modelManagement/ModelList'),
                              meta: {
                                layers: ['account/:account_id', 'group', ':group_id', 'model', '/']
                              }
                            }
                          ]
                        },
                        {
                          path: ':model_id',
                          component: () => import('@/pages/modelManagement/Index'),
                          // TODO: pretend used model
                          beforeEnter: (to, from, next) => {
                            const modelId = to.params.model_id
                            store.commit('modelManagement/setModelId', modelId)
                            modelId % 2 ? next() : next(from)
                          },
                          children: [
                            {
                              path: '/',
                              redirect: { name: 'ModelDetail' },
                              name: 'ModelSetting',
                              meta: {
                                isMainNav: true,
                                icon: 'filter-setting'
                              }
                            },
                            {
                              path: 'detail',
                              name: 'ModelDetail',
                              component: () => import('@/pages/modelManagement/ModelDetail'),
                              meta: {
                                layers: ['account/:account_id', 'group', ':group_id', 'model', ':model_id']
                              }
                            },
                            {
                              path: 're-upload',
                              name: 'ReUploadFile',
                              component: () => import('@/pages/modelManagement/ReUploadFile'),
                              meta: {
                                layers: ['account/:account_id', 'group', ':group_id', 'model', ':model_id']
                              }
                            },
                            {
                              path: 'config-setting',
                              name: 'ConfigSetting',
                              component: () => import('@/pages/modelManagement/ConfigSetting'),
                              meta: {
                                layers: ['account/:account_id', 'group', ':group_id', 'model', ':model_id'],
                                isLocked: (store) => store.state.modelManagement.currentModelInfo.isUsed
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
              ]
            },
            ...ScheduleRouter.options.routes
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
      path: '/forget-password',
      name: 'PageForgetPassword',
      component: () => import('@/pages/forgetPassword/Index')
    },
    {
      path: '/reset-password',
      name: 'PageResetPassword',
      component: () => import('@/pages/resetPassword/Index')
    },
    {
      path: '/admin',
      name: 'PageAdmin',
      component: () => import('@/pages/admin/Index')
    },
    {
      path: '/signup',
      name: 'PageSignup',
      component: () => import('@/pages/signup/Index')
    },
    {
      path: '/sis-setting',
      name: 'SisSetting',
      component: () => import('@/pages/sisSetting/Index')
    },
    {
      path: '/share-result/:id',
      name: 'ShareResult',
      component: () => import('@/pages/result/SingleResult')
    },
    {
      path: '/war-room',
      name: 'WarRoomLivePage',
      component: () => import('@/pages/warRoom/ActiveWarRoom')
    },
    {
      path: '/war-room/:war_room_id',
      name: 'WarRoomPreviewPage',
      component: () => import('@/pages/warRoom/ActiveWarRoom')
    },
    {
      path: '/oe-exhibition',
      name: 'OeExhibition',
      component: () => import('@/pages/oeExhibition/Index')
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
  const pathWithoutAuth = ['PageLogin', 'PageSignup', 'WarRoomLivePage', 'PageForgetPassword', 'PageResetPassword', 'PageAdmin']
  if (pathWithoutAuth.includes(to.name)) {
    next()
    return
  }

  // 將欲前往的頁面存取下來，避免使用者 token 失效或無權限需要被重新登入
  store.commit('setting/setCurrentRoute', to)

  // 處理頁面重整時 store 為空需重新取得使用者資料
  const userName = store.state.userManagement.userName
  if (!userName) {
    try {
      await store.dispatch('userManagement/getUserInfo')
    } catch (error) {
      return next({ name: 'PageLogin' })
    }

    // 處理路由的 group 和 account id 與 store 中 default 不相同時：切換成路由的 id
    const { account_id: paramsAccountId, group_id: paramsGroupId } = to.params
    const currentAccountId = Number(store.getters['userManagement/getCurrentAccountId'])
    if ((paramsAccountId) && (Number(paramsAccountId) !== currentAccountId)) {
      try {
        await store.dispatch('userManagement/switchAccountById', {
          accountId: paramsAccountId,
          defaultGroupId: paramsGroupId,
          ...(to.query.dataSourceId && {
            dataSourceId: parseInt(to.query.dataSourceId),
            dataFrameId: to.query.dataFrameId === 'all' ? 'all' : parseInt(to.query.dataFrameId)
          })
        })
      } catch (error) {
        // 當想去的 account 人數已達上限
        // const groupList = store.state.userManagement.groupList
        // let defaultGroup = null
        // if (groupList && groupList.length) {
        //   defaultGroup = groupList.find(group => group.isDefault)
        // }
        // if (defaultGroup) {
        //   next({
        //     name: 'PageIndex', 
        //     params: { 
        //       account_id: currentAccountId,
        //       group_id: currentGroupId
        //     }
        //   })
        // } else {
        //   next({ 
        //     name: 'PageGrouplessGuidance',
        //     params: { 
        //       account_id: currentAccountId 
        //     }
        //   })
        // }
        return
      }
    }
    
    const currentGroupId = Number(store.getters['userManagement/getCurrentGroupId'])
    if (paramsGroupId && (Number(paramsGroupId) !== currentGroupId)) {
      await store.dispatch('userManagement/switchGroupById', {
        accountId: paramsAccountId,
        groupId: paramsGroupId,
        ...(to.query.dataSourceId && {
          dataSourceId: parseInt(to.query.dataSourceId),
          dataFrameId: to.query.dataFrameId === 'all' ? 'all' : parseInt(to.query.dataFrameId)
        })
      })
    } else if (currentGroupId) {
      // 若使用者指定的群組和 default 相同，不切換，但仍需取得資料表
      // 若使用者不指定群組，但當前有 default group 時，仍需取得資料表
      await store.dispatch('dataSource/getDataSourceList', {
        dataSourceId: to.query.dataSourceId ? parseInt(to.query.dataSourceId) : null,
        dataFrameId: to.query.dataFrameId
          ? to.query.dataFrameId === 'all' ? 'all' : parseInt(to.query.dataFrameId)
          : null
      })
    }

    // 檢查是否為 group 層下的路由: 變免在 account 層 $router 物件中 params 帶有 group id
    const isGroupRoute = to.matched.some(route => route.name === 'group')
    return next({ 
      name: to.name,
      params: {
        ...to.params,
        account_id: paramsAccountId,
        ...(isGroupRoute && { group_id: paramsGroupId || currentGroupId })
      },
      query: to.query
    })
  }

  // 取得可以使用的 parser 語系
  if (!store.state.chatBot.parserLanguage) {
    await store.dispatch('chatBot/getParserList')
  }
  
  // 確認 account 和 group 權限都符合
  const hasPermission = store.getters['userManagement/hasPermission']
  for (let i = 0; i < to.matched.length; i++) {
    if (!to.matched[i].meta || !to.matched[i].meta.permission || hasPermission(to.matched[i].meta.permission)) continue

    next(from.path)
    return Message({
      message: i18n.t('errorMessage.lackOfPermission'),
      type: 'error',
      duration: 3 * 1000,
      showClose: true
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
      duration: 3 * 1000,
      showClose: true
    })
    window.setTimeout(() => {
      window.location.reload()
    }, 2000)
  }
})

export default router
