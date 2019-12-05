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
  setDataSourceCloumnInfoList (state, data) {
    state.dataSourceCloumnInfoList = data
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
  setFilterList (state, data) {
    state.filterList.push(data)
  },
  clearFilterList (state) {
    state.filterList = []
  },
  insertFilterList (state, data) {
    state.filterList.push(data)
  },
  setStatusList (state, data) {
    state.filterList.forEach((filter, index) => {
      state.filterList[index]['status'] = data[index]
    })
  }
}
