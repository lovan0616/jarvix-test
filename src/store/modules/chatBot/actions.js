import { askChatBot } from '@/API/ChatBot'

export default {
  askForChatBot ({commit, rootState}, data) {
    askChatBot({'question': data, 'bookmark_id': rootState.bookmark.bookmarkId, 'chatbot_id': null, 'action_tag': null}).then(res => {
      commit('addSystemConversation', res.respond)
    })
  }
}
