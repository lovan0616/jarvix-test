export default {
  updateSetting (state, newSetting) {
    state.defaultSetting = newSetting
  },
  setEquipments (state, equipments) {
    state.equipments = equipments
  },
  setProjects (state, projects) {
    state.scheduleProjects = projects
  },
  setCurrentProjectId (state, id) {
    state.scheduleProjectId = id
  },
  setIsShowScheduleHelper (state, value) {
    state.isShowScheduleHelper = value
  }
}
