import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zh-CN.json'
import zhTW from './zh-TW.json'
import enUS from './en-US.json'
import scheduleTW from '@/schedule/lang/zh-TW.json'
import scheduleCN from '@/schedule/lang/zh-CN.json'
import scheduleEN from '@/schedule/lang/en-US.json'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)
const locale = 'zh-TW'
const messages = {
  'zh-CN': { ...zhCN, ...scheduleCN, ...zhCNLocale },
  'zh-TW': { ...zhTW, ...scheduleTW, ...zhTWLocale },
  'en-US': { ...enUS, ...scheduleEN, ...enLocale }
}

const i18n = new VueI18n({
  /** 默认值 */
  locale,
  messages
})

export default i18n
