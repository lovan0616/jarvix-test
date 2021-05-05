export default {
  getCurrentProject (state) {
    return state.scheduleProjects.find(item => item.id === state.scheduleProjectId)
  }
}