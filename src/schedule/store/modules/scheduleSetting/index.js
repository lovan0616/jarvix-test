import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    scheduleProjects: [],
    scheduleProjectId: null,
    defaultSetting: null,
    equipments: null
  },
  actions,
  mutations
}
