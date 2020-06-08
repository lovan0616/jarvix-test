import { askQuestion, askResult, getComponentList, getComponentData, getRelatedQuestionList, getQuickStartQuestion } from '@/API/NewAsk'
import axios from 'axios'
const CancelToken = axios.CancelToken
let cancelFunction

export default {
  askQuestion ({dispatch, commit, state, rootState, rootGetters}, data) {
    dispatch('cancelRequest')
    const dataFrameId = rootState.dataSource.dataFrameId || data.dataFrameId
    return askQuestion({
      question: rootState.dataSource.appQuestion || data.question,
      dataSourceId: rootState.dataSource.dataSourceId || data.dataSourceId,
      previewQuestionId: rootGetters['dataSource/drillDownQuestionId'],
      domain: 'GENERAL',
      isIgnoreAlgorithm: state.isUseAlgorithm ? !state.isUseAlgorithm : null,
      dataFrameId: dataFrameId === 'all' ? '' : dataFrameId
    }, new CancelToken(function executor (c) {
      // An executor function receives a cancel function as a parameter
      cancelFunction = c
    }))
  },
  askResult ({dispatch}, data) {
    return askResult(data, new CancelToken(function executor (c) {
      // An executor function receives a cancel function as a parameter
      cancelFunction = c
    }))
  },
  getComponentList ({dispatch, state}, data) {
    return getComponentList(data, new CancelToken(function executor (c) {
      // An executor function receives a cancel function as a parameter
      cancelFunction = c
    }))
  },
  getComponentData ({dispatch}, data) {
    return getComponentData(data)
  },
  getRelatedQuestionList ({commit}, data) {
    return getRelatedQuestionList(data)
  },
  getQuickStartQuestion ({rootState}, data) {
    return getQuickStartQuestion(rootState.dataSource.dataSourceId || data)
  },
  cancelRequest () {
    if (typeof cancelFunction === 'function') {
      cancelFunction('cancel request')
    }
  }
}
