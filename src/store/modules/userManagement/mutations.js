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
  updateUserGroupList (state, data) {
    if (!state.groupList.length || !data.length) {
      state.groupList = data
      return
    }
    const defaultGroupId = state.groupList.find(group => group.isDefault).groupId
    const updatedGroupList = data.map(group => ({
      ...group,
      isDefault: group.groupId === defaultGroupId
    }))

    // 處理 default group 被刪除的情況：暫定賦予第一個 group 為 default group
    const hasDefaultGroup = updatedGroupList.findIndex(group => group.isDefault)
    if (hasDefaultGroup < 0) { updatedGroupList[0].isDefault = true }
    state.groupList = updatedGroupList
  }
}
