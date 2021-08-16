import Vue from 'vue'
import Vuex from 'vuex'
import dataSource from './modules/dataSource'
import pinboard from './modules/pinboard'
import dataManagement from './modules/dataManagement'
import modelManagement from './modules/modelManagement'
import modelFlowManagement from './modules/modelFlowManagement'
import chatBot from './modules/chatBot'
import result from './modules/result'
import setting from './modules/setting'
import userManagement from './modules/userManagement'
import algorithm from './modules/algorithm'
import validation from './modules/validation'
import previewDataSource from './modules/previewDataSource'
import dataFrameAdvanceSetting from './modules/dataFrameAdvanceSetting'
import scheduleSetting from '@/schedule/store/modules/scheduleSetting'
import simulation from '@/schedule/store/modules/simulation'
import jobAdjustments from '@/schedule/store/modules/jobAdjustments'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    dataSource,
    pinboard,
    dataManagement,
    modelManagement,
    modelFlowManagement,
    chatBot,
    setting,
    userManagement,
    result,
    algorithm,
    validation,
    previewDataSource,
    scheduleSetting,
    simulation,
    jobAdjustments
  },
  state: {
    isShowAskHelper: false,
    isShowFullSideNav: false,
    isAppLoading: false,
    isRouteLoading: false
  },
  mutations: {
    updateAskHelperStatus (state, data) {
      state.isShowAskHelper = data
    },
    updateSideNavStatus (state, data) {
      state.isShowFullSideNav = data
    },
    updateAppLoadingStatus (state, data) {
      state.isAppLoading = data
    },
    updateRouteLoadingStatus (state, data) {
      state.isRouteLoading = data
    }
  }
})

store.registerModule('dataFrameAdvanceSetting', dataFrameAdvanceSetting)

export default store
