import * as types from './mutation_type'
import co from 'co'
import router from '../../../router'
import { getBookmark, setBookmarkById, getBookmarks, getSuggestions, getQuickstarts } from '@/API/Bookmark'
// import { handleByStatus } from '../../common/helper'

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
    // test
    return getBookmark().then(res => {
      commit(types.SET_BOOKMARK, res)
    }).catch(error => {
      console.log(error)
    })
  },
  setBookmarkById ({ commit, state }, bookmarkId) {
    return setBookmarkById({
      id: bookmarkId
    }).then(res => {
      commit(types.SET_BOOKMARK, res)
    })
  },
  getBookmarks ({ commit, state }) {
    return getBookmarks().then(res => {
      commit(types.SET_BOOKMARKS, res)
    })
  },
  getSuggestions ({ commit, state }) {
    return getSuggestions().then(res => {
      commit(types.SET_SUGGESTIONS, res)
    })
  },
  getQuickstarts ({ commit, state }) {
    return getQuickstarts().then(res => {
      commit(types.SET_QUICKSTART_RESULT, res)
    })
  },
  setQuestionResult ({commit, getters}, data) {
    commit('setAppQuestion', data)
    router.push({
      name: 'PageResult',
      query: {
        question: data,
        '_': new Date().getTime(),
        bookmarkId: getters.bookmarkId
      }
    })
  }
}
