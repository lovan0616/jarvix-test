import { logout, getAccountGroupInfo } from '@/API/User'
import { getAccountInfo } from '@/API/Account'
import { getPermission } from '@/API/Permission'

export default {
  logout ({ commit }) {
    return logout().then(() => {
      commit('dataSource/setIsInit', false, { root: true })
      commit('dataSource/setDataSourceId', null, { root: true })
      commit('clearUserInfo')
      commit('setting/setCurrentRoute', null, { root: true })
      localStorage.removeItem('token')
    })
  },
  async getUserInfo ({ commit }) {
    let accountPermissionList = []
    let licensePermissionList = []
    let groupPermissionList = []
    let defaultAccount = {}

    const userInfo = await getPermission()

    if (userInfo.accountList.length) {
      defaultAccount = userInfo.accountList.find(account => account.isDefault)
      licensePermissionList = defaultAccount.licensePermissionList

      const accountInfo = await getAccountInfo(defaultAccount.id)

      // 判斷是否為個人版
      let individual = accountInfo.license.maxUser === 1

      // 個人版無 account_create_user 權限
      accountPermissionList = individual
        ? defaultAccount.accountPermissionList.filter(p => p !== 'account_create_user')
        : defaultAccount.accountPermissionList
      if (defaultAccount.groupList.length) {
        let defaultGroup = defaultAccount.groupList.find(group => group.isDefault)
        groupPermissionList = defaultGroup.groupPermissionList
      }
    }

    commit('setUserInfo', {
      userName: userInfo.username,
      accountList: userInfo.accountList,
      groupList: userInfo.accountList.length ? defaultAccount.groupList : [],
      permission: [
        ...accountPermissionList,
        ...groupPermissionList,
        ...licensePermissionList
      ]
    })
  },
  updateUserGroupList ({ dispatch, commit, getters }) {
    const currentAccountId = getters.getCurrentAccountId
    getAccountGroupInfo(currentAccountId)
      .then(res => commit('updateUserGroupInfo', res))
      .then(() => {
        const currentGroupId = getters.getCurrentGroupId
        if (currentGroupId) {
          dispatch('dataSource/getDataSourceList', null, { root: true })
        } else {
          commit('dataSource/setDataSourceList', [], { root: true })
          dispatch('dataSource/handleEmptyDataSource', null, { root: true })
        }
      })
  }
}
