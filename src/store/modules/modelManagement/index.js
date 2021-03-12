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
    currentUploadInfo: {
      dataSourceId: null,
      type: null,
      name: null,
      db: null
    },
    uploadModelList: [],
    currentUploadScriptName: null,
    currentUploadScriptInfo: {
      scriptId: null,
      dataframeId: null,
      type: null,
      ioArgs: {}
    }
  },
  actions,
  mutations,
  getters
}
