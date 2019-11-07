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
  }
}
