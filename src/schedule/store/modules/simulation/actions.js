import { newPlan, reSimulate, checkSimulationProgress, cancelSimulationPlan, deleteSimulatedSolution } from '@/schedule/API/Simulation'
import { dataSync, checkDataSyncProgress, cancelDataSync } from '@/schedule/API/DataSynchronization'

export default {
  newPlan ({ state }) {
    return newPlan({
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
  dataSync (state) {
    return dataSync()
  },
  checkDataSyncProgress (state) {
    return checkDataSyncProgress()
  },
  cancelDataSync (state) {
    return cancelDataSync()
  }
}
