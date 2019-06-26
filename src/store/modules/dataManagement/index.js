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
    // 連線資訊
    connectionInfo: {
      connection_type: null,
      database: null,
      username: null,
      password: null
    },
    uploadFileList: [],
    showCreateDataSourceDialog: false,
    // 檔案已上傳
    fileLoaded: false,
    // 資料庫連結狀態
    connectionStatus: null
  },
  actions,
  mutations,
  getters
}
