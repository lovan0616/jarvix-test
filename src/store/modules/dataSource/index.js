import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    dataSourceList: [],
    dataSourceId: null,
    dataSourceCloumnInfoList: [],
    dataSourceDataValueList: [],
    appQuestion: null,
    currentQuestionInfo: null,
    currentQuestionId: null,
    drillDownQuestionId: null,
    historyQuestionList: [],
    filterList: []
  },
  actions,
  mutations,
  getters
}
