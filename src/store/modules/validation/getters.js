export default {
  fieldCommonMaxLength: (state, getters, rootState) => {
    const locale = rootState.setting.locale
    switch(locale) {
      case 'zh-TW':
      case 'zh-CN':
        return state.fieldCommonMaxLengthZh
      case 'en-US':
        return state.fieldCommonMaxLengthEn
      default: state.fieldCommonMaxLengthDefault
    }
  }
}