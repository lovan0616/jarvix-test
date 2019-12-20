export default {
  bookmarkTables (state) {
    return state.bookmarkTables.map(item => {
      return {
        id: item.id,
        name: item.primaryAlias
      }
    })
  },
  bookmarkTable (state) {
    return state.bookmarkTable
  },
  bookmarkTableDataMeta (state) {
    if (state.bookmarkTableData) return state.bookmarkTableData.meta
  },
  bookmarkTableDataDataset (state) {
    if (state.bookmarkTableData) {
      return {
        ...state.bookmarkTableData,
        index: [...Array(state.bookmarkTableData.data.length)].map((x, i) => i)
      }
    }
  },
  bookmarkTableId (state) {
    if (state.bookmarkTable) return state.bookmarkTable.id
  },
  bookmarkTableData (state) {
    return state.bookmarkTableData
  }
}
