import { newPlan, reSimulate, checkSimulationProgress, cancelSimulationPlan, deleteSimulatedSolution } from '@/schedule/API/Simulation'

export default {
  newPlan ({ state, rootState }) {
    return newPlan({
      projectId: rootState.scheduleSetting.scheduleProjectId,
      orders: state.scheduledJobs,
      solutions: state.solutions
    })
  },
  yukiNewPlan ({ state, rootState }) {
    return newPlan({
      projectId: rootState.scheduleSetting.scheduleProjectId,
      orders: state.scheduledJobs,
      solutions: state.solutions,
      allOrder: state.selectAllOrders,
      ...(state.searchOrderNumber ? {
        orderNumber: state.searchOrderNumber
      } : ''),
      ...(state.orderPeriod.length > 0 ? {
        startDate: state.orderPeriod[0],
        endDate: state.orderPeriod[1]
      } : ''),
      returnOrders: false
    })
  },
  checkSimulationProgress ({ state }) {
    return checkSimulationProgress(state.planId)
  },
  cancelSimulationPlan ({ state }) {
    return cancelSimulationPlan(state.planId)
  },
  reSimulate ({ state }) {
    return reSimulate({
      planId: state.planId,
      solutions: state.solutions.filter(s => !s.simulated)
    })
  },
  deleteSimulatedSolution ({ state }, solutionId) {
    return deleteSimulatedSolution(state.planId, solutionId)
  },
  resetSimulationProgress ({ commit }) {
    commit('setSolutions', [])
    commit('setPlanId', null)
    commit('setSimulationResult', {
      completedSolutionIds: [],
      failedSolutionIds: [],
      inProgressIds: []
    })
  }
}
