import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    bookmark: undefined,
    bookmarks: [],
    suggestions: []
  },
  actions,
  mutations,
  getters
}
