import { getProfile, setProfile } from '@/API/Profile'

export default {
  initProfile ({ dispatch, commit, state }) {
    return getProfile().then(res => {
      let language = res.language
      let availableLanguange = Object.keys(state.languages).indexOf(language) !== -1
      let profile = { ...res }
      if (!availableLanguange) {
        language = state.languageDefault
        profile = { ...res, language } || {}
      }
      return dispatch('setProfile', profile)
    })
  },
  setProfile ({commit}, profile) {
    return setProfile(profile).then(res => {
      commit('setProfile', res || {})
    })
  },
  updateLanguage ({dispatch, state}, language) {
    let profile = { ...state.profile, language }
    dispatch('setProfile', profile)
  }
}
