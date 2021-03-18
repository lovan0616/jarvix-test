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
      inUse: false
    },
    uploadModelList: [],
    // 新增 model 後觸發列表更新
    modelUploadSuccess: false,
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
