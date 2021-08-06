import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zh-CN.json'
import zhTW from './zh-TW.json'
import enUS from './en-US.json'
import viVN from './vi-VN.json'
import scheduleTW from '@/schedule/lang/zh-TW.json'
import scheduleCN from '@/schedule/lang/zh-CN.json'
import scheduleEN from '@/schedule/lang/en-US.json'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'
import viVNLocale from 'element-ui/lib/locale/lang/vi'

// Todo: 排程越南文暫時以中文檔替代，待越南文完成需置換
Vue.use(VueI18n)
const locale = 'zh-TW'
const messages = {
  'zh-CN': { ...zhCN, ...scheduleCN, ...zhCNLocale },
  'zh-TW': { ...zhTW, ...scheduleTW, ...zhTWLocale },
  'en-US': { ...enUS, ...scheduleEN, ...enLocale },
  'vi-VN': { ...viVN, ...scheduleCN, ...viVNLocale }
}

const i18n = new VueI18n({
  /** 默认值 */
  locale,
  messages
})

export default i18n
