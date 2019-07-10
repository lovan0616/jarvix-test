import co from 'co'
import router from '../../../router'
import { getBookmarks, getSuggestions, getQuickstarts } from '@/API/Bookmark'
import { getHistoryQuestionList } from '@/API/Ask'

export default {
  init ({ commit, dispatch, state }) {
    if (state.isInit) return Promise.resolve(state)
    return co(function* () {
      yield dispatch('getBookmarkList')
      yield dispatch('getSuggestionList')
      yield dispatch('getQuickstartList')
      commit('setIsInit', true)
      return Promise.resolve(state)
    })
  },
  changeBookmarkById ({ dispatch, commit, state }, bookmarkId) {
    // 更新 Bookmark 資料
    commit('setBookmarkId', bookmarkId)

    return co(function* () {
      yield dispatch('getSuggestionList')
      yield dispatch('getQuickstartList')
      return Promise.resolve(state)
    })
  },
  getBookmarkList ({ dispatch, commit, state }, data) {
    return getBookmarks().then(res => {
      commit('setBookmarkList', res)
      if (!state.bookmarkId) {
        commit('setBookmarkId', res[0].id)
      }
    })
  },
  getSuggestionList ({ commit, state }) {
    return getSuggestions(state.bookmarkId).then(res => {
      commit('setSuggestions', res)
    })
  },
  getQuickstartList ({ commit, state }) {
    return getQuickstarts(state.bookmarkId).then(res => {
      commit('setQuickStart', res)
    })
  },
  updateResultPreviewRouter ({commit, getters}, data) {
    commit('setCurrentResultDisplayType', 'preview')

    router.push({
      name: 'PageResult',
      query: {
        question: data || getters.appQuestion,
        '_': new Date().getTime(),
        bookmarkId: getters.bookmarkId,
        type: 'preview'
      }
    })
  },
  updateResultRouter ({commit, getters}, data) {
    commit('setCurrentResultDisplayType', 'display')

    router.push({
      name: 'PageResult',
      query: {
        question: data || getters.appQuestion,
        '_': new Date().getTime(),
        bookmarkId: getters.bookmarkId,
        type: 'display'
      }
    })
  },
  getHistoryQuestionList ({commit}) {
    return getHistoryQuestionList().then(res => {
      commit('setHistoryQuestionList', res.history)
    })
  }
}
