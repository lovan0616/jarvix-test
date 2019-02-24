import * as types from './mutation_type'
import co from 'co'
import axios from 'axios'
import { handleByStatus } from '../../common/helper'
const rootUrl = window.env.API_ROOT_URL

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
    return axios.get(`${rootUrl}api/bookmarks/${bookmarkId}/tables`).then(res => {
      return handleByStatus({
        handlers: {
          200: function () {
            commit(types.SET_BOOKMARK_TABLES, res.data.data)
            return res.data.data
          }
        },
        status: res.status,
        defaultValue: state.bookmarkTables
      })
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
    return axios.get(`${rootUrl}api/bookmarks/${bookmarkId}/tables/${bookmarkTableId}`).then(res => {
      return handleByStatus({
        handlers: {
          200: function () {
            commit(types.SET_BOOKMARK_TABLE_DATA, res.data.data)
            return res.data.data
          }
        },
        status: res.status,
        defaultValue: state.bookmarkTableData
      })
    })
  }
}
