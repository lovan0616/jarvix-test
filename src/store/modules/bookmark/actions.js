import * as types from './mutation_type'
import co from 'co'
import router from '../../../router'
import { getBookmarks, getSuggestions, getQuickstarts } from '@/API/Bookmark'
import { getHistoryQuestionList } from '@/API/Ask'

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
  changeBookmarkById ({ dispatch, commit, state }, bookmarkId) {
    // 更新 Bookmark 資料
    commit(types.SET_BOOKMARK, state.bookmarks.find(element => element.id === bookmarkId))

    return co(function* () {
      yield dispatch('getSuggestions')
      yield dispatch('getQuickstarts')
      return Promise.resolve(state)
    })
  },
  getBookmarks ({ commit, state }) {
    return getBookmarks().then(res => {
      commit(types.SET_BOOKMARKS, res)
      if (!state.bookmark) {
        commit(types.SET_BOOKMARK, res[0])
      }
    })
  },
  getSuggestions ({ commit, state }) {
    return getSuggestions(state.bookmark.id).then(res => {
      commit(types.SET_SUGGESTIONS, res)
    })
  },
  getQuickstarts ({ commit, state }) {
    return getQuickstarts(state.bookmark.id).then(res => {
      commit(types.SET_QUICKSTART_RESULT, res)
    })
  },
  updateResultPreviewRouter ({commit, getters}, data) {
    router.push({
      name: 'PageResultPreview',
      query: {
        question: data || getters.appQuestion,
        '_': new Date().getTime(),
        bookmarkId: getters.bookmarkId
      }
    })
  },
  updateResultRouter ({commit, getters}, data) {
    router.push({
      name: 'PageResultDisplay',
      query: {
        question: data || getters.appQuestion,
        '_': new Date().getTime(),
        bookmarkId: getters.bookmarkId
      }
    })
  },
  getHistoryQuestionList ({commit}) {
    return getHistoryQuestionList().then(res => {
      commit('setHistoryQuestionList', res.history)
    })
  }
}
