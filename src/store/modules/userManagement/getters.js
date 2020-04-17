export default {
  hasAccountPermission: state => permissionCode => {
    return state.accountPermission.includes(permissionCode)
  },
  hasGroupPermission: state => permissionCode => {
    return state.groupPermission.includes(permissionCode)
  },
  getCurrentAccountId: state => {
    return state.accountList.find(account => account.isDefault).id
  },
  getCurrentGroupId: state => {
    return state.groupList.find(group => group.isDefault).groupId
  }
}
