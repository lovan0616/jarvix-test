export default {
  setPinboardList (state, data) {
    state.pinboardList = data
  },
  deletePinboard (state, data) {
    state.pinboardList = state.pinboardList.filter(element => {
      return element.id !== data
    })
  }
}
