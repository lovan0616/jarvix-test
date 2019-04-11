import * as types from './mutation_type'
import co from 'co'
import { getBookmarkTablesById, getBookmarkTableDataById } from '@/API/Bookmark'

export default {
  init ({ commit, dispatch, state }) {
    return co(function* () {
      yield dispatch('getBookmarkTables')
      yield dispatch('changeBookmarkTableByIndex', 0)
      return Promise.resolve(state)
    })
  },
  getBookmarkTables ({ commit, state, rootState }) {
    if (rootState.bookmark.bookmark === undefined) return Promise.reject(new Error('bookmark not set yet'))
    const bookmarkId = rootState.bookmark.bookmark.id
    return getBookmarkTablesById(bookmarkId).then(res => {
      commit(types.SET_BOOKMARK_TABLES, res)
    })
  },
  changeBookmarkTableByIndex ({ dispatch, state }, index) {
    return co(function* () {
      yield dispatch('setBookmarkTableByIndex', index)
      yield dispatch('getBookmarkTableData')
      return Promise.resolve(state)
    })
  },
  changeBookmarkTableById ({ dispatch, state }, id) {
    return co(function* () {
      yield dispatch('setBookmarkTableById', id)
      yield dispatch('getBookmarkTableData')
      return Promise.resolve(state)
    })
  },
  setBookmarkTableByIndex ({ commit, state }, index) {
    if (!state.bookmarkTables[index]) return
    commit(types.SET_BOOKMARK_TABLE, state.bookmarkTables[index])
  },
  setBookmarkTableById ({ commit, state }, id) {
    const bookmarkTable = state.bookmarkTables.find(item => item.id === id)
    if (!bookmarkTable) return
    commit(types.SET_BOOKMARK_TABLE, bookmarkTable)
  },
  getBookmarkTableData ({ commit, state, rootState }) {
    if (rootState.bookmark.bookmark === undefined) return Promise.reject(new Error('bookmark not set yet'))
    if (state.bookmarkTable === undefined) return Promise.reject(new Error('bookmarkTable not set yet'))
    const bookmarkId = rootState.bookmark.bookmark.id
    const bookmarkTableId = state.bookmarkTable.id
    return getBookmarkTableDataById(bookmarkId, bookmarkTableId).then(res => {
      commit(types.SET_BOOKMARK_TABLE_DATA, res)
    })
  }
}
