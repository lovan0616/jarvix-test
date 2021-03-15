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
    currentUploadScriptName: null,
    currentUploadScriptInfo: {
      modelId: null,
      ioArgs: {}
    }
  },
  actions,
  mutations,
  getters
}
