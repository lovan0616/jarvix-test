export default {
  getSelectedColumnList(state) {
    if (state.columnList.length === 0) return null
    return state.columnList.reduce((acc, cur) => {
      if (cur.isSelected) acc.push(cur.id)
      return acc
    }, [])
  }
}