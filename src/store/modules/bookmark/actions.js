import * as types from './mutation_type'
import co from 'co'
import router from '../../../router'
import { getBookmarks, getSuggestions, getQuickstarts } from '@/API/Bookmark'

export default {
  init ({ commit, dispatch, state }) {
    if (state.isInit) return Promise.resolve(state)
    return co(function* () {
      yield dispatch('getBookmarks')
      yield dispatch('getSuggestions')
      yield dispatch('getQuickstarts')
      commit(types.SET_ISINIT, true)
      return Promise.resolve(state)
    })
  },
  changeBookmarkById ({ dispatch, state }, bookmarkId) {
    return co(function* () {
      yield dispatch('getSuggestions')
      yield dispatch('getQuickstarts')
      return Promise.resolve(state)
    })
  },
  getBookmarks ({ commit }) {
    return getBookmarks().then(res => {
      commit(types.SET_BOOKMARKS, res)
      commit(types.SET_BOOKMARK, res[0])
    })
  },
  getSuggestions ({ commit, state }) {
    return getSuggestions(state.bookmark.id).then(res => {
      commit(types.SET_SUGGESTIONS, res)
    })
  },
  getQuickstarts ({ commit, state }) {
    return getQuickstarts().then(res => {
      commit(types.SET_QUICKSTART_RESULT, res)
    })
  },
  updateResultRouter ({commit, getters}, data) {
    router.push({
      name: 'PageResult',
      query: {
        question: data || getters.appQuestion,
        '_': new Date().getTime(),
        bookmarkId: getters.bookmarkId
      }
    })
  }
}
