export default {
  setLocale (state, data) {
    // 更新 store
    state.locale = data
    // 更新 localStorage
    localStorage.setItem('locale', data)
  }
}
