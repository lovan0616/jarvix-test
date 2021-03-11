import request from '@/schedule/utils/publicRequest.js'

/**
 * 檢查訂單
 *  @param {Number} data - dataframeId - 資料表 id
 *  @param {Number} data - projectId - 排程子專案 id
 */
export function checkOrder (data) {
  return request({
    url: '/dataframe/bind/order/check',
    method: 'POST',
    data
  })
}

/**
 * 綁定訂單
 *  @param {Number} data - dataframeId - 資料表 id
 *  @param {Number} data - projectId - 排程子專案 id
 */
export function bindOrder (data) {
  return request({
    url: '/dataframe/bind/order',
    method: 'POST',
    data
  })
}

/**
 * 解除綁定訂單
 *  @param {Number} projectId - 排程子專案 id
 */
 export function unbindOrder (projectId) {
  return request({
    url: '/dataframe/unbind/order',
    method: 'POST',
    data: { projectId }
  })
}

/**
 * 檢查共用資料
 *  @param {Number} data - equipmentDataframeId - equipment 資料表 id
 *  @param {Number} data - groupDataframeId - group 資料表 id
 *  @param {Number} data - processDataframeId - process 資料表 id
 *  @param {Number} data - setupTimeDataframeId - setupTime 資料表 id
 *  @param {Number} data - transferTimeDataframeId - transferTime 資料表 id
 *  @param {Number} data - projectId - 排程專案 id
 */
export function checkRawdata (data) {
  return request({
    url: '/dataframe/bind/rawdata/check',
    method: 'POST',
    data
  })
}

/**
 * 綁定共用資料
 *  @param {Number} data - equipmentDataframeId - equipment 資料表 id
 *  @param {Number} data - groupDataframeId - group 資料表 id
 *  @param {Number} data - processDataframeId - process 資料表 id
 *  @param {Number} data - setupTimeDataframeId - setupTime 資料表 id
 *  @param {Number} data - transferTimeDataframeId - transferTime 資料表 id
 *  @param {Number} data - projectId - 排程專案 id
 */
export function bindRawdata (data) {
  return request({
    url: '/dataframe/bind/rawdata',
    method: 'POST',
    data
  })
}

/**
 * 解除綁定訂單
 *  @param {Number} projectId - 排程子專案 id
 */
export function unbindRawdata (projectId) {
  return request({
    url: '/dataframe/unbind/rawdata',
    method: 'POST',
    data: { projectId }
  })
}

/**
 * 檢查限制
 *  @param {Array} constraints - 限制資料表資訊
 *  @param {Number} data - project - 排程子專案 id
 */
export function checkConstraints (data) {
  return request({
    url: '/dataframe/bind/constraint/check',
    method: 'POST',
    data
  })
}

/**
 * 綁定限制
 *  @param {Array} constraints - 限制資料表資訊
 *  @param {Number} data - project - 排程子專案 id
 */
export function bindConstraints (data) {
  return request({
    url: '/dataframe/bind/constraint',
    method: 'POST',
    data
  })
}

/**
 * 解除綁定限制
 *  @param {Number} projectId - 排程子專案 id
 */
 export function unbindConstraint (projectId) {
  return request({
    url: '/dataframe/unbind/constraint',
    method: 'POST',
    data: { projectId }
  })
}
