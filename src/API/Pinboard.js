import request from '@/utils/publicRequest'

/**
 * get personal pinboard list
 */
export function getPinboardList () {
  return request({
    url: '/pinBoard/user/folder',
    method: 'GET'
  })
}

/**
 * get group pinboard list
 * @param {Number} groupId
 */
export function getGroupPinboardList (groupId) {
  return request({
    url: `/pinBoard/group/${groupId}/folder`,
    method: 'GET'
  })
}

/**
 * get pinboard by id
 * @param {Number} folderId
 */
export function getPinboardById (folderId) {
  return request({
    url: `/pinBoard/${folderId}`,
    method: 'GET'
  })
}

/**
 * create new personal board
 * @param {String} name - 新分類名
 */
export function createPinboard (name) {
  return request({
    url: `/pinBoard/user/folder`,
    method: 'POST',
    data: {
      name
    }
  })
}

/**
 * create new group board
 * @param {String} name - 新分類名稱
 * @param {Number} groupId
 */
export function createGroupPinboard ({name, groupId}) {
  return request({
    url: `/pinBoard/group/${groupId}/folder`,
    method: 'POST',
    data: {
      name
    }
  })
}

/**
 * update personal pinboard name
 * @param {Number} folderId - 釘板分類 ID
 * @param {Number} userId
 * @param {String} name - 釘板分類名稱
 */
export function updatePinboardName (folderId, userId, name) {
  return request({
    url: `/pinBoard/user/${userId}/folder/${folderId}`,
    method: 'PATCH',
    data: {
      name,
    }
  })
}

/**
 * update group pinboard name
 * @param {Number} folderId - 釘板分類 ID
 * @param {Number} groupId
 * @param {String} name - 釘板分類名稱
 */
export function updateGroupPinboardName (folderId, groupId, name) {
  return request({
    url: `/pinBoard/group/${groupId}/folder/${folderId}`,
    method: 'PATCH',
    data: {
      name
    }
  })
}

/**
 * delete personal board
 * @param {Number} userId -  user ID
 * @param {Number} folderId -  釘板分類 ID
 */
export function deletePinboard (userId, folderId) {
  return request({
    url: `/pinBoard/user/${userId}/folder/${folderId}`,
    method: 'DELETE'
  })
}

/**
 * delete group board
 * @param {Number} folderId -  釘板分類 ID
 * @param {Number} groupId -  groupId ID
 */
export function deleteGroupPinboard (groupId, folderId) {
  return request({
    url: `/pinBoard/group/${groupId}/folder/${folderId}`,
    method: 'DELETE'
  })
}

/**
 * pin to pinboard
 */
export function pinToBoard (data) {
  return request({
    url: `/pinBoard`,
    method: 'POST',
    data
  })
}

/**
 * unpin
 */
export function unPinById (id) {
  return request({
    url: `/pinBoard/${id}`,
    method: 'DELETE'
  })
}

/**
 * sort pinboard
 * @param {Array} pinbordList
 */
export function sortPinboard (pinbordList) {
  return request({
    url: '/pinBoard/sequence',
    method: 'PATCH',
    data: {
      pinbordList
    }
  })
}
