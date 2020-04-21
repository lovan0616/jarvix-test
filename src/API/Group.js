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
