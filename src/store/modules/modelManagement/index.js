import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    showCreateModelDialog: false,
    currentModelInfo: {
      modelId: null,
      name: '',
      inUsed: false
    },
    uploadModelList: [],
    currentUploadModelName: null,
    currentUploadModelInfo: {
      modelId: null,
      ioArgs: {}
    }
  },
  actions,
  mutations,
  getters
}
