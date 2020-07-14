import { logout, refreshToken, switchAccount, switchGroup } from '@/API/User'
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
  async getUserInfo({ commit, rootState }, defaultGroupId) {
    let accountPermissionList = []
    let licensePermissionList = []
    let groupPermissionList = []
    let defaultAccount = {}

    try {
      // get user permission
      const userInfo = await getPermission(defaultGroupId)
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
        userId: userInfo.userData.id,
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
      if (locale && locale !== rootState.setting.locale) {
        commit('setting/setLocale', locale, { root: true })
      }

      // get account info
      const accountInfo = await getAccountInfo(defaultAccount.id)
      commit('setLicenseInfo', accountInfo.license)

      // refresh token
      const { accessToken } = await refreshToken()
      localStorage.setItem('token', accessToken)
    } catch(error) {
      return Promise.reject(error)
    }
  },
  updateUserGroupList ({ dispatch, commit, getters }, groupId) {
    const originalGroupId = getters.getCurrentGroupId
    return dispatch('getUserInfo', groupId)
      .then(() => {
        const newGroupId = getters.getCurrentGroupId

        // 更新後無隸屬任何群組
        if(!newGroupId) {
          commit('dataSource/setDataSourceList', [], { root: true })
          return dispatch('dataSource/handleEmptyDataSource', null, { root: true })
        }
        
        // default 群組在更新前後相同
        if (newGroupId === originalGroupId) return dispatch('dataSource/getDataSourceList', {}, { root: true })

        // 更新後 default 已變更
        return dispatch('switchGroupById', { 
          accountId: getters.getCurrentAccountId, 
          groupId: newGroupId
        })
      })
  },
  switchAccountById({ state, dispatch, commit, getters }, { accountId, defaultGroupId }) {
    // 更新全域狀態
    commit('updateAppLoadingStatus', true, { root: true })
    return switchAccount({ accountId })
      .then(() => dispatch('getUserInfo'))
      .then(() => {
        // 處理帳戶下沒有群組的狀況
        if (state.groupList.length === 0) {
          commit('dataSource/setDataSourceList', [], { root: true })
          return dispatch('dataSource/handleEmptyDataSource', null, { root: true })
        }

        // 處理路徑中帶有指定的 group id
        if (defaultGroupId) return dispatch('switchGroupById', { accountId, groupId: defaultGroupId })

        // 先清空，因為新群組有可能沒有 dataSource
        commit('dataSource/setDataSourceId', null, { root: true })

        // 取得新的列表
        return dispatch('dataSource/getDataSourceList', {}, { root: true })
      })
      .finally(() => commit('updateAppLoadingStatus', false, { root: true }))
  },
  switchGroupById({ dispatch, commit }, { accountId, groupId }) {
    // 更新全域狀態
    commit('updateAppLoadingStatus', true, { root: true })
    return switchGroup({ accountId, groupId })
      .then(() => dispatch('getUserInfo', groupId))
      .then(() => {
        // 先清空，因為新群組有可能沒有 dataSource
        commit('dataSource/setDataSourceId', null, { root: true })

        // 取得新的列表
        return dispatch('dataSource/getDataSourceList', {}, { root: true })
      })
      .finally(() => commit('updateAppLoadingStatus', false, { root: true }))
  }
}
