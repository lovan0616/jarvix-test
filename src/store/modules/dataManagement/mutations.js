import Vue from 'vue'

export default {
  updateUploadFileList (state, data) {
    state.uploadFileList = data
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
  clearCurrentUploadInfo (state) {
    state.currentUploadInfo.dataSourceId = null
    state.currentUploadInfo.type = null
    state.currentUploadInfo.name = null
  },
  updateFileUploadSuccess (state, data) {
    state.fileUploadSuccess = data
  },
  updateEtlTableList (state, data) {
    let columnList = data.columns
    if (columnList.length > 0) {
      columnList.forEach((element, index) => {
        let newElement = JSON.parse(JSON.stringify(element))
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
            newValue: '',
            type: 'ERROR_DEFAULT_VALUE',
            active: true
          }
        ])
        Vue.set(element, 'active', true)
      })
    }
    state.etlTableList.push(data)
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
  }
}
