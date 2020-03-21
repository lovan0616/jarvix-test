export default {
  addAlgorithm (state, data) {
    state.algorithms.push(data)
  },
  deleteAlgorithm (state, data) {
    let res = []
    state.algorithms.forEach(item => {
      if (item === data) return
      res.push(item)
    })
    state.algorithms = res
  }
}
