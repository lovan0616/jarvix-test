import co from 'co'
import { getDataSourceList, createDataSource, getDataSourceById, checkDataSourceStatusById } from '@/API/DataSource'
import { getSuggestions, getQuickstarts, getBookmarkColumn } from '@/API/Bookmark'
import { getQuestionHistory } from '@/API/ChatBot'
import router from '../../../router'

export default {
  init ({ commit, dispatch, state }) {
    if (state.isInit) return Promise.resolve(state)

    let queryBookmark = parseInt(router.app.$route.query.dataSourceId)
    dispatch('getDataSourceList', queryBookmark)
    commit('setIsInit', true)
  },
  getDataSourceList ({ dispatch, commit, state }, data) {
    return getDataSourceList().then(res => {
      commit('setDataSourceList', res)

      if (data) {
        let hasDataSource = false
        res.forEach(element => {
          if (element.id === data) hasDataSource = true
        })
        // 判斷路由的 bookmark 是否存在
        if (hasDataSource) {
          dispatch('changeDataSourceById', data)
        } else {
          dispatch('changeDataSourceById', res[0].id)
          router.push('/')
        }
      } else {
        if (!state.dataSourceId) {
          dispatch('changeDataSourceById', res[0].id)
        }
      }
    })
  },
  changeDataSourceById ({ dispatch, commit, state }, dataSourceId) {
    // 更新 Bookmark 資料
    commit('setDataSourceId', dataSourceId)
    // 清空對話紀錄
    commit('chatBot/clearConversation', null, {root: true})

    return co(function* () {
      // yield dispatch('getHistoryQuestionList')
      // yield dispatch('getBookmarkColumnInfo')
      return Promise.resolve(state)
    })
  },

  getBookmarkColumnInfo ({ commit, state }) {
    return getBookmarkColumn(state.dataSourceId).then(response => {
      commit('setBookmarkCloumnInfoList', response)
    })
  },
  getSuggestionList ({ commit, state }) {
    return getSuggestions(state.dataSourceId).then(res => {
      commit('setSuggestions', res)
    })
  },
  getQuickstartList ({ commit, state }) {
    return getQuickstarts(state.dataSourceId).then(res => {
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
        dataSourceId: String(getters.dataSourceId),
        action: actionTag
      }
    })
  },
  getHistoryQuestionList ({commit, state}) {
    return getQuestionHistory(state.dataSourceId).then(res => {
      commit('setHistoryQuestionList', res)
    })
  }
}
