import request from '@/schedule/utils/publicRequest.js'

/**
 * 綁定訂單檢查
 *  @param {Number} data - dataframeId - 資料表 id
 *  @param {Number} data - project - 排程子專案 id
 */
export function checkOrder (data) {
  return request({
    url: '/dataframe/bind/order/check',
    method: 'POST',
    data
  })
}

/**
 * 綁定訂單來源
 *  @param {Number} data - dataframeId - 資料表 id
 *  @param {Number} data - project - 排程子專案 id
 */
export function bindOrder (data) {
  return request({
    url: '/dataframe/bind/order',
    method: 'POST',
    data
  })
}

/**
 * 綁定共用資料檢查
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
 * 綁定共用資料來源
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