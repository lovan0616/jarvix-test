export default {
  setPinboardList (state, data) {
    state.pinboardList = data
  },
  setGroupPinboardList (state, data) {
    state.groupPinboardList = data
  },
  setPinboardInfo (state, data) {
    state.pinboardInfo = data
  },
  setGroupPinboardInfo (state, data) {
    state.groupPinboardInfo = data
  },
  deletePinboardById (state, data) {
    state.pinboardInfo = state.pinboardInfo.filter(element => {
      return element.id !== data
    })
  }
}
