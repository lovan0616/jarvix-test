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
      commit('setIsInit', true)
      return Promise.resolve(state)
    })
  },
  changeBookmarkById ({ dispatch, commit, state }, bookmarkId) {
    // 更新 Bookmark 資料
    commit('setBookmarkId', bookmarkId)
    // 清空對話紀錄
    commit('chatBot/clearConversation', null, {root: true})

    return co(function* () {
      yield dispatch('getSuggestionList')
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
  updateResultRouter ({commit, getters}, data) {
    router.push({
      name: 'PageResult',
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
