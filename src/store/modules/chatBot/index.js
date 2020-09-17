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
    doClickCorrelation: false,
    parserLanguage: null,
    parserLanguageList: [],
    hasBasicInfo: false,
    askCancelToken: null,
    copiedColumnName: null
  },
  actions,
  mutations,
  getters
}
