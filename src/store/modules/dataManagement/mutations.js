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
  updateConnectionDataBase (state, data) {
    state.connectionInfo.database = data
  },
  updateConnectionUserName (state, data) {
    state.connectionInfo.username = data
  },
  updateConnectionPassword (state, data) {
    state.connectionInfo.password = data
  },
  clearConnectionInfo (state) {
    state.connectionInfo.database = null
    state.connectionInfo.username = null
    state.connectionInfo.password = null
  },
  updateFileUploadSuccess (state, data) {
    state.fileUploadSuccess = data
  }
}
