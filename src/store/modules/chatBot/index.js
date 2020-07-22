import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    conversationList: [],
    isAnalyzing: false,
    isUseAlgorithm: false,
    doDrillDown: false,
    doClickCorrelation: false
  },
  actions,
  mutations,
  getters
}
