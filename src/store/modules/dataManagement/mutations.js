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
  updateFileTypeChosen (state, data) {
    state.fileTypeChosen = data
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
  }
}
