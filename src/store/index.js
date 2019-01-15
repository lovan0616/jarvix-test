import Vue from 'vue'
import Vuex from 'vuex'
import bookmark from './modules/bookmark'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    bookmark
  }
})
