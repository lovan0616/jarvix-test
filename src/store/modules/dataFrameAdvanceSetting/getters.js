export default {
  selectedColumnList(state) {
    if (state.columnList === null) return null
    // 如果全部欄位都有選
    if (!state.columnList.some(element => !element.isSelected)) return null
    return state.columnList.reduce((acc, cur) => {
      if (cur.isSelected) acc.push(cur.id)
      return acc
    }, [])
  },
  askCondition(state, getters, rootState) {
    return {
      isInit: state.isInit,
      columnList: state.columnList,
      filterList: rootState['dataSource']['filterList']
    }
  }
}