import { askQuestion, askResult, getComponentList, getComponentData } from '@/API/NewAsk'
import axios from 'axios'
const CancelToken = axios.CancelToken
let cancelFunction

export default {
  askQuestion ({dispatch, commit, state, rootState}, data) {
    dispatch('cancelRequest')

    return askQuestion({
      question: rootState.dataSource.appQuestion || data.question,
      dataSourceId: rootState.dataSource.dataSourceId || data.dataSourceId,
      domain: 'GENERAL',
      isIgnoreAlgorithm: false
    }, new CancelToken(function executor (c) {
      // An executor function receives a cancel function as a parameter
      cancelFunction = c
    }))
  },
  askResult ({dispatch}, data) {
    return askResult(data)
  },
  getComponentList ({dispatch, state}, data) {
    return getComponentList(data)
  },
  getComponentData ({dispatch}, data) {
    return getComponentData(data)
  },
  cancelRequest () {
    if (typeof cancelFunction === 'function') {
      cancelFunction('cancel request')
    }
  }
}
