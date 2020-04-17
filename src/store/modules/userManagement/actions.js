import { logout, getAccountGroupList, getUserAccountInfo, getAccountGroupInfo, getSelfInfo } from '@/API/User'

export default {
  logout ({ commit }) {
    return logout().then(() => {
      commit('dataSource/setIsInit', false, {root: true})
      commit('dataSource/setDataSourceId', null, {root: true})
      commit('setting/setUserPermission', false, {root: true})
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
  getUserGroupList ({commit}) {
    return getAccountGroupList().then(list => {
      const groupList = list.map(group => ({
        groupId: group.groupId,
        groupName: group.groupName
      }))
      commit('updateUserGroupList', groupList)
    })
  }
}
