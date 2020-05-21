import co from 'co'
import { getDataSourceList, getDataSourceColumnInfoById, getDataSourceDataValueById, getDataFrameById, getDataFrameData, dataFrameColumnSummary } from '@/API/DataSource'
import { getHistoryQuestionList } from '@/API/NewAsk'
import router from '../../../router'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'

export default {
  init ({ commit, dispatch, state, getters, rootGetters }) {
    if (state.isInit) return Promise.resolve(state)
    let queryDataSource = parseInt(router.app.$route.query.dataSourceId)
    const currentGroupId = rootGetters['userManagement/getCurrentGroupId']
    if (currentGroupId) dispatch('getDataSourceList', queryDataSource)
    commit('setIsInit', true)
  },
  getDataSourceList ({ dispatch, commit, state }, data) {
    return getDataSourceList().then(res => {
      commit('setDataSourceList', res)
      // 找出第一個可以使用的 dataSourceId
      let firstEnableDataSourceIndex = res.findIndex(element => element.enableDataFrameCount)

      if (data) {
        // 判斷路由的 DataSource 是否存在
        if (res.some(element => element.id === data)) {
          dispatch('changeDataSourceById', data)
        } else {
          const dataSourceId = firstEnableDataSourceIndex > -1 ? res[firstEnableDataSourceIndex].id : null
          dispatch('changeDataSourceById', dataSourceId)
          if (firstEnableDataSourceIndex < 0) dispatch('handleEmptyDataSource')
          router.push('/')

          Message({
            message: i18n.t('message.dataSourceNotExist'),
            type: 'success',
            duration: 3 * 1000
          })
        }
      } else {
        if (firstEnableDataSourceIndex < 0) {
          dispatch('handleEmptyDataSource')
        } else if (!state.dataSourceId || res.findIndex(element => element.id === state.dataSourceId) < 0) {
          // 如果沒有 dataSourceId 或是 dataSourceId 被刪掉了，就設第一個可使用的 dataSource
          dispatch('changeDataSourceById', res[firstEnableDataSourceIndex].id)
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
      // 清除 question id
      commit('clearCurrentQuestionId')
      // 關閉演算法
      commit('chatBot/updateIsUseAlgorithm', false, {root: true})
    }
    // 更新 DataSource 資料
    commit('setDataSourceId', dataSourceId)
    if (!dataSourceId) return Promise.resolve(state)
    return co(function* () {
      yield dispatch('getHistoryQuestionList')
      yield dispatch('getDataSourceColumnInfo')
      yield dispatch('getDataSourceDataValue')
      return Promise.resolve(state)
    })
  },
  handleEmptyDataSource ({ dispatch, commit }) {
    commit('chatBot/clearConversation', null, {root: true})
    commit('chatBot/updateAnalyzeStatus', false, {root: true})
    dispatch('clearAllFilter')
    commit('clearCurrentQuestionId')
    commit('chatBot/updateIsUseAlgorithm', false, {root: true})
    commit('setDataSourceId', null)
  },
  getDataSourceTables ({state}) {
    if (state.dataSourceId === null) return
    return getDataFrameById(state.dataSourceId)
  },
  getDataFrameColumnSummary ({ state }, { id, page }) {
    if (page > 0) return
    return dataFrameColumnSummary(id)
  },
  getDataFrameData ({ state }, { id, page = 0 }) {
    return getDataFrameData(id, page)
  },
  getDataFrameIntro ({ dispatch, state }, { id, page }) {
    return Promise.all([
      dispatch('getDataFrameData', { id, page }),
      dispatch('getDataFrameColumnSummary', { id, page })
    ])
  },
  getDataFrameColumnCorrelation ({ state }, { id }) {
    // TODO: 串接 API
  },
  getDataSourceColumnInfo ({ commit, state }) {
    if (!state.dataSourceId) return
    return getDataSourceColumnInfoById(state.dataSourceId).then(response => {
      commit('setDataSourceColumnInfoList', response)
    })
  },
  getDataSourceDataValue ({ commit, state }) {
    if (!state.dataSourceId) return
    return getDataSourceDataValueById(state.dataSourceId).then(response => {
      commit('setDataSourceDataValueList', response)
    })
  },
  updateResultRouter ({commit, state, rootGetters}, actionTag) {
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
        // 暫時用來判定使用者是否在當前的群組問問題
        // groupId: rootGetters['userManagement/getCurrentGroupId']
      }
    })
  },
  getHistoryQuestionList ({commit, state}, data) {
    return getHistoryQuestionList(state.dataSourceId || data).then(res => {
      commit('setHistoryQuestionList', res)
    })
  },
  updateFilterStatusList ({commit, state}, statusList) {
    commit('setStatusList', statusList)
  },
  clearAllFilter ({ commit }) {
    commit('clearFilterList')
  }
}
