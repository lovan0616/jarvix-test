export default {
  setPinboardList (state, data) {
    state.pinboardList = data
  },
  setPinboardInfo (state, data) {
    state.pinboardInfo = data
  },
  deletePinboardById (state, data) {
    state.pinboardInfo = state.pinboardInfo.filter(element => {
      return element.id !== data
    })
  }
}
