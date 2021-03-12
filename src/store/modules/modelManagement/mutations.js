
export default {
  updateShowCreateModelDialog (state, data) {
    state.showCreateModelDialog = data
  },
  updateCurrentUploadInfo (state, data) {
    state.currentUploadInfo = data
  },
  clearCurrentUploadInfo (state) {
    state.currentUploadInfo.dataSourceId = null
    state.currentUploadInfo.type = null
    state.currentUploadInfo.name = null
    state.currentUploadInfo.db = null
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
  updateScriptName (state, data) {
    state.currentUploadScriptName = data
  },
  updateCurrentUploadScriptInfo (state, data) {
    state.currentUploadScriptInfo = data
  },
  clearCurrentUploadScriptInfo(state) {
    state.currentUploadScriptInfo = {
      scriptId: null,
      dataframeId: null,
      type: null,
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
