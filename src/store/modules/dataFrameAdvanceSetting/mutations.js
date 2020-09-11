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
  setDisplaySection (state, data) {
    state.displaySection = data
  }
}
