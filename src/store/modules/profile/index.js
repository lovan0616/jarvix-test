import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    profile: {},
    languageDefault: 'zh-hant',
    languages: {
      'zh-hans': '简中',
      'zh-hant': '繁中'
    }
  },
  actions,
  mutations,
  getters
}
