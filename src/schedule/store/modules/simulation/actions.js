import { newPlan, reSimulate, checkSimulationProgress, cancelSimulationPlan, deleteSimulatedSolution } from '@/schedule/API/Simulation'

export default {
  newPlan ({ state, rootState }) {
    return newPlan({
      projectId: rootState.scheduleSetting.scheduleProjectId,
      orders: state.scheduledJobs,
      solutions: state.solutions
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
  }
}
