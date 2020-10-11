import { askQuestion, askResult, askSpecificType, getComponentList, getComponentData, getRelatedQuestionList, getQuickStartQuestion, addTableToMemory, getParserLanguageList } from '@/API/NewAsk'
import axios from 'axios'
import i18n from '@/lang/index.js'

export default {
  askQuestion ({dispatch, commit, state, rootState, rootGetters}, data) {
    dispatch('cancelRequest')
    state.askCancelToken = axios.CancelToken.source()
    const dataFrameId = rootState.dataSource.dataFrameId || data.dataFrameId
    let askCondition = {
      question: rootState.dataSource.appQuestion || data.question,
      dataSourceId: rootState.dataSource.dataSourceId || data.dataSourceId,
      previewQuestionId: rootGetters['dataSource/drillDownQuestionId'],
      domain: 'GENERAL',
      isIgnoreAlgorithm: state.isUseAlgorithm ? !state.isUseAlgorithm : null,
      dataFrameId: dataFrameId === 'all' ? '' : dataFrameId,
      selectedColumnList: rootGetters['dataFrameAdvanceSetting/selectedColumnList']
    }

    return askQuestion({...askCondition, language: state.parserLanguage}, state.askCancelToken.token)
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
  getRelatedQuestionList({rootState}, resultId) {
    return getRelatedQuestionList(resultId, rootState.dataSource.dataSourceId)
  },
  getQuickStartQuestion({ rootState, rootGetters }, dataSourceIdData) {
    const dataSourceId = rootState.dataSource.dataSourceId || dataSourceIdData
    const dataFrameId = rootGetters['dataSource/currentDataFrameId']
    const selectedColumnList = rootGetters['dataFrameAdvanceSetting/selectedColumnList']
    const restrictions = rootGetters['dataSource/filterRestrictionList']
    return getQuickStartQuestion(dataSourceId, dataFrameId, restrictions, selectedColumnList)
  },
  cancelRequest ({state}) {
    if (state.askCancelToken) {
      state.askCancelToken.cancel('cancel')
    }
  },
  async updateChatConversation({ dispatch, commit, state, rootState }) {
    commit('updateAnalyzeStatus', true)
    try {
      const response = await dispatch('getQuickStartQuestion', rootState.dataSource.dataSourceId)
      commit('updateAnalyzeStatus', false)
      commit('addSystemConversation',
        response.length > 0
          ? { text: i18n.t('bot.welcomeMessageWithSuggestions'), options: response }
          : { text: i18n.t('bot.welcomeMessage') }
      )
    } catch (error) {
      commit('updateAnalyzeStatus', false)
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
