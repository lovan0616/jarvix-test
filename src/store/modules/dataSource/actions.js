import co from 'co'
import { getDataSourceList, getDataSourceColumnInfoById, getDataSourceDataValueById, getDataFrameById, getDataFrameData, dataFrameColumnSummary, getColumnCorrelationMatrix } from '@/API/DataSource'
import { getHistoryQuestionList } from '@/API/NewAsk'
import router from '../../../router'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'
import axios from 'axios'
const CancelToken = axios.CancelToken
let popupCancelFunction
let displayCancelFunction

export default {
  init ({ commit, dispatch, state, getters, rootGetters }) {
    if (state.isInit) return Promise.resolve(state)
    let queryDataSource = parseInt(router.app.$route.query.dataSourceId)
    let queryDataFrame = router.app.$route.query.dataFrameId
    const currentGroupId = rootGetters['userManagement/getCurrentGroupId']
    if (currentGroupId) {
      dispatch('getDataSourceList', {
        dataSourceId: queryDataSource, 
        dataFrameId: queryDataFrame === 'all' ? 'all' : parseInt(queryDataFrame)
      })
    }
    commit('setIsInit', true)
  },
  getDataSourceList({ dispatch, commit, state, rootGetters }, { dataSourceId, dataFrameId }) {
    return getDataSourceList().then(res => {
      commit('setDataSourceList', res)
      // 找出第一個可以使用的 dataSourceId
      let firstEnableDataSourceIndex = res.findIndex(element => element.enableDataFrameCount)
      if (dataSourceId) {
        // 判斷路由的 DataSource 是否存在，且該 DataSource 是有可使用的 DataFrame
        if (res.some(element => element.id === dataSourceId && element.enableDataFrameCount)) {
          dispatch('changeDataSourceById', { dataSourceId, dataFrameId })
        } else {
          const dataSourceId = firstEnableDataSourceIndex > -1 ? res[firstEnableDataSourceIndex].id : null
          dispatch('changeDataSourceById', { dataSourceId, dataFrameId: 'all' })
          if (firstEnableDataSourceIndex < 0) dispatch('handleEmptyDataSource')
          const currentGroupId = rootGetters['userManagement/getCurrentGroupId']
          router.push({
            name: 'PageIndex', 
            params: { 
              'group_id': currentGroupId
            },
            query: {
              ...(dataSourceId && {
                dataSourceId: dataSourceId,
                dataFrameId: 'all'
              })
            }
          })

          Message({
            message: i18n.t('message.dataSourceNotExist'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        }
      } else {
        if (firstEnableDataSourceIndex < 0) {
          dispatch('handleEmptyDataSource')
        } else if (!state.dataSourceId || res.findIndex(element => element.id === state.dataSourceId) < 0) {
          // 如果沒有 dataSourceId 或是 dataSourceId 被刪掉了，就設第一個可使用的 dataSource
          return dispatch('changeDataSourceById', { dataSourceId: res[firstEnableDataSourceIndex].id, dataFrameId: 'all' })
        }
      }
    })
  },
  async changeDataSourceById({ dispatch, commit, state, rootGetters }, {dataSourceId, dataFrameId}) {
    if (state.dataSourceId === dataSourceId  && state.dataFrameId === dataFrameId) return Promise.resolve(state)
    // 清空對話紀錄
    if (state.dataSourceId) dispatch('clearChatbot')
    // 更新 DataSource 資料
    commit('setDataSourceId', dataSourceId)
    commit('setDataFrameId', dataFrameId)
    
    if (!dataSourceId) return Promise.resolve(state)

    // 更新 DataFrame 資料
    const dataFrameList = await dispatch('getDataSourceTables')
    commit('setDataFrameList', dataFrameList)

    // 當指定 DataFrame 時，確認是否存在
    if (dataFrameId !== 'all' && !dataFrameList.some(element => element.id === dataFrameId)) {
      dispatch('changeDataFrameById', 'all')
      const currentGroupId = rootGetters['userManagement/getCurrentGroupId']
      router.push({
        name: 'PageIndex',
        params: {
          'group_id': currentGroupId
        },
        query: {
          dataSourceId: dataSourceId,
          dataFrameId: dataFrameId
        }
      })

      return Message({
        message: i18n.t('message.dataFrameNotExist'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
    }
    return dispatch('changeDataFrameById', dataFrameId)
  },
  changeDataFrameById ({ dispatch, commit, state }, dataFrameId) {
    dispatch('clearChatbot')
    // 更新 DataFrame 資料
    commit('setDataFrameId', dataFrameId)
    return co(function* () {
      yield dispatch('chatBot/updateChatConversation', false, { root: true })
      yield dispatch('getHistoryQuestionList')
      yield dispatch('getDataSourceColumnInfo')
      yield dispatch('getDataSourceDataValue')
      return Promise.resolve(state)
    })
  },
  clearChatbot({ dispatch, commit, state }) {
    // 清空對話紀錄
    commit('chatBot/clearConversation', null, { root: true })
    // 清空篩選條件 
    dispatch('clearAllFilter')
    // 清除 question id
    commit('clearCurrentQuestionId')
    // 關閉演算法
    commit('chatBot/updateIsUseAlgorithm', false, { root: true })
  },
  handleEmptyDataSource ({ dispatch, commit }) {
    commit('chatBot/clearConversation', null, {root: true})
    commit('chatBot/updateAnalyzeStatus', false, {root: true})
    dispatch('clearAllFilter')
    commit('clearCurrentQuestionId')
    commit('chatBot/updateIsUseAlgorithm', false, {root: true})
    commit('setDataSourceId', null)
    commit('setDataFrameList', [])
    commit('setDataFrameId', null)
  },
  getDataSourceTables ({state}) {
    if (state.dataSourceId === null) return []
    return getDataFrameById(state.dataSourceId)
  },
  getDataFrameColumnSummary ({ state }, { id, page, cancelToken }) {
    if (page > 0) return
    return dataFrameColumnSummary(id, cancelToken)
  },
  getDataFrameData ({ state }, { id, page = 0, cancelToken }) {
    return getDataFrameData(id, page, cancelToken)
  },
  getDataFrameIntro ({ dispatch, state }, { id, page, mode }) {
    dispatch('cancelRequest', mode)
    const cancelToken = new CancelToken(function executor (c) {
      // An executor function receives a cancel function as a parameter
      if (mode === 'popup') popupCancelFunction = c
      if (mode === 'display') displayCancelFunction = c
    })
    return Promise.all([
      dispatch('getDataFrameData', { id, page, cancelToken }),
      dispatch('getDataFrameColumnSummary', { id, page, cancelToken })
    ])
  },
  getDataFrameColumnCorrelation ({ state }, { id }) {
    return getColumnCorrelationMatrix(id)
  },
  getDataSourceColumnInfo({ commit, state, getters }) {
    if (!state.dataSourceId) return
    const dataFrameId = getters.currentDataFrameId
    return getDataSourceColumnInfoById(state.dataSourceId, dataFrameId).then(response => {
      commit('setDataSourceColumnInfoList', response)
    })
  },
  getDataSourceDataValue ({ commit, state, getters }) {
    if (!state.dataSourceId) return
    const dataFrameId = getters.currentDataFrameId
    return getDataSourceDataValueById(state.dataSourceId, dataFrameId).then(response => {
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
        dataFrameId: String(state.dataFrameId),
        action: actionTag
        // 暫時用來判定使用者是否在當前的群組問問題
        // groupId: rootGetters['userManagement/getCurrentGroupId']
      }
    })
  },
  getHistoryQuestionList ({commit, state, getters}, dataSourceIdData) {
    const dataSourceId = state.dataSourceId || dataSourceIdData
    const dataFrameId = getters.currentDataFrameId
    return getHistoryQuestionList(dataSourceId, dataFrameId).then(res => {
      commit('setHistoryQuestionList', res)
    })
  },
  updateFilterStatusList ({commit, state}, statusList) {
    commit('setStatusList', statusList)
  },
  clearAllFilter ({ commit }) {
    commit('clearFilterList')
  },
  cancelRequest ({ state }, mode) {
    if (mode === 'popup' && typeof popupCancelFunction === 'function') {
      popupCancelFunction('cancel request')
    } 
    if (mode === 'display' && typeof displayCancelFunction === 'function') {
      displayCancelFunction('cancel request')
    }
  },
  async updateDataFrameList({ commit, state, dispatch }) {
    // 取得 dataFrame 資料
    const dataFrameList = await dispatch('getDataSourceTables')

    // 如果沒有 dataFrame 則重新 assign store 中當前的 dataSource
    if (dataFrameList.length === 0) {
      commit('setDataSourceId', null)
      return dispatch('getDataSourceList', {})
    }

    // 更新 dataFrame list
    commit('setDataFrameList', dataFrameList)

    // 確認當前 dataFrame 是否存在
    const hasCurrentDataFrame = dataFrameList.some(element => element.id === state.dataFrameId)
    if (state.dataFrameId === "all" || hasCurrentDataFrame) return

    // 如果 dataFrame 被刪掉則恢復預設 all
    return dispatch('changeDataFrameById', 'all')
  }
}
