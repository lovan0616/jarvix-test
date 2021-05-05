
export default {
  updateShowCreateFlowDialog (state, data) {
    state.showCreateFlowDialog = data
  },
  updateCurrentUploadFlowInfo (state, data) {
    state.currentUploadFlowInfo = data
  },
  updateFlowUploadSuccess (state, data) {
    state.flowUploadSuccess = data
  },
  updateCurrentFlowInfo (state, data) {
    state.currentFlowInfo = data
  }
}