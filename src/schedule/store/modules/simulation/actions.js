import { newPlan, reSimulate, checkSimulationProgress, cancelSimulationPlan, deleteSimulatedSolution } from '@/schedule/API/Simulation'

export default {
  newPlan ({ state, rootState }) {
    const orders = Object
      .values(state.simulationJobs)
      .filter(job => job.frontendInfo.checked)
      .map(job => {
        const copiedJob = JSON.parse(JSON.stringify(job))
        // 移除 選擇工單中前端用來紀錄使用者操作狀態的屬性
        delete copiedJob.frontendInfo
        return copiedJob
      })
    return newPlan({
      projectId: rootState.scheduleSetting.scheduleProjectId,
      orders,
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
