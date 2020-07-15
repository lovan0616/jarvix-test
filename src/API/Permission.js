import request from '@/utils/publicRequest'

/**
 * check permission
 */
export function checkUserPermission () {
  return request({
    url: '/permission/check',
    method: 'GET'
  })
}

/**
 * update permission
 */
export function updateUserPermission (userId) {
  return request({
    url: `/permission/update/${userId}`,
    method: 'POST'
  })
}

export function getPermission (defaultGroupId = null) {
  return request({
    url: `/permission`,
    method: 'GET',
    params: {
      groupId: defaultGroupId
    }
  })
}
