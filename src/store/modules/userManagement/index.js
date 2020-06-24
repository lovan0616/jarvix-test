import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    userId: null,
    userName: '',
    accountList: [],
    groupList: [],
    permission: [],
    license: null
  },
  actions,
  mutations,
  getters
}
