import { askQuestion, askQuestionV2, askResult, askResultV2, getComponentList, getComponentListV2, getComponentData, getRelatedQuestionList, getQuickStartQuestion, addTableToMemory, getParserLanguageList } from '@/API/NewAsk'
import axios from 'axios'
import i18n from '@/lang/index.js'
const CancelToken = axios.CancelToken
let cancelFunction

export default {
  askQuestion ({dispatch, commit, state, rootState, rootGetters}, data) {
    dispatch('cancelRequest')
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

    if (localStorage.getItem('newParser') === 'true') {
      return askQuestionV2({...askCondition, language: state.parserLanguage}, new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelFunction = c
      }))
    } else {
      return askQuestion(askCondition, new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelFunction = c
      }))
    }

    
  },
  askResult ({dispatch}, data) {
    if (localStorage.getItem('newParser') === 'true') {
      return askResultV2(data, new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelFunction = c
      }))
    } else {
      return askResult(data, new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelFunction = c
      }))
    }
  },
  getComponentList ({dispatch, state}, data) {
    if (localStorage.getItem('newParser') === 'true') {
      return getComponentListV2(data, new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelFunction = c
      }))
    } else {
      return getComponentList(data, new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelFunction = c
      }))
    }
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
  cancelRequest () {
    if (typeof cancelFunction === 'function') {
      cancelFunction('cancel request')
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
      let currentLanguage
      switch (rootState.setting.locale) {
        case 'zh-TW':
          currentLanguage = 'ZH_TW'
          break
        case 'zh-CN':
          currentLanguage = 'ZH_CN'
          break
        case 'en-US':
          currentLanguage = 'EN_US'
          break
      }
      let languageParser = res.some(element => element.language === currentLanguage) ? currentLanguage : res[0]
      commit('setParserLanguageList', res)
      commit('setParserLanguage', languageParser)
    })
  }
}
