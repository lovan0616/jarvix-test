import Vue from 'vue'
import Vuex from 'vuex'
import bookmark from './modules/bookmark'
import previewBookmark from './modules/previewBookmark'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    bookmark,
    previewBookmark
  }
})
