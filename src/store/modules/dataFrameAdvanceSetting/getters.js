export default {
  getSelectedColumnList(state) {
    if (state.columnList.length === 0) return null
    return state.columnList.filter(column => {
      if (!column.isSelected) return
      return column.id
    })
  }
}