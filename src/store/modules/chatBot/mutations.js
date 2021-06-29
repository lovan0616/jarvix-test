export default {
  updateIsUseAlgorithm (state, data) {
    state.isUseAlgorithm = data
  },
  setDoDrillDown (state, data) {
    state.doDrillDown = data
  },
  setDoClickCorrelation (state, data) {
    state.doClickCorrelation = data
  },
  setParserLanguageList (state, data) {
    state.parserLanguageList = data
  },
  setParserLanguage (state, data) {
    state.parserLanguage = data
  },
  updateHasBasicInfo (state, data) {
    state.hasBasicInfo = data
  },
  setCopiedColumnName(state, data) {
    state.copiedColumnName = data
  },
  clearCopiedColumnName(state, data) {
    state.copiedColumnName = null
  }
}
