import { getPinboardList, getGroupPinboardList, getPinboardById, deletePinboard, deleteGroupPinboard, createPinboard, createGroupPinboard, updatePinboardName, updateGroupPinboardName, pinToBoard, unPinById } from '@/API/Pinboard'

export default {
  getPinboardList ({ commit }) {
    return getPinboardList().then(res => {
      commit('setPinboardList', res)
    })
  },
  getGroupPinboardList ({ commit }, groupId) {
    return getGroupPinboardList().then(res => {
      commit('setGroupPinboardList', res)
    })
  },
  createPinboard (data) {
    return createPinboard(data)
  },
  createGroupPinboard (data) {
    return createGroupPinboard(data.name, data.groupId)
  },
  deletePinboard ({ dispatch }, data) {
    return deletePinboard(data).then(() => {
      dispatch('getPinboardList')
    })
  },
  deleteGroupPinboard ({ dispatch }, data) {
    return deleteGroupPinboard(data.groupId, data.id).then(() => {
      dispatch('getGroupPinboardList')
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
  updateGroupPinboardName ({dispatch}, data) {
    return updateGroupPinboardName(data.id, data.groupId, data.name).then(() => {
      dispatch('getGroupPinboardList')
    })
  },
  pinToBoard ({commit}, data) {
    return pinToBoard(data)
  },
  unPinById ({commit}, data) {
    return unPinById(data)
  }
}
