import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    uploadFileList: [],
    showCreateDataSourceDialog: false
  },
  actions,
  mutations,
  getters
}
