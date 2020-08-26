import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zh-CN.json'
import zhTW from './zh-TW.json'
import enUS from './en-US.json'
import scheduleTW from '@/schedule/lang/zh-TW.json'

Vue.use(VueI18n)
const locale = 'zh-TW'
const messages = {
  'zh-CN': zhCN,
  'zh-TW': {...zhTW, ...scheduleTW},
  'en-US': enUS
}

const i18n = new VueI18n({
  /** 默认值 */
  locale,
  messages
})

export default i18n
