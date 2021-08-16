import Vue from 'vue'

export default {
  setAdjustedJobsByJobName (state, adjustedJob) {
    Vue.set(state.adjustedJobs, `${adjustedJob.jobName}`, adjustedJob)
  },
  clearAdjustedJobs (state) {
    state.adjustedJobs = {}
  },
  setAdjustedHistory (state, { childSequence, adjustHistory }) {
    Vue.set(state.adjustedHistory, childSequence, adjustHistory)
  },
  clearAdjustedHistory (state) {
    state.adjustedHistory = {}
  },
  resetAdjustJobProgress (state) {
    state.adjustedJobs = {}
    state.adjustedHistory = {}
  }
}
