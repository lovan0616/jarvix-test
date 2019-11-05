import Vue from 'vue'
import Vuex from 'vuex'
import dataSource from './modules/dataSource'
import bookmark from './modules/bookmark'
import previewBookmark from './modules/previewBookmark'
import pinboard from './modules/pinboard'
import dataManagement from './modules/dataManagement'
import chatBot from './modules/chatBot'
import profile from './modules/profile'
import userManagement from './modules/userManagement'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dataSource,
    bookmark,
    previewBookmark,
    pinboard,
    dataManagement,
    chatBot,
    profile,
    userManagement
  },
  state: {
    isShowChatRoom: false
  },
  mutations: {
    updateChatRoomStatus (state, data) {
      state.isShowChatRoom = data
    }
  }
})
