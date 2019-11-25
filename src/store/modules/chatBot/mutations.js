export default {
  // User 問問題
  addUserConversation (state, data) {
    console.log(state.conversationList, data)
    state.conversationList.push({
      type: 'User',
      text: data
    })
  },
  // Robot 回覆
  addSystemConversation (state, data) {
    state.conversationList.push({
      type: 'System',
      text: 'test',
      options: data
    })
  },
  // 清除對話紀錄
  clearConversation (state, data) {
    state.conversationList = []
  },
  updateAnalyzeStatus (state, data) {
    state.isAnalyzing = data
  }
}
