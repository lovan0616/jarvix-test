export default {
  // User 問問題
  addUserConversation (state, data) {
    state.conversationList.push({
      type: 'User',
      text: data
    })
  },
  // Robot 回覆
  addSystemConversation (state, {text, options}) {
    state.conversationList.push({
      type: 'System',
      text,
      options
    })
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
  }
}
