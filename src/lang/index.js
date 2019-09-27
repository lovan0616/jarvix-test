import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhHant from './zh-hant.json'
import zhHans from './zh-hans.json'

Vue.use(VueI18n)
const locale = 'zh-hant'
const messages = {
  'zh-hant': zhHant,
  'zh-hans': zhHans
}

const i18n = new VueI18n({
  /** 默认值 */
  locale,
  messages
})

export default i18n
