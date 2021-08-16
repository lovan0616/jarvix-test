import Vue from 'vue'

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
  setChildrenSolutionBySequence (state, { parentSequence, childData }) {
    const index = state.solutions.findIndex(s => s.sequence === parentSequence)
    const solution = state.solutions[index]
    const hasChildren = solution.children && solution.children.length > 0
    if (hasChildren) {
      const newChildren = [...solution.children, childData]
      Vue.set(solution, 'children', newChildren)
    } else {
      Vue.set(solution, 'children', [childData])
    }
  },
  removeAllChildrenSolution (state) {
    state.solutions.forEach(solution => {
      delete solution.children
    })
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
  setFailedSolutionIds (state, solutionId) {
    state.simulationResult.failedSolutionIds.push(solutionId)
  },
  setSimulationJobs (state, jobs) {
    jobs.forEach(job => {
      Vue.set(state.simulationJobs, job.id, job)
    })
  },
  toggleSimulationJobs (state, jobs, checked) {
    jobs.forEach(job => {
      if (state.simulationJobs[`${job.id}`]) Vue.set(state.simulationJobs[`${job.id}`].frontendInfo, 'checked', checked)
    })
  },
  clearSimulationJobs (state) {
    state.simulationJobs = {}
  },
  setShouldRecalculateSelectedJobs (state, value) {
    state.shouldRecalculateSelectedJobs = value
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
