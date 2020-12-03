export default {
  updateTableDataCSVDownloadList (state, data) {
    state.tableDataCSVDownloadList.push(data)
  },
  updateDisplayFactorIndex (state, data) {
    state.displayFactorIndex = data
  },
  updateCurrentResultId (state, data) {
    state.currentResultId = data
  }
}
