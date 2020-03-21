import { getPinboardList, getPinboardById, deletePinboard, createPinboard, updatePinboardName, pinToBoard, unPinById } from '@/API/Pinboard'

export default {
  addAlgorithm ({ commit, state }, data) {
    commit('addAlgorithm', data)
    localStorage.setItem('algorithms', JSON.stringify(state.algorithms))
  },
  deleteAlgorithm ({ commit, state }, data) {
    commit('deleteAlgorithm', data)
    localStorage.setItem('algorithms', JSON.stringify(state.algorithms))
  },
}
