import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    showCreateModelDialog: false,
    currentModelId: null,
    currentModelInfo: {
      isUsed: false
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
