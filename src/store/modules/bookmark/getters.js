export default {
  bookmarkId (state) {
    return state.bookmarkId
  },
  bookmarkList (state) {
    return state.bookmarkList
  },
  appQuestion (state) {
    return state.appQuestion
  },
  suggestions (state) {
    return state.suggestions
  },
  quickstartWithDefaults (state) {
    const defaults = state.quickstartResult.defaults || []
    const quickstarts = state.quickstartResult.quickstarts || []
    const all = defaults.concat(quickstarts)

    return all.slice(0, state.quickstartNum)
  },
  quickstartWithoutDefaults (state) {
    const quickstarts = state.quickstartResult.quickstarts || []
    return [...Array(state.quickstartNum)].reduce((result, curr, currIndex) => {
      if (quickstarts[currIndex]) result.push(quickstarts[currIndex])
      return result
    }, [])
  },
  // 是否有資料源正在處理中
  isBookmarkBuilding (state) {
    let isBuilding = false
    state.bookmarkList.forEach(element => {
      if (element.build_status) isBuilding = true
    })
    return isBuilding
  }
}
