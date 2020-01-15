import co from 'co'
import { getBookmarkColumn } from '@/API/Bookmark'

export default {
  changeBookmarkById ({ dispatch, commit, state }, bookmarkId) {
    // 更新 Bookmark 資料
    commit('setBookmarkId', bookmarkId)
    // 清空對話紀錄
    commit('chatBot/clearConversation', null, {root: true})

    return co(function* () {
      yield dispatch('getBookmarkColumnInfo')
      return Promise.resolve(state)
    })
  },
  getBookmarkColumnInfo ({ commit, state }) {
    return getBookmarkColumn(state.bookmarkId).then(response => {
      commit('setBookmarkCloumnInfoList', response)
    })
  }
}
