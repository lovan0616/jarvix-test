import co from 'co'
import router from '../../../router'
import { getBookmarks, getSuggestions, getQuickstarts, getBookmarkColumn } from '@/API/Bookmark'
import { getQuestionHistory } from '@/API/ChatBot'

export default {
  init ({ commit, dispatch, state }) {
    if (state.isInit) return Promise.resolve(state)

    let queryBookmark = parseInt(router.app.$route.query.bookmarkId)
    dispatch('getBookmarkList', queryBookmark)
    commit('setIsInit', true)
  },
  changeBookmarkById ({ dispatch, commit, state }, bookmarkId) {
    // 更新 Bookmark 資料
    commit('setBookmarkId', bookmarkId)
    // 清空對話紀錄
    commit('chatBot/clearConversation', null, {root: true})

    return co(function* () {
      yield dispatch('getHistoryQuestionList')
      yield dispatch('getBookmarkColumnInfo')
      return Promise.resolve(state)
    })
  },
  getBookmarkList ({ dispatch, commit, state }, data) {
    return getBookmarks().then(res => {
      commit('setBookmarkList', res)

      if (data) {
        let hasBookmark = false
        res.forEach(element => {
          if (element.id === data) hasBookmark = true
        })
        // 判斷路由的 bookmark 是否存在
        if (hasBookmark) {
          dispatch('changeBookmarkById', data)
        } else {
          dispatch('changeBookmarkById', res[0].id)
          router.push('/')
        }
      } else {
        if (!state.bookmarkId) {
          dispatch('changeBookmarkById', res[0].id)
        }
      }
    })
  },
  getBookmarkColumnInfo ({ commit, state }) {
    return getBookmarkColumn(state.bookmarkId).then(response => {
      commit('setBookmarkCloumnInfoList', response)
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
  updateResultRouter ({commit, getters}, actionTag) {
    /**
     * 這邊的 Bookmark 需要轉成字串的原因是：
     * 今天如果直接在結果頁重新整理，我如果直接從 router 進來
     * 從 $route 拿的 query 資訊會是字串形式，為了避免資料的格式不同觸發了 Result 頁 watch 的 function
     * 所以需要做一次型別的轉換
     **/
    router.push({
      name: 'PageResult',
      query: {
        question: getters.appQuestion,
        stamp: new Date().getTime(),
        bookmarkId: String(getters.bookmarkId),
        action: actionTag
      }
    })
  },
  getHistoryQuestionList ({commit, getters}) {
    return getQuestionHistory(getters.bookmarkId).then(res => {
      commit('setHistoryQuestionList', res)
    })
  }
}
