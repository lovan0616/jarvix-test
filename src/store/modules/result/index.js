import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    tableDataCSVDownloadMaximumCount: 4,
    tableDataCSVDownloadList: [],
    displayFactorIndex: 0,
    currentResultId: null,
    currentResultInfo: null,
    isModelResult: false
  },
  mutations
}
