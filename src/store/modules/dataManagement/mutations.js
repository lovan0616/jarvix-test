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
  }
}
