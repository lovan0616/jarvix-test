import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    bookmarkTables: [],
    bookmarkTable: undefined,
    bookmarkTableData: undefined
  },
  actions,
  mutations,
  getters
}
