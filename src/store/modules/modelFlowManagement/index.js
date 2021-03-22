import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    showCreateFlowDialog: false,
    currentFlowInfo: {
      FlowId: null,
      name: ''
    }
  },
  actions,
  mutations,
  getters
}
