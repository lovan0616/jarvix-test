import { logout, switchAccount, switchGroup, updateLocale } from '@/API/User'
import { getAccountInfo } from '@/API/Account'
import { getPermission } from '@/API/Permission'

export default {
  logout ({ commit }) {
    return logout().then(() => {
      commit('dataSource/setIsInit', false, { root: true })
      commit('dataSource/setDataSourceId', null, { root: true })
      commit('clearUserInfo')
      commit('setting/setCurrentRoute', null, { root: true })
      commit('setting/isChangeLangBeforeLogin', false, { root: true })
      localStorage.removeItem('token')
    })
  },
  async getUserInfo({ commit, rootState, rootGetters }, defaultGroupId) {
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
        userEmail: userInfo.userData.email,
        accountList: userInfo.accountList,
        groupList: userInfo.accountList.length ? defaultAccount.groupList : [],
        permission: [
          ...accountPermissionList,
          ...groupPermissionList,
          ...licensePermissionList
        ]
      })

      // get locale info
      const hasPermission = rootGetters['userManagement/hasPermission']
      console.log(userInfo.userData.language)
      console.log(rootState.setting.locale )

      // 待改善
      const locale = !hasPermission('english_ui') && userInfo.userData.language === 'en-US' 
        ? rootState.setting.languageDefault
        : rootState.setting.locale 
      
      const tempLocale = !hasPermission('english_ui') && rootState.setting.locale === 'en-US' 
        ? rootState.setting.languageDefault
        : rootState.setting.locale 

      updateLocale(locale)
      
      // 未設定語系，並在登入前曾修改語系
      if (!locale && rootState.setting.changeLangBeforeLogin ) {
        console.log('未設定語系，並在登入前曾修改語系')
        console.log('rootState.setting.locale ', tempLocale)
        updateLocale(tempLocale)
      }
      // 曾設定語系，且發現前後端儲存的語系不同，需判斷該取用前端還是後端語系
      if (locale && locale !== rootState.setting.locale) {
        console.log('曾設定語系')
        console.log('rootState.setting.locale ', tempLocale)
        console.log('userInfo.userData.language ', locale)
        if (rootState.setting.changeLangBeforeLogin) updateLocale(tempLocale)
        commit('setting/setLocale', locale, { root: true })
      }

      // get account info
      const accountInfo = await getAccountInfo(defaultAccount.id)
      commit('setLicenseInfo', accountInfo.license)

      // refresh token
      // const { accessToken } = await refreshToken()
      // localStorage.setItem('token', accessToken)
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
        if (newGroupId === originalGroupId) return

        // 更新後 default 已變更
        return dispatch('switchGroupById', { 
          accountId: getters.getCurrentAccountId, 
          groupId: newGroupId
        })
      })
  },
  switchAccountById({ state, dispatch, commit }, { accountId, defaultGroupId }) {
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
        // 關閉基表設定
        commit('dataFrameAdvanceSetting/toggleSettingBox', false, { root: true })
        // 關閉問句說明
        commit('updateAskHelperStatus', false, { root: true })

        // 取得新的列表
        return dispatch('dataSource/getDataSourceList', {}, { root: true })
      })
      .finally(() => commit('updateAppLoadingStatus', false, { root: true }))
  }
}
