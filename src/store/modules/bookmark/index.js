import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    bookmark: undefined,
    bookmarks: [],
    suggestions: {},
    quickstartNum: 3,
    quickstartResult: {},
    appQuestion: '',
    questionResult: null,
    // 歷史問題清單
    historyQuestionList: [],
    // 目前 result 頁面的狀態
    currentResultDisplayType: null
  },
  actions,
  mutations,
  getters
}
