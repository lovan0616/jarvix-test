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
    dataFrameAdvanceSetting
  },
  state: {
    isShowFullSideNav: false,
    isAppLoading: false
  },
  mutations: {
    updateSideNavStatus(state, data) {
      state.isShowFullSideNav = data
    },
    updateAppLoadingStatus(state, data) {
      state.isAppLoading = data
    }
  }
})
