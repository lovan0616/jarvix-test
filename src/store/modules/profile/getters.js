export default {
  profile (state) {
    return state.profile
  },
  language (state) {
    return state.profile.language || state.languageDefault
  },
  languages (state) {
    return state.languages
  },
  languageDefault (state) {
    return state.languageDefault
  }
}
