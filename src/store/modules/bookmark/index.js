import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    bookmarkId: null,
    bookmarkList: [],
    suggestions: {},
    quickstartNum: 3,
    quickstartResult: {},
    appQuestion: '',
    // 歷史問題清單
    historyQuestionList: [],
    bookmarkCloumnInfoList: []
  },
  actions,
  mutations,
  getters
}
