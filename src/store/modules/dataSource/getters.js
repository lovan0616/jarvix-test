export default {
  // 取得所有有資料表處理中或排隊中的資料源
  dataSourceBuildingStatusList (state) {
    return state.dataSourceList.reduce((acc, cur) => {
      if (!cur.processDataFrameCount && !cur.pendingDataFrameCount) return acc
      acc.push({
        id: cur.id,
        enableDataFrameCount: cur.enableDataFrameCount,
        name: cur.name,
        processDataFrameCount: cur.processDataFrameCount
      })
      return acc
    }, [])
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
    // FIXME for poc/foxconn_molding
    let demoMode = localStorage.getItem('demoMode')
    let isDemoEnd = localStorage.getItem('isDemoEnd')
    if (!demoMode || isDemoEnd) {
      return state.dataSourceList
    } else {
      let demoDatasource = localStorage.getItem('demoDatasource') || '富士康_輪廓型分析_molding_預測'
      return state.dataSourceList.reduce((res, curr) => {
        if (curr.name === demoDatasource) return res
        res.push(curr)
        return res
      }, [])
    }
  },
  currentDataFrameId (state) {
    return state.dataFrameId === 'all' ? '' : state.dataFrameId
  }
}
