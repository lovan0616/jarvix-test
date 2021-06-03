export default {
  getCurrentProject (state) {
    return state.scheduleProjects.find(item => item.id === state.scheduleProjectId)
  },
  // 鈺齊排程
  isYKSchedule () {
    return true
  }
}