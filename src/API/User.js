import request from '@/utils/request'

/**
 * 登入
 */
export function login (loginInfo) {
  return request({
    url: '/login',
    method: 'POST',
    data: loginInfo
  })
}

/**
 * 登出
 */
export function logout () {
  return request({
    url: '/logout',
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
 */
export function updateUser (userInfo) {
  return request({
    url: '/users',
    method: 'PUT',
    data: userInfo
  })
}

/**
 * 刪除使用者
 */
export function deleteUser (userInfo, id) {
  return request({
    url: `/users/${id}`,
    method: 'DELETE',
    data: userInfo
  })
}
