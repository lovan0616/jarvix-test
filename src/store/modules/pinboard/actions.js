import { getPinboardList, getPinboardById, deletePinboard, createPinboard, updatePinboardName, pinToBoard, unPinById } from '@/API/Pinboard'

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
  updatePinboardName ({dispatch}, data) {
    return updatePinboardName(data.id, data.name).then(() => {
      dispatch('getPinboardList')
    })
  },
  pinToBoard ({commit}, data) {
    return pinToBoard(data)
  },
  unPinById ({commit}, data) {
    return unPinById(data)
  }
}
