import { Message } from 'element-ui'
import i18n from '@/lang/index.js'

export default {
  setIsInit (state, value) {
    state.isInit = value || false
  },
  setDataSourceList (state, data) {
    state.dataSourceList = data
  },
  setDataSourceId (state, id) {
    state.dataSourceId = id
  },
  setDataSourceColumnInfoList (state, data) {
    state.dataSourceColumnInfoList = data
  },
  setDataSourceDataValueList (state, data) {
    state.dataSourceDataValueList = data.values
  },
  setAppQuestion (state, data) {
    state.appQuestion = data
  },
  setHistoryQuestionList (state, data) {
    state.historyQuestionList = data
  },
  setCurrentQuestionInfo (state, data) {
    state.currentQuestionInfo = data
  },
  setCurrentQuestionId (state, data) {
    state.currentQuestionId = data
  },
  setFilterList (state, data) {
    if (data.length === 0) return false
    // 判斷要從哪邊開始取代新的
    let newRestriction = {
      status: true,
      restriction: data,
      questionId: state.currentQuestionId
    }
    let closeFilterIndex = -1
    for (let i = 0; i < state.filterList.length; i++) {
      if (!state.filterList[i].status) {
        closeFilterIndex = i
        break
      }
    }

    if (closeFilterIndex > -1) {
      state.filterList = state.filterList.slice(0, closeFilterIndex)
    }
    state.filterList.push(newRestriction)

    Message({
      message: i18n.t('message.addFilter'),
      type: 'success',
      duration: 3 * 1000
    })
  },
  setDataFrameList(state, data) {
    state.dataFrameList = data
  },
  setDataFrameId(state, id) {
    state.dataFrameId = id
  },
  clearFilterList (state) {
    state.filterList = []
  },
  setStatusList (state, data) {
    state.filterList.forEach((filter, index) => {
      state.filterList[index]['status'] = data[index]
    })
  },
  clearCurrentQuestionId (state) {
    state.currentQuestionId = null
  }
}
