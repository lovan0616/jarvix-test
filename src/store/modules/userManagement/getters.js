export default {
  hasPermission: state => permissionCode => {
    const userPermission = new Set(state.permission)
    // validate single permission
    if (typeof permissionCode === 'string') return userPermission.has(permissionCode)
    // validate a list of permission
    return permissionCode.some(permission => userPermission.has(permission))
  },
  getCurrentAccountName: state => {
    const defaultAccount = state.accountList.find(account => account.isDefault)
    if (!defaultAccount) return
    return defaultAccount.name
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
