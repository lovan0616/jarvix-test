import * as types from './mutation_type'
export default {
  [types.SET_BOOKMARK_TABLES] (state, tables) {
    state.bookmarkTables = tables || []
  },
  [types.SET_BOOKMARK_TABLE] (state, table) {
    state.bookmarkTable = table || undefined
  },
  [types.SET_BOOKMARK_TABLE_DATA] (state, data) {
    state.bookmarkTableData = data || undefined
  }
}
