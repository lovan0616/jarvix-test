import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import i18n from '@/lang/index.js'
export default {
  namespaced: true,
  state: {
    locale: null,
    languageDefault: 'zh-hant',
    languages: {
      'zh-hans': i18n.t('lang', 'zh-hans'),
      'zh-hant': i18n.t('lang', 'zh-hant')
    }
  },
  actions,
  mutations,
  getters
}
