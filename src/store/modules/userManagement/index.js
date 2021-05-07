import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    userId: null,
    userName: '',
    userEmail: '',
    accountList: [],
    groupList: [],
    permission: [],
    license: null,
    isAdmin: false
  },
  actions,
  mutations,
  getters
}
