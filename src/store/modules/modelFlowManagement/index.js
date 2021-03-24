import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    showCreateFlowDialog: false,
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
