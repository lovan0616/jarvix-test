export default {
  hasPermission: state => (permissionCode, isMatchAllPermissions = false) => {
    const userPermission = new Set(state.permission)
    // validate single permission
    if (typeof permissionCode === 'string') return userPermission.has(permissionCode)
    // validate a list of permission
    if (isMatchAllPermissions) {
      return permissionCode.every(permission => userPermission.has(permission))
    } else {
      return permissionCode.some(permission => userPermission.has(permission))
    }
  },
  getCurrentAccountInfo: state => {
    const defaultAccount = state.accountList.find(account => account.isDefault)
    return defaultAccount
  },
  getCurrentAccountName: state => {
    const defaultAccount = state.accountList.find(account => account.isDefault)
    if (!defaultAccount) return
    return defaultAccount.name
  },
  getCurrentAccountId: state => {
    if (!state.accountList) return
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
