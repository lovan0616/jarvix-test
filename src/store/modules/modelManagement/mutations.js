
export default {
  updateShowCreateModelDialog (state, data) {
    state.showCreateModelDialog = data
  },
  updateUploadModelList (state, data) {
    state.uploadModelList = data
  },
  removeUploadModel (state, data) {
    state.uploadModelList.splice(data, 1)
  },
  updateModelName (state, data) {
    state.currentUploadModelName = data
  },
  updateCurrentUploadModelInfo (state, data) {
    state.currentUploadModelInfo = data
  },
  clearCurrentUploadModelInfo(state) {
    state.currentUploadModelInfo = {
      modelId: null,
      ioArgs: {}
    }
  },
  setModelInfo (state, data) {
    state.currentModelInfo = data
  }
}
