import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    pinboardList: [],
    pinboardInfo: [],
    pinboardData: [],
    groupPinboardList: [],
    groupPinboardInfo: []
  },
  actions,
  mutations,
  getters
}
