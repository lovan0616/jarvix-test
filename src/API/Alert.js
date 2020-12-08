import request from '@/utils/publicRequest'

/**
 * 取得 所有示警條件
 */
export function getAlertConditions () {
  // return request({
  //   url: '/alert/conditions',
  //   method: 'GET'
  // })
  // MOCK DATA
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          "id": 1,
          "name": "成本過高",
          "dataFrameId": 1,
          "triggerEvent": "DATA_CHANGE",
          "targetConfig": {
            "displayName": "成本",
            "dataType": "INT",
            "statsType": "NUMERIC",
            "dataColumnId": 1
          },
          "comparingValues": [
            {
              "comparisonOperator": "GREATER_THAN",
              "dataType": "INT",
              "value": "1000"
            }
          ]
        },
        {
          "id": 2,
          "name": "價格不符",
          "dataFrameId": 1,
          "triggerEvent": "DATA_CHANGE",
          "targetConfig": {
            "displayName": "價格",
            "dataType": "INT",
            "statsType": "NUMERIC",
            "dataColumnId": 1
          },
          "comparingValues": [
            {
              "comparisonOperator": "GREATER_THAN",
              "dataType": "INT",
              "value": "1000"
            },
            {
              "comparisonOperator": "LOWER_THAN",
              "dataType": "INT",
              "value": "500"
            }
          ]
        }
      ])
    }, 0)
  })
}

/**
 * 取得 指定的示警條件
 * @param {Number} id - conditionId
 */
export function getAlertConditionById (conditionId) {
  return request({
    url: `/alert/condition/${conditionId}`,
    method: 'GET'
  })
}

/**
 * 取得 指定的示警條件 的示警訊息
 * @param {Number} id - conditionId
 */
export function getAlertConditionMessageById (conditionId) {
  return request({
    url: `/alert/condition/${conditionId}/message-templates`,
    method: 'GET'
  })
}

/**
 * 取得 所有示警 logs
 * @param {Array} id - conditionIds
 * @param {Number} page
 * @param {Number} size
 */
export function getAlertLogs ({ conditionIds, page = 0, size = 20 }) {
  return request({
    url: `/alert/logs?conditionIds=${conditionIds}&page=${page}$size=${size}`,
    method: 'GET',
  })
}
