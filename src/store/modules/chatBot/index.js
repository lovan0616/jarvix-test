import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    conversationList: [],
    isAnalyzing: false,
    isUseAlgorithm: false
  },
  actions,
  mutations,
  getters
}
