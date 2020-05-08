import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    userName: '',
    accountList: [],
    groupList: [],
    permission: []
  },
  actions,
  mutations,
  getters
}
