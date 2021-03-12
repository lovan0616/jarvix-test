import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    scheduleProjects: [],
    scheduleProjectId: null,
    defaultSetting: null,
    equipments: null,
    isShowScheduleHelper: false
  },
  actions,
  mutations,
  getters
}
