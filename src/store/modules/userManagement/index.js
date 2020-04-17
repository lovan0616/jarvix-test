import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    userName: '',
    accountList: [],
    accountPermission: [],
    groupList: [],
    groupPermission: []
  },
  actions,
  mutations,
  getters
}
