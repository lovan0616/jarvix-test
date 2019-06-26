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
  updateFileLoaded (state, data) {
    state.fileLoaded = data
  },
  updateCurrentUploadInfo (state, data) {
    state.currentUploadInfo = data
  },
  updateCurrentBookmarkInfo (state, data) {
    state.currentBookmarkInfo = data
  },
  clearCurrentUploadInfo (state) {
    state.currentUploadInfo.bookmarkId = null
    state.currentUploadInfo.storageId = null
    state.currentUploadInfo.type = null
    state.currentUploadInfo.name = null
  },
  updateConnectionStatus (state, data) {
    state.connectionStatus = data
  },
  updateConnectionType (state, data) {
    state.connectionInfo.connection_type = data
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
    state.connectionInfo.connection_type = null
    state.connectionInfo.database = null
    state.connectionInfo.username = null
    state.connectionInfo.password = null
  }
}
