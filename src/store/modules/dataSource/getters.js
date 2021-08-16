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
  },
  getDataSourceName (state) {
    if (state.dataSourceId && state.dataSourceList.length > 0) {
      let selectedDataSource = state.dataSourceList.find(dataSource => dataSource.id === state.dataSourceId)
      return selectedDataSource.name
    }
    return null
  },
  getDataFrameName (state) {
    if (state.dataSourceId && state.dataSourceList.length > 0) {
      if (state.dataFrameId === 'all') {
        return state.dataFrameId
      }
      let selectedDataSource = state.dataSourceList.find(dataSource => dataSource.id === state.dataSourceId)
      let selectedDataFrame = selectedDataSource.dataFrames.find(dataFrame => dataFrame.id === state.dataFrameId)
      return selectedDataFrame && selectedDataFrame.primaryAlias ? selectedDataFrame.primaryAlias : null
    }
    return null
  },
  getOwnProcessingTasks (state, getters, rootState, rootGetters) {
    const userId = rootState.userManagement.userId
    const accountId = rootGetters['userManagement/getCurrentAccountId']
    return state.processingDataColumnList.filter(item => item.userId === userId && item.accountId === accountId)
  }
}
