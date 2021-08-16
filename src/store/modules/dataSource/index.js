import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    dataSourceList: [],
    dataSourceId: null,
    dataSourceColumnInfoList: [],
    dataSourceDataValueList: [],
    appQuestion: null,
    currentQuestionInfo: null,
    currentQuestionId: null,
    currentQuestionDataFrameId: null,
    isManuallyTriggeredAskQuestion: false,
    algoConfig: {
      clustering: {
        '@type': 'ClusterAlgoConfig',
        clusteringCount: null
      },
      prediction: {
        '@type': 'PredictionAlgoConfig',
        predictionIntervalLength: '4'
      },
      anomaly: {
        '@type': 'AnomalyAlgoConfig',
        standardLineType: 'MEDIAN',
        stddevTimes: 3
      },
      stability: {
        '@type': 'StandardLineAlgoConfig',
        standardLineType: 'MEDIAN'
      },
      formula: {
        '@type': 'FormulaAlgoConfig'
      }
    },
    clusteringInfo: {
      clusterList: [],
      hasOutlier: false
    },
    historyQuestionList: [],
    dataFrameId: null,
    dataFrameList: [],
    // 使用者自己建立的資料源
    processingDataFrameList: [],
    processingDataColumnList: [],
    // 新增或刪除欄位時，通知相關組件重新fetch欄位的flag
    shouldDataFrameDataRefetchDataColumn: null
  },
  actions,
  mutations,
  getters
}
