import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    showCreateFlowDialog: false,
    // 新增 model 後觸發列表更新
    flowUploadSuccess: false,
    currentFlowInfo: null,
    currentUploadFlowInfo: {
      name: '',
      modelId: null,
      sourceDataframeId: null,
      targetDataframeName: null,
      triggerType: 'AUTOMATIC',
      ioArgs: {}
    }
  },
  actions,
  mutations,
  getters
}
