import request from '@/utils/publicRequest'
import store from '../store'

/**
 * 登入
 */
export function login (loginInfo) {
  return request({
    url: 'auth/login',
    method: 'POST',
    data: loginInfo
  })
}

/**
 * refresh token
 */
export function refreshToken () {
  return request({
    url: 'auth/refresh',
    method: 'PUT',
  })
}

/**
 * 註冊
 * @param {Object} signupInfo - 使用者資訊
 * @param {String} signupInfo.email - 使用者郵件
 * @param {String} signupInfo.password - 使用者密碼
 * @param {String} signupInfo.username - 使用者名稱
 */
export function signup (signupInfo) {
  return request({
    url: '/users',
    method: 'POST',
    data: signupInfo
  })
}

/**
 * 驗證邀請 Token
 * @param {Object} validateInfo - 驗證邀請資訊
 * @param {String} validateInfo.emailToken - 驗證 Token
 */
export function mailConfirm (validateInfo) {
  return request({
    url: '/mail/mailConfirm',
    method: 'POST',
    data: validateInfo
  })
}

/**
 * 登出
 */
export function logout () {
  return request({
    url: 'auth/logout',
    method: 'PUT'
  })
}

/**
 * 取得帳戶下所有使用者
 */
export function getAccountUsers (id) {
  const accountId = id || store.getters['userManagement/getCurrentAccountId']
  return request({
    url: `/account/${accountId}/user`,
    method: 'GET'
  })
}

/**
 * 新增使用者
 * @param {Object} userInfo - 使用者資訊
 * @param {String} userInfo.email - 使用者郵件
 * @param {String} userInfo.password - 使用者密碼
 * @param {String} userInfo.username - 使用者名稱
 */
export function createUser (userInfo) {
  return request({
    url: '/users',
    method: 'POST',
    data: userInfo
  })
}

/**
 * 更新使用者
 * @param {Object} userInfo - 使用者資訊
 * @param {String} userInfo.email - 使用者郵件
 * @param {String} userInfo.password - 使用者密碼
 * @param {String} userInfo.username - 使用者名稱
 */
export function updateUser (userInfo) {
  return request({
    url: `/users`,
    method: 'PUT',
    data: userInfo
  })
}

/**
 * 刪除使用者
 * @param {Number} id - 使用者 ID
 */
export function deleteUser (id) {
  return request({
    url: `/users/${id}`,
    method: 'DELETE'
  })
}

/**
 * 取得自己資訊
 */
export function getSelfInfo (id) {
  return request({
    url: `/users`,
    method: 'GET'
  })
}

/**
 * 邀請使用者
 * @param {Object} inviteeInfo - 受邀者者資訊
 * @param {Array} inviteeInfo.email - 受邀者者郵件
 * @param {String} inviteeInfo.webURL - 註冊頁面連結
 */
export function inviteUser (inviteeInfo) {
  return request({
    url: '/mail/inviteMail',
    method: 'POST',
    data: inviteeInfo
  })
}

/**
 * 邀請使用者
 * @param {Array} inviteeInfo - 受邀者資訊
 * @param {Number} inviteeInfo.accountId - 邀請者 accountId
 * @param {Number} inviteeInfo.accountRoleId - 受邀者帳號權限
 * @param {String} inviteeInfo.email - 受邀者郵件
 * @param {String} inviteeInfo.password - 受邀者密碼
 * @param {String} inviteeInfo.username - 受邀者名稱
 */
export function batchInviteUser (inviteeInfo) {
  return request({
    url: '/users/batch',
    method: 'POST',
    data: inviteeInfo
  })
}

/**
 * 取得帳戶下所有群組
 */
export function getAccountGroupList () {
  const accountId = store.getters['userManagement/getCurrentAccountId']
  return request({
    url: `/group/account/${accountId}`,
    method: 'GET'
  })
}

/**
 * 新增群組
 * @param {Object} groupInfo - 專案資訊
 * @param {String} groupInfo.name - 專案名稱
 */
export function createGroup (groupInfo) {
  return request({
    url: '/group',
    method: 'POST',
    data: {
      ...groupInfo,
      accountId: store.getters['userManagement/getCurrentAccountId']
    }
  })
}

/**
 * 刪除群組
 * @param {Number} id - 群組 ID
 */
export function deleteGroup (id) {
  return request({
    url: `/group/${id}`,
    method: 'DELETE'
  })
}

/**
 * 更新群組資訊
 * @param {Number} id - 群組 ID
 * @param {Object} groupInfo - 專案資訊
 * @param {String} groupInfo.name - 專案名稱
 */
export function updateGroupInfo (groupInfo) {
  return request({
    url: '/group',
    method: 'PUT',
    data: groupInfo
  })
}

/**
 * 取得帳戶列表和權限
 */
export function getUserAccountInfo () {
  return request({
    url: '/account/permission',
    method: 'GET'
  })
}

/**
 * 取得帳戶列表和權限
 */
export function getAccountGroupInfo (accountId) {
  return request({
    url: `/group/account/${accountId}/userGroupAndPermission`,
    method: 'GET'
  })
}

/**
 * 取得所有比自己低等的帳戶角色
 */
export function getAccountRoles (accountId) {
  return request({
    url: `/account/${accountId}/role`,
    method: 'GET'
  })
}

/**
 * 更新帳戶使用者角色
 * @param {Object} info 更新資訊
 * @param {Number} info.accountId - 帳戶 ID
 * @param {Number} info.newRole - 使用者角色
 * @param {Number} info.userId - 使用者 ID
 */
export function updateRole (info) {
  return request({
    url: `/account/user`,
    method: 'PUT',
    data: info
  })
}

/**
 * 刪除帳戶與使用者關聯
 * @param {Number} accountId - 帳戶 ID
 * @param {Number} userId - 使用者 ID
 */
export function deleteUserAccount (id, accountId) {
  return request({
    url: `/account/${id}/user/${accountId}`,
    method: 'DELETE'
  })
}

/**
 * 切換群組
 * @param {Number} accountInfo.groupId - 欲切換的群組 ID
 * @param {Number} accountInfo.accountId - 帳號 ID
 */
export function switchGroup (accountInfo) {
  return request({
    url: `/group/switch`,
    method: 'POST',
    data: accountInfo
  })
}

/**
 * 切換帳戶
 * @param {Number} accountInfo.accountId - 欲切換的帳戶 ID
 */
export function switchAccount(accountInfo) {
  return request({
    url: `/account/switch`,
    method: 'POST',
    data: accountInfo
  })
}

/**
 * 更換語系
 * @param {String} data.locale - 欲更換的語言
 * @param {Number} data.userId - 使用者 ID
 */
export async function updateLocale (language) {
  const userId = store.state.userManagement.userId
  return request({
    url: `/users/language`,
    method: 'PUT',
    data: { language, userId }
  })
}

/**
 * 變更密碼
 */
export function changePassword(passwordInfo) {
  return request({
    url: '/users/password',
    method: 'PATCH',
    data: passwordInfo
  })
}

/**
 * 寄送變更密碼
 */
export function requestResetPassword (mail) {
  return request({
    url: '/mail/password/reset',
    method: 'POST',
    data: mail
  })
}

/**
 * 確認變更密碼
 */
export function resetPassword (emailInfo) {
  return request({
    url: '/mail/password/confirm-reset',
    method: 'POST',
    data: emailInfo
  })
}
