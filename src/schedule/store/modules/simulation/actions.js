import { newPlan, reSimulate, checkSimulationProgress, cancelSimulationPlan, deleteSimulatedSolution } from '@/schedule/API/Simulation'
import { dataSync, checkDataSyncProgress, cancelDataSync } from '@/schedule/API/DataSynchronization'

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
  },
  dataSync ({ rootState }) {
    return dataSync({
      projectId: rootState.scheduleSetting.scheduleProjectId
    })
  },
  checkDataSyncProgress ({ rootState }) {
    return checkDataSyncProgress(rootState.scheduleSetting.scheduleProjectId)
  },
  cancelDataSync ({ rootState }) {
    return cancelDataSync({
      projectId: rootState.scheduleSetting.scheduleProjectId
    })
  }
}
