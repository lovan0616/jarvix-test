import request from '@/utils/publicRequest'

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
 * 註冊
 * @param {Object} signupInfo - 使用者資訊
 * @param {String} signupInfo.email - 使用者郵件
 * @param {String} signupInfo.password - 使用者密碼
 * @param {String} signupInfo.username - 使用者名稱
 */
export function signup (signupInfo) {
  return request({
    url: '/userR',
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
 * 取得所有使用者
 */
export function getUsers () {
  return request({
    url: '/users',
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
 * @param {Number} id - 使用者 ID
 */
export function updateUser (userInfo, id) {
  return request({
    url: `/users/${id}`,
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
    url: `/users/selfInfo`,
    method: 'GET'
  })
}

/**
 * 邀請使用者
 * @param {Object} inviteeInfo - 受邀者者資訊
 * @param {Array}} inviteeInfo.email - 受邀者者郵件
 * @param {String} inviteeInfo.webURL - 註冊頁面連結
 */
export function inviteUser (inviteeInfo) {
  return request({
    url: '/mail/inviteMail',
    method: 'POST',
    data: inviteeInfo
  })
}
