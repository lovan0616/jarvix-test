export default {
  setLocale (state, data) {
    // 更新 store
    state.locale = data
    // 更新 localStorage
    localStorage.setItem('locale', data)
  },
  setCurrentRoute (state, data) {
    state.currentRoute = data
  },
  isChangeLangBeforeLogin (state, data) {
    state.changeLangBeforeLogin = data
  },
  updateToken (state, data) {
    state.oldToken = data.oldToken
    state.token = data.newToken
  },
  updateTokenTimestamp (state, data) {
    state.tokenTimestamp = data
  }
}
