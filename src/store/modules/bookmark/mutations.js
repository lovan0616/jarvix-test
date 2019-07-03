export default {
  setIsInit (state, value) {
    state.isInit = value || false
  },
  setBookmarkId (state, id) {
    state.bookmarkId = id
  },
  setBookmarkList (state, bookmarks) {
    state.bookmarkList = bookmarks || []
  },
  setSuggestions (state, suggestions) {
    state.suggestions = suggestions || {}
  },
  setQuickStart (state, result) {
    state.quickstartResult = result || {}
  },
  setAppQuestion (state, data) {
    state.appQuestion = data
  },
  setQuestionResult (state, data) {
    state.questionResult = data
  },
  setHistoryQuestionList (state, data) {
    state.historyQuestionList = data
  },
  setCurrentResultDisplayType (state, data) {
    state.currentResultDisplayType = data
  }
}
