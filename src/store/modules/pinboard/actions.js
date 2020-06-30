import { getPinboardList, getGroupPinboardList, getPinboardById, deletePinboard, deleteGroupPinboard, createPinboard, createGroupPinboard, updatePinboardName, updateGroupPinboardName, pinToBoard, unPinById, sortPinboard } from '@/API/Pinboard'

export default {
  getPinboardList ({ commit }) {
    return getPinboardList().then(res => {
      commit('setPinboardList', res)
    })
  },
  getGroupPinboardList ({ commit }, groupId) {
    return getGroupPinboardList(groupId).then(res => {
      commit('setGroupPinboardList', res)
    })
  },
  createPinboard ({ state }, data) {
    return createPinboard(data)
  },
  createGroupPinboard ({ state }, data) {
    return createGroupPinboard(data)
  },
  deletePinboard ({ dispatch }, data) {
    return deletePinboard(data.accountId, data.id).then(() => {
      dispatch('getPinboardList')
    })
  },
  deleteGroupPinboard ({ dispatch }, data) {
    return deleteGroupPinboard(data.groupId, data.id).then(() => {
      dispatch('getGroupPinboardList', data.groupId)
    })
  },
  getPinboardById ({commit}, data) {
    return getPinboardById(data)
  },
  updatePinboardName ({dispatch}, data) {
    return updatePinboardName(data.id, data.name, data.accountId).then(() => {
      dispatch('getPinboardList')
    })
  },  
  updateGroupPinboardName ({dispatch}, data) {
    return updateGroupPinboardName(data.id, data.name, data.groupId).then(() => {
      dispatch('getGroupPinboardList', data.groupId)
    })
  },
  pinToBoard ({commit}, data) {
    return pinToBoard(data)
  },
  unPinById ({commit}, data) {
    return unPinById(data)
  },
  sortPinboard ({ state }, pinbordList) {
    return sortPinboard(pinbordList)
  }
}
