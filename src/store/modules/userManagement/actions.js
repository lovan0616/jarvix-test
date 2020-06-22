import { logout, refreshToken } from '@/API/User'
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

    await getPermission()
      .then((userInfo) => {
        if (userInfo.accountList.length) {
          defaultAccount = userInfo.accountList.find(account => account.isDefault)
          accountPermissionList = defaultAccount.accountPermissionList
          licensePermissionList = defaultAccount.licensePermissionList
          if (defaultAccount.groupList.length) {
            let defaultGroup = defaultAccount.groupList.find(group => group.isDefault)
            groupPermissionList = defaultGroup.groupPermissionList
          }
        }
    
        commit('setUserInfo', {
          userName: userInfo.userData.name,
          accountList: userInfo.accountList,
          groupList: userInfo.accountList.length ? defaultAccount.groupList : [],
          permission: [
            ...accountPermissionList,
            ...groupPermissionList,
            ...licensePermissionList
          ]
        })
        
        let locale = userInfo.userData.language
        if (locale) {
          commit('setting/setLocale', locale, { root: true })
        }
      })
      .catch(() => {})
    
    await getAccountInfo(defaultAccount.id)
      .then((accountInfo) => {
        commit('setLicenseInfo', accountInfo.license)
      })
      .catch(() => {})

    await refreshToken().then(res => {
      localStorage.setItem('token', res.accessToken)
    })
  },
  updateUserGroupList ({ dispatch, commit, getters }) {
    return dispatch('getUserInfo')
      .then(() => {
        const currentGroupId = getters.getCurrentGroupId
        if (currentGroupId) {
          dispatch('dataSource/getDataSourceList', {}, { root: true })
        } else {
          commit('dataSource/setDataSourceList', [], { root: true })
          dispatch('dataSource/handleEmptyDataSource', null, { root: true })
        }
      })
  }
}
