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
  setCurrentQuestionDataFrameId(state, data) {
    state.currentQuestionDataFrameId = data
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

    state.filterList = [...state.filterList, newRestriction]

    Message({
      message: i18n.t('message.addFilter'),
      type: 'success',
      duration: 3 * 1000,
      showClose: true
    })
  },
  setUpdatedFilterList(state, data) {
    state.filterList = data
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
  },
  setProcessingDataFrameList (state, data) {
    state.processingDataFrameList.push({
      dataSourceId: data.dataSourceId,
      dataFrameId: data.dataFrameId,
      primaryAlias: data.primaryAlias,
      state: 'ready'
    })
  },
  updateProcessingDataFrameList (state, data) {
    let messageString = data.lastImportType === 'UPDATE' || data.lastImportType === 'REIMPORT'
      ? 'message.dataFrameUpdated'
      : 'message.dataFrameBuilt'
    Message({
      message: i18n.t(messageString, {name: data.primaryAlias}),
      type: 'success',
      duration: 3 * 1000,
      showClose: true
    })
    state.processingDataFrameList = state.processingDataFrameList.filter(dataFrame => {
      return dataFrame.dataFrameId !== data.id
    })
  },
  // 刪除資料源後，去檢查正在建置的資料表當中是不是有被刪除資料源的表
  updateProcessingDataFrameListAfterDeleteDataSource (state, data) {
    state.processingDataFrameList = state.processingDataFrameList.filter(dataFrame => {
      return dataFrame.dataSourceId !== data
    })
  },
  clearProcessingDataFrameList (state, data) {
    state.processingDataFrameList = []
  },
  setProcessingDataColumnList (state, data) {
    state.processingDataColumnList = data
  },
  addProcessingDataColumnList (state, data) {
    state.processingDataColumnList.push(data)
  },
  spliceProcessingDataColumnList (state, index) {
    state.processingDataColumnList.splice(index, 1)
  },
  setShouldDataFrameDataRefetchDataColumn (state, value) {
    state.shouldDataFrameDataRefetchDataColumn = value
  },
  setShouldAdvanceDataFrameSettingRefetchDataColumn (state, value) {
    state.shouldAdvanceDataFrameSettingRefetchDataColumn = value
  }
}
