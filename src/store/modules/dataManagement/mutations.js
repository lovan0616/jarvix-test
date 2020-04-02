export default {
  updateUploadFileList (state, data) {
    state.uploadFileList = data
  },
  removeUploadFile (state, data) {
    state.uploadFileList.splice(data, 1)
  },
  updateShowCreateDataSourceDialog (state, data) {
    state.showCreateDataSourceDialog = data
  },
  updateCurrentUploadInfo (state, data) {
    state.currentUploadInfo = data
  },
  updateCurrentUploadDataType (state, data) {
    state.currentUploadInfo.type = data
  },
  updateCurrentUploadDataSourceName (state, data) {
    state.currentUploadInfo.name = data
  },
  updateCurrentUploadDataSourceId (state, data) {
    state.currentUploadInfo.dataSourceId = data
  },
  clearCurrentUploadInfo (state) {
    state.currentUploadInfo.dataSourceId = null
    state.currentUploadInfo.type = null
    state.currentUploadInfo.name = null
  },
  updateFileUploadSuccess (state, data) {
    state.fileUploadSuccess = data
  }
}
