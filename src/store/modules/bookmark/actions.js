import * as types from './mutation_type'
import co from 'co'
import axios from 'axios'
import { handleByStatus } from '../../common/helper'
const rootUrl = window.env.API_ROOT_URL

export default {
  init ({ commit, dispatch, state }) {
    if (state.isInit) return Promise.resolve(state)
    return co(function* () {
      yield dispatch('getBookmark')
      yield dispatch('getBookmarks')
      yield dispatch('getSuggestions')
      yield dispatch('getQuickstarts')
      commit(types.SET_ISINIT, true)
      return Promise.resolve(state)
    })
  },
  changeBookmarkById ({ dispatch, state }, bookmarkId) {
    return co(function* () {
      yield dispatch('setBookmarkById', bookmarkId)
      yield dispatch('getSuggestions')
      yield dispatch('getQuickstarts')
      return Promise.resolve(state)
    })
  },
  getBookmark ({ commit, state }) {
    return axios.get(`${rootUrl}api/bookmark`).then(res => {
      return handleByStatus({
        handlers: {
          200: function () {
            commit(types.SET_BOOKMARK, res.data.data)
            return res.data.data
          }
        },
        status: res.status,
        defaultValue: state.bookmark
      })
    })
  },
  setBookmarkById ({ commit, state }, bookmarkId) {
    return axios.put(`${rootUrl}api/bookmark`, {
      id: bookmarkId
    }).then(res => {
      return handleByStatus({
        handlers: {
          200: function () {
            commit(types.SET_BOOKMARK, res.data.data)
            return res.data.data
          }
        },
        status: res.status,
        defaultValue: state.bookmark
      })
    })
  },
  getBookmarks ({ commit, state }) {
    return axios.get(`${rootUrl}api/bookmarks`).then(res => {
      return handleByStatus({
        handlers: {
          200: function () {
            commit(types.SET_BOOKMARKS, res.data.data)
            return res.data.data
          }
        },
        status: res.status,
        defaultValue: state.bookmarks
      })
    })
  },
  getSuggestions ({ commit, state }) {
    return axios.get(`${rootUrl}api/suggestions`).then(res => {
      return handleByStatus({
        handlers: {
          200: function () {
            commit(types.SET_SUGGESTIONS, res.data.data)
            return res.data.data
          }
        },
        status: res.status,
        defaultValue: state.suggestions
      })
    })
  },
  getQuickstarts ({ commit, state }) {
    return axios.get(`${rootUrl}api/quickstarts`).then(res => {
      return handleByStatus({
        handlers: {
          200: function () {
            commit(types.SET_QUICKSTART_RESULT, res.data.data)
            return res.data.data
          }
        },
        status: res.status,
        defaultValue: state.quickstartResult
      })
    })
  }
}
