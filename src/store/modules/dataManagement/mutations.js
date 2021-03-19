import Vue from 'vue'

export default {
  updateUploadFileList (state, data) {
    state.uploadFileList = data
  },
  updateUploadFileTabDetail (state, data) {
    // this.$set(state.uploadFileList[data.index], 'tabDetail', data.tabDetail)
    state.uploadFileList[data.index].tabDetail = data.tabDetail
  },
  updateUploadFileStatus (state, data) {
    const {index, status, ...fileInfo} = data
    state.uploadFileList[index].status = status
    // 預設選第一個 tab
    if (fileInfo.tabDetails.length > 0) fileInfo.tabDetail = fileInfo.tabDetails[0]
    state.uploadFileList[index] = {...state.uploadFileList[index], ...fileInfo}
  },
  removeUploadFile (state, data) {
    state.uploadFileList.splice(data, 1)
  },
  updateShowCreateDataSourceDialog (state, data) {
    state.showCreateDataSourceDialog = data
  },
  updateCurrentUploadInfo (state, data) {
    state.currentUploadInfo = data
  },
  updateCurrentUploadDataType (state, data) {
    state.currentUploadInfo.type = data
  },
  updateCurrentUploadDataSourceName (state, data) {
    state.currentUploadInfo.name = data
  },
  updateCurrentUploadDataSourceId (state, data) {
    state.currentUploadInfo.dataSourceId = data
  },
  updateCurrentConnectionDB (state, data) {
    state.currentUploadInfo.db = data
  },
  clearCurrentUploadInfo (state) {
    state.currentUploadInfo.dataSourceId = null
    state.currentUploadInfo.type = null
    state.currentUploadInfo.name = null
    state.currentUploadInfo.db = null
  },
  updateFileUploadSuccess (state, data) {
    state.fileUploadSuccess = data
  },
  updateEtlTableList (state, data) {
    // 如果為再編輯的 dataFrame 就不需要再處理，直接 set
    if (!Object.prototype.hasOwnProperty.call(data, 'enableEdit')) {
      if (localStorage.getItem('isShowDistributedSetting') === 'true') {
        Vue.set(data, 'isDistributed', false)
        Vue.set(data, 'distributedColumnName', null)
      }
      let columnList = data.columns
      if (columnList.length > 0) {
        columnList.forEach((element, index) => {
          let newElement = JSON.parse(JSON.stringify(element))
          Vue.set(element, 'hasChanged', false)
          Vue.set(element, 'index', index)
          Vue.set(element, 'targetDataType', newElement.originalDataType)
          Vue.set(element, 'originalStatsType', newElement.statsType)
          Vue.set(element, 'values', [
            {
              value: null,
              newValue: null,
              type: 'MISSING_VALUE',
              active: true
            },
            {
              value: '',
              newValue: null,
              type: 'MISSING_VALUE',
              active: true
            },
            {
              value: null,
              newValue: null,
              type: 'ERROR_DEFAULT_VALUE',
              active: true
            }
          ])
          Vue.set(element, 'active', true)
        })
      }
    }
    state.etlTableList.push(data)
  },
  updateIsDistributed (state, data) {
    state.etlTableList[state.currentTableIndex].isDistributed = data
  },
  updateDistributedColumnName (state, data) {
    state.etlTableList[state.currentTableIndex].distributedColumnName = data
  },
  updateReplaceValue (state, data) {
    let {tableIndex, columnIndex, info} = data
    Vue.set(state.etlTableList[tableIndex].columns, columnIndex, info)
  },
  clearEtlTableList (state, data) {
    state.etlTableList = []
  },
  chooseColumn (state, data) {
    let {dataFrameIndex, columnIndex} = data
    let column = state.etlTableList[dataFrameIndex].columns[columnIndex]
    column.active = !column.active
  },
  changeCurrentTableIndex (state, index) {
    state.currentTableIndex = index
  },
  changeCurrentColumnIndex (state, index) {
    state.currentColumnIndex = index
  },
  updateSummaryInfo (state, data) {
    let {tableIndex, columnIndex, dataSummary} = data
    Vue.set(state.etlTableList[tableIndex].columns[columnIndex], 'dataSummary', dataSummary)
  },
  updateCurrentUploadScriptInfo (state, data) {
    state.currentUploadScriptInfo = data
  },
  updateScriptName (state, data) {
    state.currentUploadScriptName = data
  },
  clearCurrentUploadScriptInfo(state) {
    state.currentUploadScriptInfo = {
      scriptId: null,
      dataframeId: null,
      type: null,
      ioArgs: {}
    }
  },
  updateDatetimePatterns (state, data) {
    state.datetimePatterns = data
  },
  clearDatetimePatterns (state) {
    state.datetimePatterns = []
  }
}
