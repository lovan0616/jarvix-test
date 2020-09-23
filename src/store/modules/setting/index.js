import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import i18n from '@/lang/index.js'
export default {
  namespaced: true,
  state: {
    locale: null,
    languageDefault: 'zh-CN',
    languages: {
      'zh-TW': i18n.t('lang', 'zh-TW'),
      'zh-CN': i18n.t('lang', 'zh-CN'),
      'en-US': i18n.t('lang', 'en-US')
    },
    currentRoute: {},
    changeLangBeforeLogin: false,
    token: null,
    tokenTimestamp: null
  },
  actions,
  mutations,
  getters
}
