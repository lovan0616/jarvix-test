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
 * 刪除 示警條件
 */
export function deleteAlertCondition (conditionId) {
  return request({
    url: `/alert/condition/${conditionId}`,
    method: 'DELETE'
  })
}

/**
 * 修改 監控示警條件開關
 */
export function toggleAlertCondition (conditionId, data) {
  return request({
    url: `/alert/condition/${conditionId}`,
    method: 'PATCH',
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
export function getAlertLogs ({ conditionIds, page = 0, size = 20, groupId, active, startTime, endTime }) {
  return request({
    url: `/alert/logs/search?page=${page}&size=${size}`,
    method: 'POST',
    data: {
      conditionIds: conditionIds,
      groupId,
      active,
      startTime,
      endTime
    }
  })
}

/**
 * 取得 所有示警 logs 總數
 * @param {Array} id - conditionIds
 */
export function getAlertLogsCount ({ conditionIds, groupId, active, startTime, endTime }) {
  return request({
    url: `/alert/logs/count`,
    method: 'POST',
    data: {
      conditionIds,
      groupId,
      active,
      startTime,
      endTime
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

/**
 * 修改示警訊息中
 * @param {Number} id - condition id
 * @param {Object} dataColumnIds - 參數欄位
 * @param {Object} language - 欲修改的語言
 * @param {Object} message - 示警訊息
 */
export function patchConditionMessageParams(conditionId, data) {
  return request({
    url: `/alert/condition/${conditionId}/message-templates`,
    method: 'PATCH',
    data
  })
}

/**
 * 取得指定元件可分析值型別選項
 * @param {Number} id - component id
 */
export function getComponentIndicators(componentId) {
  return request({
    url: `/alert/component/${componentId}/analysisValueTypes`,
    method: 'GET'
  })
}

/**
 * 新增監控示警條件(透過Component)
 */
export function convertComponentToAlertCondition(data) {
  return request({
    url: `/alert/condition/component`,
    method: 'POST',
    data
  })
}

/**
 * 手動觸發示警
 * @param {Number} id - condition id
 */
export function manualTriggerAlert(id) {
  return request({
    url: `alert/conditions/${id}/trigger`,
    method: 'POST'
  })
}