import { logout } from '@/API/User'

const dummyUserData = {
  name: 'Mike',
  accountList: [{id: 3, name: '瘋狂鯊魚', isDefault: false}, {id: 2, name: 'SyGPS', isDefault: true}],
  accountPermission: ['account_delete_user', 'account_create_user', 'account_update_user', 'account_update_license', 'account_read_group'],
  groupList: [],
  groupPermission: []
}

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
  getUserInfo ({commit}) {
    // fetch user data api
    commit('setUserInfo', {
      userName: dummyUserData.name,
      accountList: dummyUserData.accountList,
      accountPermission: dummyUserData.accountPermission,
      groupList: dummyUserData.groupList,
      groupPermission: dummyUserData.groupPermission
    })
  }
}
