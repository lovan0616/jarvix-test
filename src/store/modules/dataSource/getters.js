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
    // 先過濾出啟用的，再取得限制條件
    return state.filterList.filter(element => element.status).map(element => {
      element.restriction.map(restrict => {
        if (restrict.type === 'enum') {
          // 移除掉顯示用的 index
          let properties = JSON.parse(JSON.stringify(restrict.properties))
          delete properties.display_index
          restrict.properties = properties
          return restrict
        } else {
          return restrict
        }
      })
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
