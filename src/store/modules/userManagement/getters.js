export default {
  hasAccountPermission: state => permissionCode => {
    return state.accountPermission.includes(permissionCode)
  },
  hasGroupPermission: state => permissionCode => {
    return state.groupPermission.includes(permissionCode)
  }
}
