import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    solutions: [],
    simulationJobs: {},
    shouldRecalculateSelectedJobs: false,
    scheduledJobs: [],
    planId: null,
    simulationResult: {
      completedSolutionIds: [],
      failedSolutionIds: [],
      inProgressIds: []
    },
    searchOrderNumber: null,
    orderPeriod: [],
    selectAllOrders: false,
    searchOrderCount: 0
  },
  mutations,
  actions
}
