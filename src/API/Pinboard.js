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
 * get pinboard by id
 */
export function getPinboardById (id) {
  return request({
    url: `/pinBoard/${id}`,
    method: 'GET'
  })
}

/**
 * create new board
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
 * update pinboard name
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
 * delete board
 */
export function deletePinboard (id) {
  return request({
    url: `/pinBoard/folder/${id}`,
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
    url: `/pinboards/${id}`,
    method: 'DELETE'
  })
}
