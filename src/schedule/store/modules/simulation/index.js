import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    solutions: [],
    scheduledJobs: [],
    planId: null,
    simulationResult: {
      completedSolutionIds: [],
      failedSolutionIds: [],
      inProgressIds: []
    }
  },
  mutations,
  actions
}
