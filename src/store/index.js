import Vue from 'vue'
import Vuex from 'vuex'
import bookmark from './modules/bookmark'
import previewBookmark from './modules/previewBookmark'
import pinboard from './modules/pinboard'
import dataManagement from './modules/dataManagement'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    bookmark,
    previewBookmark,
    pinboard,
    dataManagement
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
