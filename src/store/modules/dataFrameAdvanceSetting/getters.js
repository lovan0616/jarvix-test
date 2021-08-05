export default {
  selectedColumnList (state) {
    if (state.columnList === null) return null
    // 如果全部欄位都有選
    if (state.columnList.every(element => element.isSelected)) return null
    return state.columnList
      .filter(element => element.isSelected)
      .map(element => element.id)
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
  askCondition (state, getters) {
    return {
      isInit: state.isInit,
      columnList: state.columnList,
      filterList: state.filterList
    }
  }
}
