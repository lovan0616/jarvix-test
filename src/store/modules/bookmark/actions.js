import * as types from './mutation_type'
import co from 'co'
import axios from 'axios'
const rootUrl = window.env.API_ROOT_URL
function handleByStatus ({ handlers, status, defaultValue }) {
  const handler = handlers[status]
  return handler ? handler() || defaultValue : defaultValue
}

export default {
  init ({ commit, dispatch, state }) {
    if (state.isInit) return Promise.resolve()
    return co(function* () {
      yield [
        dispatch('getBookmark'),
        dispatch('getBookmarks'),
        dispatch('getSuggestions')
      ]
      commit(types.SET_ISINIT, true)
      return yield Promise.resolve()
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
  }
}
