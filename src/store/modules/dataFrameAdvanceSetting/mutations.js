export default {
  toggleIsInit (state, data) {
    state.isInit = data
  },
  toggleSettingBox (state, data) {
    state.isShowSettingBox = data
  },
  setColumnList (state, data) {
    state.columnList = data
  },
  setFilterList (state, data) {
    state.filterList = data
  },
  setStatusList (state, data) {
    state.filterList.forEach((filter, index) => {
      state.filterList[index].status = data[index]
    })
  },
  clearFilterList (state) {
    state.filterList = []
  },
  setDisplaySection (state, data) {
    state.displaySection = data
  },
  setShouldAdvanceDataFrameSettingRefetchDataColumn (state, value) {
    state.shouldAdvanceDataFrameSettingRefetchDataColumn = value
  }
}
