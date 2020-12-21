import request from '@/utils/publicRequest'

/**
 * 創建 示警條件
 */
export function postAlertCondition (data) {
  return request({
    url: '/alert/condition',
    method: 'POST',
    data
  })
}

/**
 * 取得 所有示警條件
 */
export function getAlertConditions (groupId) {
  return request({
    url: `/alert/conditions?groupId=${groupId}`,
    method: 'GET'
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
export function getAlertLogs ({ conditionIds, page = 0, size = 20, groupId }) {
  return request({
    url: `/alert/logs/search?page=${page}&size=${size}`,
    method: 'POST',
    data: {
      conditionIdsString: `[${conditionIds.toString()}]`,
      groupId,
      // TODO 待串接
      // "active": true,
      // "endTime": "string",
      // "startTime": "string"
    }
  })
}

/**
 * 變更示警紀錄尚未處理狀態
 * @param {string} id - log id
 */
export function patchAlertLogActiveness(logId, stateInfo) {
  return request({
    url: `/alert/log/${logId}/activeness`,
    method: 'PATCH',
    data: stateInfo
  })
}
