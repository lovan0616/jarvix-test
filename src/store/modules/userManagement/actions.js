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
  async getUserInfo ({ commit, rootState }) {
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
      .then(() => dispatch('getUserInfo'))
      .then(() => {
        // 先清空，因為新群組有可能沒有 dataSource
        commit('dataSource/setDataSourceId', null, { root: true })

        // 取得新的列表
        return dispatch('dataSource/getDataSourceList', {}, { root: true })
      })
      .finally(() => commit('updateAppLoadingStatus', false, { root: true }))
  }
}
