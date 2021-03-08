import request from '@/schedule/utils/publicRequest.js'

/**
 * 檢查訂單
 *  @param {Number} data - dataframeId - 資料表 id
 *  @param {Number} data - project - 排程子專案 id
 */
export function checkOrder (data) {
  // return new Promise(resolve => {
  //   setTimeout(function () {
  //     resolve({
  //       available: 3044,
  //       columns: [
  //         {
  //           displayName: '某個欄位',
  //           emptyRowIndexes: [
  //             0, 5, 10, 15, 20
  //           ],
  //           internalName: 'string',
  //           refErrorRows: [
  //             {
  //               index: 3,
  //               value: 'A'
  //             },
  //             {
  //               index: 5,
  //               value: 'B'
  //             },
  //             {
  //               index: 8,
  //               value: 'C'
  //             },
  //             {
  //               index: 10,
  //               value: 'A'
  //             },
  //             {
  //               index: 13,
  //               value: 'B'
  //             },
  //             {
  //               index: 15,
  //               value: 'C'
  //             },
  //             {
  //               index: 18,
  //               value: 'A'
  //             },
  //             {
  //               index: 20,
  //               value: 'B'
  //             },
  //             {
  //               index: 3,
  //               value: 'C'
  //             },
  //             {
  //               index: 5,
  //               value: 'V'
  //             },
  //             {
  //               index: 8,
  //               value: 'H'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF機器機器機器機器機器機器IDF機器機器機器機器機器機器IDF機器機器機器機器機器機器IDF機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             },
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             },
  //             {
  //               index: 8,
  //               value: '機器機器機器機器機器機器IDC'
  //             },
  //             {
  //               index: 10,
  //               value: '機器機器機器機器機器機器IDD'
  //             },
  //             {
  //               index: 13,
  //               value: '機器機器機器機器機器機器IDE'
  //             },
  //             {
  //               index: 15,
  //               value: '機器機器機器機器機器機器IDF'
  //             },
  //             {
  //               index: 18,
  //               value: '機器機器機器機器機器機器IDG'
  //             },
  //             {
  //               index: 20,
  //               value: '機器機器機器機器機器機器IDH'
  //             }
  //           ],
  //           typeErrorRowIndexes: [
  //             0
  //           ]
  //         },
  //         {
  //           displayName: '我好疲倦',
  //           emptyRowIndexes: [
  //             0, 5, 10, 15, 20
  //           ],
  //           internalName: 'string',
  //           refErrorRows: [
  //             {
  //               index: 3,
  //               value: '機器機器機器機器機器機器IDA'
  //             },
  //             {
  //               index: 5,
  //               value: '機器機器機器機器機器機器IDB'
  //             }
  //           ],
  //           typeErrorRowIndexes: [
  //             0, 5, 10, 15, 25,35, 45, 55
  //           ]
  //         }
  //       ],
  //       notApplicableRowIndexes: [14, 199, 390, 1,1,1,1,1,1],
  //       rows: 3047
  //     })
  //   }, 0)
  // })
  return request({
    url: '/dataframe/bind/order/check',
    method: 'POST',
    data
  })
}

/**
 * 綁定訂單
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