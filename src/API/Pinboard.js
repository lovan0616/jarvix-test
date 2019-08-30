import request from '@/utils/request'

/**
 * get pinboard list
 */
export function getPinboardList () {
  return request({
    url: '/pinboards/boards',
    method: 'GET'
  })
}

/**
 * get pinboard by id
 */
export function getPinboardById (id) {
  return request({
    url: `/pinboards/boards/${id}`,
    method: 'GET'
  })
}

/**
 * get pinboard template
 */
export function getPinboardTemplate (id) {
  return request({
    url: `/pinboards/boards/${id}/template`,
    method: 'GET'
  })
}

/**
 * create new board
 */
export function createPinboard (name) {
  return request({
    url: `/pinboards/boards`,
    method: 'POST',
    data: {
      name
    }
  })
}

/**
 * update pinboard name
 */
export function updatePinboardName (id, name) {
  return request({
    url: `/pinboards/boards/${id}`,
    method: 'PUT',
    data: {
      name
    }
  })
}

/**
 * delete board
 */
export function deletePinboard (id) {
  return request({
    url: `/pinboards/boards/${id}`,
    method: 'DELETE'
  })
}

/**
 * pin to pinboard
 */
export function pinToBoard (id, data) {
  return request({
    url: `/pinboards/boards/${id}`,
    method: 'POST',
    data: data
  })
}

/**
 * unpin
 */
export function unPinById (id) {
  return request({
    url: `/pinboards/pin/${id}`,
    method: 'DELETE'
  })
}
