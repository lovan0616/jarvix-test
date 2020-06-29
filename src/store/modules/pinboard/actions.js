import { getPinboardList, getGroupPinboardList, getPinboardById, deletePinboard, deleteGroupPinboard, createPinboard, createGroupPinboard, updatePinboardName, updateGroupPinboardName, pinToBoard, unPinById, sortPinboard } from '@/API/Pinboard'

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
  createPinboard ({ state }, data) {
    return createPinboard(data)
  },
  createGroupPinboard ({ state }, data) {
    return createGroupPinboard(data)
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
    console.log(data)
    return updatePinboardName(data.name, data.userId, data.id).then(() => {
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
  },
  sortPinboard (folderId, pinbordList) {
    return sortPinboard(folderId, pinbordList)
  }
}
