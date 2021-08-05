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
  setIsManuallyTriggeredAskQuestion (state, data) {
    state.isManuallyTriggeredAskQuestion = data
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
  setCurrentQuestionDataFrameId (state, data) {
    state.currentQuestionDataFrameId = data
  },
  setAlgoConfig (state, data) {
    state.algoConfig = data
  },
  resetAlgoConfig (state) {
    state.algoConfig.clustering.clusteringCount = null
    state.algoConfig.prediction.predictionIntervalLength = '4'
    state.algoConfig.standardLineType = 'MEDIAN'
    state.algoConfig.stddevTimes = 3
  },
  setClusteringInfo (state, data) {
    state.clusteringInfo = data
  },
  resetClusteringInfo (state) {
    state.clusterList = []
    state.hasOutlier = false
  },
  setDataFrameList (state, data) {
    state.dataFrameList = data
  },
  setDataFrameId (state, id) {
    state.dataFrameId = id
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
      message: i18n.t(messageString, { name: data.primaryAlias }),
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
  }
}
