export default {
  // 是否有資料源正在處理中
  isDataSourceBuilding (state) {
    let isBuilding = false
    state.dataSourceList.forEach(element => {
      if (element.state === 'PROCESSING') isBuilding = true
    })
    return isBuilding
  },
  // 過濾掉狀態實際送往後端的資料
  filterRestrictionList (state) {
    if (state.filterList.length === 0) return []
    return state.filterList.map(element => {
      return element.restriction
    })
  },
  filterStatusList (state) {
    if (state.filterList.length === 0) return []
    return state.filterList.map(element => {
      return element.status
    })
  }
}
