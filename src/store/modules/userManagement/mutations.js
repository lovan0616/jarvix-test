export default {
  setUserInfo (state, data) {
    state.userName = data.userName
    state.accountList = data.accountList
    state.accountPermission = data.accountPermission
    state.groupList = data.groupList
    state.groupPermission = data.groupPermission
  },
  clearUserInfo (state) {
    state.userName = ''
    state.accountList = []
    state.accountPermission = []
    state.groupList = []
    state.groupPermission = []
  },
  updateUserGroupInfo (state, data) {
    state.groupList = data.groupList
    state.groupPermission = data.groupPermission
  }
}
