import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    uploadFileList: [],
    showCreateDataSourceDialog: false,
    fileTypeChosen: false,
    fileLoaded: false
  },
  actions,
  mutations,
  getters
}
