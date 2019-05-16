import * as types from './mutation_type'
export default {
  [types.SET_ISINIT] (state, value) {
    state.isInit = value || false
  },
  [types.SET_BOOKMARK] (state, bookmark) {
    state.bookmark = bookmark || undefined
  },
  [types.SET_BOOKMARKS] (state, bookmarks) {
    state.bookmarks = bookmarks || []
  },
  [types.SET_SUGGESTIONS] (state, suggestions) {
    state.suggestions = suggestions || {}
  },
  [types.SET_QUICKSTART_RESULT] (state, result) {
    state.quickstartResult = result || {}
  },
  setAppQuestion (state, data) {
    state.appQuestion = data
  },
  setBookmarkId (state, data) {
    state.bookmark.id = data
  }
}
