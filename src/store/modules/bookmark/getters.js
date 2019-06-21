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
  findBookmarkById (state) {
    return keyword => {
      return state.bookmarks.find(element => {
        return element.id === parseInt(keyword)
      }).name
    }
  }
}
