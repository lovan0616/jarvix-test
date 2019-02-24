export default {
  bookmarkTables (state) {
    return state.bookmarkTables
  },
  bookmarkTable (state) {
    return state.bookmarkTable
  },
  bookmarkTableId (state) {
    if (state.bookmarkTable) return state.bookmarkTable.id
    else return undefined
  },
  bookmarkTableData (state) {
    return state.bookmarkTableData
  }
}
