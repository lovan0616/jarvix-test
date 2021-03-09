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
      name: null,
      db: null
    },
    uploadFileList: [],
    showCreateDataSourceDialog: false,
    // 為了讓資料清單頁面可以重新刷新資料
    fileUploadSuccess: false,
    fileCountLimit: 10,
    // 當前預處理的 list
    etlTableList: [],
    datetimePatterns: [],
    currentTableIndex: 0,
    currentColumnIndex: null,
    currentUploadScriptName: null,
    currentUploadScriptInfo: {
      scriptId: null,
      dataframeId: null,
      type: null,
      ioArgs: {}
    },
    currentModelId: null,
    currentModelInfo: {
      isUsed: false
    }
  },
  actions,
  mutations,
  getters
}
