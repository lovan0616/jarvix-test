import request from '@/utils/publicRequest'

/**
 * 取得帳戶下所有使用者
 */
export function getGroupUserList (groupId) {
  return request({
    url: `/group/${groupId}/user`,
    method: 'GET'
  })
}

/**
 * 取得帳戶下所有使用者(包含隱性的 account_owner)
 */
export function getGroupMemberList (groupId) {
  return request({
    url: `/group/${groupId}/members`,
    method: 'GET'
  })
}

/**
 * 取得帳戶下所有使用者的帳戶角色
 */
export function getGroupRoles (groupId) {
  return request({
    url: `/group/${groupId}/role`,
    method: 'GET'
  })
}

/**
 * 更新帳戶使用者角色
 * @param {Object} info 更新資訊
 * @param {Number} info.groupId - 帳戶 ID
 * @param {Number} info.newRole - 使用者角色
 * @param {Number} info.userId - 使用者 ID
 */
export function updateGroupRole (info) {
  return request({
    url: `/group/role`,
    method: 'PUT',
    data: info
  })
}

/**
 * 新增群組使用者
 * @param {Number} groupId - 群組 ID
 * @param {Object} userInfo - 使用者資訊
 * @param {Number} userInfo.groupRole - 群組角色
 * @param {Number} userInfo.userId - 使用者 ID
 */
export function createGroupUser (userInfo, groupId) {
  return request({
    url: '/group/user',
    method: 'POST',
    data: {
      ...userInfo,
      groupId
    }
  })
}

/**
 * 刪除群組與使用者關聯
 * @param {Number} groupId - 群組 ID
 * @param {Number} userId - 使用者 ID
 */
export function deleteGroupUser (userId, groupId) {
  return request({
    url: `/group/${groupId}/user/${userId}`,
    method: 'DELETE'
  })
}
