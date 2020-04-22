export default {
  hasAccountPermission: state => permissionCode => {
    return state.accountPermission.includes(permissionCode)
  },
  hasGroupPermission: state => permissionCode => {
    return state.groupPermission.includes(permissionCode)
  },
  getCurrentAccountId: state => {
    const defaultAccount = state.accountList.find(account => account.isDefault)
    if (!defaultAccount) return
    return defaultAccount.id
  },
  getCurrentGroupId: state => {
    const defaultGroup = state.groupList.find(group => group.isDefault)
    if (!defaultGroup) return
    return defaultGroup.groupId
  },
  getCurrentGroupName: state => {
    const defaultGroup = state.groupList.find(group => group.isDefault)
    if (!defaultGroup) return
    return defaultGroup.groupName
  }
}
