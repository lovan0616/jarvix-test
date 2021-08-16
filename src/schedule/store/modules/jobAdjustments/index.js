import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    adjustedJobs: {}, // 待模擬的調整
    adjustedHistory: {} // 已模擬的調整
  },
  mutations
}
