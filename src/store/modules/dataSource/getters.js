export default {
  // 是否有資料源正在處理中
  isDataSourceBuilding (state) {
    let isBuilding = false
    state.dataSourceList.forEach(element => {
      if (element.state === 'PROCESSING') isBuilding = true
    })
    return isBuilding
  }
}
