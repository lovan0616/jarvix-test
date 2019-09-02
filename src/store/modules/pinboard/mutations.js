export default {
  setPinboardList (state, data) {
    state.pinboardList = data
  },
  setPinboardInfo (state, data) {
    state.pinboardInfo = data
  },
  unPinById (state, data) {
    state.pinboardInfo.templates = state.pinboardInfo.templates.filter(element => {
      return element.id !== data
    })
  }
}
