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
      return element.restriction
    })
  },
  filterStatusList (state) {
    if (state.filterList.length === 0) return []
    return state.filterList.map(element => {
      return element.status
    })
  },
  drillDownQuestionId (state) {
    let currentFilter = state.filterList.filter(element => element.status)
    if (currentFilter.length === 0) {
      return null
    } else {
      return currentFilter[currentFilter.length - 1].questionId
    }
  },
  dataSourceList (state) {
    let isDemoEnd = localStorage.getItem('isDemoEnd')
    if (isDemoEnd) {
      return state.dataSourceList
    } else {
      let demoDatasource = localStorage.getItem('demoDatasource') || 'molding_foxconn_predict'
      return state.dataSourceList.reduce((res, curr) => {
        if (curr.name === demoDatasource) return res
        res.push(curr)
        return res
      }, [])
    }
  }
}
