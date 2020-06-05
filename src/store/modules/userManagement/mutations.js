export default {
  setUserInfo (state, data) {
    state.userName = data.userName
    state.accountList = data.accountList
    state.groupList = data.groupList
    state.permission = data.permission
    state.license = data.license
  },
  setLicenseCurrentUser (state, data) {
    state.license.currentUser = data
  },
  setLicenseCurrentDataStorageSize (state, data) {
    state.license.currentDataStolicenserageSize = data
  },
  clearUserInfo (state) {
    state.userName = ''
    state.accountList = []
    state.groupList = []
    state.permission = []
  },
  updateUserGroupInfo (state, data) {
    state.groupList = data.groupList
    const groupPermission = new Set(data.groupPermission)
    const ACCOUNT_REGEX = /^account/
    // compare with the latest permission list and remove expired ones
    state.permission = state.permission.filter(permission => {
      if (permission.match(ACCOUNT_REGEX)) return true
      return groupPermission.has(permission)
    })
    // merge the latest permission list into existing one and exclude duplicate items
    state.permission = [...new Set([...state.permission, ...groupPermission])]
  }
}
