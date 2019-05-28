import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    // 在資料表清單時，提供資料表上傳使用
    currentBookmarkInfo: null,
    currentUploadInfo: {
      bookmarkId: null,
      storageId: null,
      type: null,
      name: null
    },
    uploadFileList: [],
    showCreateDataSourceDialog: false,
    fileTypeChosen: false,
    fileLoaded: false
  },
  actions,
  mutations,
  getters
}
