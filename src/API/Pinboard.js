import request from '@/utils/publicRequest'

/**
 * get pinboard list
 */
export function getPinboardList () {
  return request({
    url: '/pinBoard/folder',
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
 * @param {Number} id
 */
export function getPinboardById (id) {
  return request({
    url: `/pinBoard/${id}`,
    method: 'GET'
  })
}

/**
 * create new board
 * @param {String} name - 新分類名
 */
export function createPinboard (name) {
  return request({
    url: `/pinBoard/folder`,
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
export function createGroupPinboard (name, groupId) {
  return request({
    url: `/pinBoard/group/folder`,
    method: 'POST',
    data: {
      name,
      groupId
    }
  })
}

/**
 * update pinboard name
 * @param {String} name - 釘板分類名稱
 * @param {Number} id - 釘板分類 ID
 */
export function updatePinboardName (id, name) {
  return request({
    url: `/pinBoard/folder`,
    method: 'PUT',
    data: {
      id,
      name
    }
  })
}

/**
 * update group pinboard name
 * @param {String} name - 釘板分類名稱
 * @param {Number} id - 釘板分類 ID
 * @param {Number} groupId
 */
export function updateGroupPinboardName (id, groupId, name) {
  return request({
    url: `/pinBoard/folder`,
    method: 'PUT',
    data: {
      id,
      groupId,
      name
    }
  })
}

/**
 * delete board
 * @param {Number} id -  pinBoard ID
 */
export function deletePinboard (id) {
  return request({
    url: `/pinBoard/folder/${id}`,
    method: 'DELETE'
  })
}

/**
 * delete group board
 * @param {Number} id -  pinBoard ID
 * @param {Number} groupId -  groupId ID
 */
export function deleteGroupPinboard (groupId, id) {
  return request({
    url: `/pinBoard/group/${groupId}/folder/${id}`,
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
 * @param {Number} folderId - 釘板分類 ID
 * @param {Array} pinbordList
 */
export function sortPinboard (folderId, pinbordList) {
  return request({
    url: '/pinBoard/order',
    method: 'PUT',
    data: {
      folderId,
      pinbordList
    }
  })
}
