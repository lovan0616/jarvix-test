import { Message } from 'element-ui'
import i18n from '@/lang/index.js'

export default {
  clearColumnList ({ commit }) {
    commit('setColumnList', null)
  },
  updateFilterListByData ({ state, rootState, commit }, data) {
    if (data.length === 0) return false
    // 判斷要從哪邊開始取代新的
    let newRestriction = {
      status: true,
      restriction: data,
      questionId: rootState.dataSource.currentQuestionId
    }
    let closeFilterIndex = -1
    for (let i = 0; i < state.filterList.length; i++) {
      if (!state.filterList[i].status) {
        closeFilterIndex = i
        break
      }
    }
    let filterList = []
    if (closeFilterIndex > -1) {
      filterList = state.filterList.slice(0, closeFilterIndex)
    }

    filterList = [...state.filterList, newRestriction]
    commit('setFilterList', filterList)
    Message({
      message: i18n.t('message.addFilter'),
      type: 'success',
      duration: 3 * 1000,
      showClose: true
    })
  },
  updateFilterStatusList ({ commit }, statusList) {
    commit('setStatusList', statusList)
  },
  clearAllFilter ({ commit }) {
    commit('clearFilterList')
  }
}
