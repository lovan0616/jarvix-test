import { askQuestion, askResult, askSpecificType, getComponentList, getComponentData, addTableToMemory, getParserLanguageList } from '@/API/NewAsk'
import axios from 'axios'
import i18n from '@/lang/index.js'

export default {
  askQuestion ({dispatch, commit, state, rootState, rootGetters}, data) {

    let cancelToken = null
    // 當同時問多個問題時，不去 cancel 前一個問題的 request
    if (data.shouldCancelToken) {
      dispatch('cancelRequest')
      state.askCancelToken = axios.CancelToken.source()
      cancelToken = state.askCancelToken.token
    }

    const dataFrameId = data.dataFrameId || rootState.dataSource.dataFrameId
    let askCondition = {
      question: data.question === rootState.dataSource.appQuestion ? rootState.dataSource.appQuestion : data.question,
      dataSourceId: data.dataSourceId || rootState.dataSource.dataSourceId,
      previewQuestionId: data.previewQuestionId || rootGetters['dataSource/drillDownQuestionId'],
      domain: 'GENERAL',
      isIgnoreAlgorithm: state.isUseAlgorithm ? !state.isUseAlgorithm : null,
      dataFrameId: dataFrameId === 'all' ? '' : dataFrameId,
      selectedColumnList: rootGetters['dataFrameAdvanceSetting/selectedColumnList'],
      language: data.language || state.parserLanguage
    }

    return askQuestion(askCondition, cancelToken)
  },
  askResult ({dispatch, state}, data) {
    let cancelToken = state.askCancelToken ? state.askCancelToken.token : null
    return askResult(data, cancelToken)
  },
  askSpecificType ({ state, commit }, data) {
    let cancelToken = state.askCancelToken ? state.askCancelToken.token : null
    commit('result/updateCurrentResultId', data.resultId, { root: true })
    return askSpecificType(data, cancelToken)
  },
  getComponentList ({dispatch, state}, data) {
    let cancelToken = state.askCancelToken ? state.askCancelToken.token : null
    return getComponentList(data, cancelToken)
  },
  getComponentData ({dispatch}, data) {
    return getComponentData(data)
  },
  cancelRequest ({state}) {
    if (state.askCancelToken) {
      state.askCancelToken.cancel('cancel')
    }
  },
  openAskInMemory ({rootGetters, rootState}) {
    if (!rootGetters['userManagement/hasPermission']('in_memory')) return
    addTableToMemory(rootGetters['userManagement/getCurrentAccountId'], rootGetters['dataSource/currentDataFrameId'], rootState.dataSource.dataSourceId)
  },
  getParserList ({commit, rootState}) {
    getParserLanguageList().then(res => {
      let currentLanguage = 'ZH_TW'
      // switch (rootState.setting.locale) {
      //   case 'zh-TW':
      //     currentLanguage = 'ZH_TW'
      //     break
      //   case 'zh-CN':
      //     currentLanguage = 'ZH_CN'
      //     break
      //   case 'en-US':
      //     currentLanguage = 'EN_US'
      //     break
      //   default:
      //     currentLanguage = 'ZH_TW'
      //     break
      // }
      let languageParser = res.some(element => element.language === currentLanguage) ? currentLanguage : res[0]

      commit('setParserLanguageList', res)
      commit('setParserLanguage', languageParser)
    })
  }
}
