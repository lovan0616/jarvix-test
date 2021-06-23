export default {
  addSolution (state, newSolution) {
    state.solutions.unshift(newSolution)
  },
  updateSolutionBySequence (state, { sequence, data }) {
    const index = state.solutions.findIndex(s => s.sequence === sequence)
    state.solutions[index] = data
  },
  updateSolutionValidStatusBySequence (state, { sequence, isValid }) {
    const index = state.solutions.findIndex(s => s.sequence === sequence)
    state.solutions[index].valid = isValid
  },
  removeSolution (state, index) {
    state.solutions.splice(index, 1)
  },
  setSolutions (state, solutions) {
    state.solutions = solutions
  },
  setPlanId (state, planId) {
    state.planId = planId
  },
  updateScheduledJobs (state, scheduledJobs) {
    state.scheduledJobs = scheduledJobs
  },
  setSimulationResult (state, result) {
    state.simulationResult = result
  },
  setSearchOrderNumber (state, orderNumber) {
    state.searchOrderNumber = orderNumber
  },
  setOrderPeriod (state, period) {
    state.orderPeriod = period
  },
  setSelectAllOrders (state, selected) {
    state.selectAllOrders = selected
  },
  setSearchOrderCount (state, count) {
    state.searchOrderCount = count
  }
}
