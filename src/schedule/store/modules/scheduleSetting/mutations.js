export default {
  updateSetting (state, newSetting) {
    state.defaultSetting = newSetting
  },
  setEquipments (state, equipments) {
    state.equipments = equipments
  },
  setCurrentProjectId (state, id) {
    state.scheduleProjectId = id
  }
}
