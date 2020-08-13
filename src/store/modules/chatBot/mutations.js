export default {
  // User 問問題
  addUserConversation (state, data) {
    state.conversationList.push({
      type: 'User',
      text: data
    })

    if (state.conversationList.length > 50) {
      state.conversationList.shift()
    }
  },
  // Robot 回覆
  addSystemConversation (state, {text, options}) {
    state.conversationList.push({
      type: 'System',
      text,
      options
    })

    if (state.conversationList.length > 50) {
      state.conversationList.shift()
    }
  },
  // 清除對話紀錄
  clearConversation (state, data) {
    state.conversationList = []
  },
  updateAnalyzeStatus (state, data) {
    state.isAnalyzing = data
  },
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
  }
}
