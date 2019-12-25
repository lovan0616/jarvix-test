import co from 'co'
import { getDataSourceList, getDataSourceColumnInfoById, getDataSourceDataValueById } from '@/API/DataSource'
import { getSuggestions, getQuickstarts } from '@/API/Bookmark'
import { getQuestionHistory } from '@/API/ChatBot'
import router from '../../../router'

export default {
  init ({ commit, dispatch, state }) {
    if (state.isInit) return Promise.resolve(state)

    let queryDataSource = parseInt(router.app.$route.query.dataSourceId)
    dispatch('getDataSourceList', queryDataSource)
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
        // 判斷路由的 DataSource 是否存在
        if (hasDataSource) {
          dispatch('changeDataSourceById', data)
        } else {
          dispatch('changeDataSourceById', res[0].id)
          router.push('/')
        }
      } else {
        // 如果沒有 dataSourceId 或是 dataSourceId 被刪掉了，就設第一個
        if (!state.dataSourceId || res.findIndex(element => element.id === state.dataSourceId) < 0) {
          dispatch('changeDataSourceById', res[0].id)
        }
      }
    })
  },
  changeDataSourceById ({ dispatch, commit, state }, dataSourceId) {
    // 清空對話紀錄
    if (state.dataSourceId) {
      commit('chatBot/clearConversation', null, {root: true})
      // 清空篩選條件
      dispatch('clearAllFilter')
    }
    // 更新 DataSource 資料
    commit('setDataSourceId', dataSourceId)

    return co(function* () {
      yield dispatch('getHistoryQuestionList')
      yield dispatch('getDataSourceColumnInfo')
      yield dispatch('getDataSourceDataValue')
      return Promise.resolve(state)
    })
  },

  getDataSourceColumnInfo ({ commit, state }) {
    return getDataSourceColumnInfoById(state.dataSourceId).then(response => {
      commit('setDataSourceCloumnInfoList', response)
    })
  },
  getDataSourceDataValue ({ commit, state }) {
    return getDataSourceDataValueById(state.dataSourceId).then(response => {
      commit('setDataSourceDataValueList', response)
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
  updateResultRouter ({commit, state}, actionTag) {
    /**
     * 這邊的 DataSource 需要轉成字串的原因是：
     * 今天如果直接在結果頁重新整理，我如果直接從 router 進來
     * 從 $route 拿的 query 資訊會是字串形式，為了避免資料的格式不同觸發了 Result 頁 watch 的 function
     * 所以需要做一次型別的轉換
     **/
    router.push({
      name: 'PageResult',
      query: {
        question: state.appQuestion,
        stamp: new Date().getTime(),
        dataSourceId: String(state.dataSourceId),
        action: actionTag
      }
    })
  },
  getHistoryQuestionList ({commit, state}) {
    return getQuestionHistory(state.dataSourceId).then(res => {
      commit('setHistoryQuestionList', res)
    })
  },
  updateFilterStatusList ({commit}, statusList) {
    commit('setStatusList', statusList)
  },
  clearAllFilter ({ commit }) {
    commit('clearFilterList')
  }
}
