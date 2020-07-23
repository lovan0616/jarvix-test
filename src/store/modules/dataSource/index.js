import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    dataSourceList: [],
    dataSourceId: null,
    dataSourceColumnInfoList: [],
    dataSourceDataValueList: [],
    appQuestion: null,
    currentQuestionInfo: null,
    currentQuestionId: null,
    currentQuestionDataFrameId: null,
    historyQuestionList: [],
    filterList: [],
    dataFrameId: null,
    dataFrameList: []
  },
  actions,
  mutations,
  getters
}
