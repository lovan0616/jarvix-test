import Vue from 'vue'
import Vuex from 'vuex'
import scheduleSetting from './modules/scheduleSetting'
import simulation from './modules/simulation'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    scheduleSetting,
    simulation
  }
})
