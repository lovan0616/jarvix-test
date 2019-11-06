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
 * 登出
 */
export function logout () {
  return request({
    url: 'auth/logout',
    method: 'GET'
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
