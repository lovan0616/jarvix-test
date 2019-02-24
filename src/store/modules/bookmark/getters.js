export default {
  bookmark (state) {
    return state.bookmark
  },
  bookmarkId (state) {
    if (state.bookmark) return state.bookmark.id
  },
  bookmarks (state) {
    return state.bookmarks
  },
  suggestions (state) {
    return state.suggestions
  },
  quickstartWithDefaults (state) {
    const defaults = state.quickstartResult.defaults || []
    const quickstarts = state.quickstartResult.quickstarts || []
    const all = defaults.concat(quickstarts)
    return [...Array(state.quickstartNum)].reduce((result, curr, currIndex) => {
      if (all[currIndex]) result.push(all[currIndex])
      return result
    }, [])
  },
  quickstartWithoutDefaults (state) {
    const quickstarts = state.quickstartResult.quickstarts || []
    return [...Array(state.quickstartNum)].reduce((result, curr, currIndex) => {
      if (quickstarts[currIndex]) result.push(quickstarts[currIndex])
      return result
    }, [])
  }
}
