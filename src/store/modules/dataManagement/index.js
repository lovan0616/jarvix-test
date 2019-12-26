import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    // 在資料表清單時，提供資料表上傳使用
    currentDataSourceInfo: null,
    currentUploadInfo: {
      dataSourceId: null,
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
    connectionStatus: null,
    // 設 tabe join
    showSetTableJoin: false,
    // 為了讓資料清單頁面可以重新刷新資料
    fileUploadSuccess: false,
    fileCountLimit: 1
  },
  actions,
  mutations,
  getters
}
