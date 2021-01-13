export default {
  updateTableDataCSVDownloadList (state, data) {
    state.tableDataCSVDownloadList.push(data)
  },
  updateDisplayFactorIndex (state, data) {
    state.displayFactorIndex = data
  },
  updateCurrentResultId (state, data) {
    state.currentResultId = data
  },
  updateCurrentResultInfo (state, data) {
    state.currentResultInfo = data
  },
  updateIsModelResult (state, data) {
    state.isModelResult = data
  }
}
