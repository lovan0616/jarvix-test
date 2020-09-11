import Vue from 'vue'
import Vuex from 'vuex'
import dataSource from './modules/dataSource'
import pinboard from './modules/pinboard'
import dataManagement from './modules/dataManagement'
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

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dataSource,
    pinboard,
    dataManagement,
    chatBot,
    setting,
    userManagement,
    result,
    algorithm,
    validation,
    previewDataSource,
    dataFrameAdvanceSetting,
    scheduleSetting,
    simulation
  },
  state: {
    isShowAskHelper: false,
    isShowFullSideNav: false,
    isAppLoading: false
  },
  mutations: {
    updateAskHelperStatus (state, data) {
      state.isShowAskHelper = data
    },
    updateSideNavStatus(state, data) {
      state.isShowFullSideNav = data
    },
    updateAppLoadingStatus(state, data) {
      state.isAppLoading = data
    }
  }
})
