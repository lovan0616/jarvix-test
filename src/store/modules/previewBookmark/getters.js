export default {
  bookmarkTables (state) {
    return state.bookmarkTables
  },
  bookmarkTable (state) {
    return state.bookmarkTable
  },
  bookmarkTableDataMeta (state) {
    if (state.bookmarkTableData) return state.bookmarkTableData.meta
  },
  bookmarkTableDataDataset (state) {
    if (state.bookmarkTableData) return state.bookmarkTableData.dataset
  },
  bookmarkTableId (state) {
    if (state.bookmarkTable) return state.bookmarkTable.id
  },
  bookmarkTableData (state) {
    return state.bookmarkTableData
  }
}
