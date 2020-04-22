import { logout, getUserAccountInfo, getAccountGroupInfo, getSelfInfo } from '@/API/User'

export default {
  logout ({ commit }) {
    return logout().then(() => {
      commit('dataSource/setIsInit', false, {root: true})
      commit('dataSource/setDataSourceId', null, {root: true})
      commit('clearUserInfo')
      localStorage.removeItem('token')
    })
  },
  async getUserInfo ({commit}) {
    const accountInfo = await getUserAccountInfo()
    let groupInfo = {}

    if (accountInfo.accountList.length) {
      const defaultAccountId = accountInfo.accountList.find(account => account.isDefault).id
      groupInfo = await getAccountGroupInfo(defaultAccountId)
    }
    const userInfo = await getSelfInfo()
    commit('setUserInfo', {
      userName: userInfo.name,
      accountList: accountInfo.accountList,
      accountPermission: accountInfo.accountPermission,
      groupList: groupInfo.groupList || [],
      groupPermission: groupInfo.groupPermission || []
    })
  },
  updateUserGroupList ({dispatch, commit, getters}) {
    const currentAccountId = getters.getCurrentAccountId
    getAccountGroupInfo(currentAccountId)
      .then(res => commit('updateUserGroupInfo', res))
      .then(() => {
        const currentGroupId = getters.getCurrentGroupId
        console.log(currentGroupId)
        if (currentGroupId) {
          dispatch('dataSource/getDataSourceList', null, {root: true})
        } else {
          commit('dataSource/setDataSourceList', [], {root: true})
          dispatch('dataSource/handleEmptyDataSource', null, {root: true})
        }
      })
  }
}
