import { getPinboardList, getPinboardById, getPinboardTemplate, deletePinboard, createPinboard, updatePinboardName, pinToBoard, unPinById } from '@/API/Pinboard'

export default {
  getPinboardList ({ commit }) {
    return getPinboardList().then(res => {
      commit('setPinboardList', res)
    })
  },
  createPinboard ({dispatch}, data) {
    return createPinboard(data)
  },
  deletePinboard ({ dispatch }, data) {
    return deletePinboard(data).then(() => {
      dispatch('getPinboardList')
    })
  },
  getPinboardById ({commit}, data) {
    return getPinboardById(data)
  },
  getPinboardTemplate ({commit}, data) {
    return getPinboardTemplate(data).then(res => {
      commit('setPinboardInfo', res)
    })
  },
  updatePinboardName ({dispatch}, data) {
    return updatePinboardName(data.id, data.name).then(() => {
      dispatch('getPinboardList')
    })
  },
  pinToBoard ({commit}, data) {
    return pinToBoard(data.id, data.report)
  },
  unPinById ({commit}, data) {
    return unPinById(data)
  }
}
