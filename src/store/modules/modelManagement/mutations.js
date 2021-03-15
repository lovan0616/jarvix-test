
export default {
  updateShowCreateModelDialog (state, data) {
    state.showCreateModelDialog = data
  },
  updateUploadModelList (state, data) {
    state.uploadModelList = data
  },
  updateUploadFileTabDetail (state, data) {
    // this.$set(state.uploadModelList[data.index], 'tabDetail', data.tabDetail)
    state.uploadModelList[data.index].tabDetail = data.tabDetail
  },
  updateUploadModelStatus (state, data) {
    const {index, status, ...fileInfo} = data
    state.uploadModelList[index].status = status
    // 預設選第一個 tab
    if (fileInfo.tabDetails.length > 0) fileInfo.tabDetail = fileInfo.tabDetails[0]
    state.uploadModelList[index] = {...state.uploadModelList[index], ...fileInfo}
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
  setModelId (state, data) {
    state.currentModelId = data
  },
  setModelInfo (state, data) {
    state.currentModelInfo = data
  }
}
