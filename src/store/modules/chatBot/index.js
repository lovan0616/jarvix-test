import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    chatBotId: null,
    conversationList: [],
    isAnalyzing: false
  },
  actions,
  mutations,
  getters
}
