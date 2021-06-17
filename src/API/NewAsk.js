import request from '@/utils/publicRequest'

/**
 * ask question
 */
export function askQuestion (askInfo, cancelFunction) {
  return request({
    url: '/ask/question',
    method: 'POST',
    data: askInfo,
    ...(cancelFunction && { cancelToken: cancelFunction })
  })
}

/**
 * ask result
 */
export function askResult (askInfo, cancelFunction) {
  return request({
    url: '/ask/result',
    method: 'POST',
    data: askInfo,
    cancelToken: cancelFunction
  })
}

/**
 * exchange result id to specific type
 * ex: overview to clustering, or clustering to overview
 */
export function askSpecificType ({ resultId, type, settingConfig }, cancelFunction) {
  return request({
    url: `/ask/result/${resultId}/denotation/alteration/${type}`,
    method: 'POST',
    data: settingConfig,
    cancelToken: cancelFunction
  })
}

/**
 * refresh result
 */
export function refreshResult (data) {
  return request({
    url: `/ask/result/refresh`,
    method: 'POST',
    data
  })
}

/**
 * get component list
 */
export function getComponentList (resultId, cancelFunction) {
  return request({
    url: `/ask/componentList/${resultId}`,
    method: 'GET',
    cancelToken: cancelFunction
  })
}

/**
 * get component data
 */
export function getComponentData (componentInfo, cancelFunction) {
  return request({
    url: `/ask/componentData`,
    method: 'POST',
    data: componentInfo,
    cancelToken: cancelFunction
  })
}

/**
 * component data csv download
 */
export function getComponentDataCSV (componentId, limit=null) {
  return request({
    url: `/ask/component/${componentId}/download/csv`,
    method: 'GET',
    params: {
      limit
    }
  })
}

/**
 * get question history
 */
export function getHistoryQuestionList(dataSourceId, dataFrameId) {
  return request({
    url: `/ask/questionHistoryList/${dataSourceId}`,
    method: 'GET',
    params: {
      dataFrameId
    }
  })
}

/**
 * add table to memory
 * @param {Number} accountId
 * @param {Number} dataFrameId,
 * @param {Number} dataSourceId
 */
export function addTableToMemory(accountId, dataFrameId, dataSourceId) {
  return request({
    url: `/inMemory`,
    method: 'POST',
    data: {
      accountId,
      dataFrameId,
      dataSourceId
    }
  })
}

/**
 * get available language parser
 */
export function getParserLanguageList() {
  return request({
    url: `/ask/question/languages`,
    method: 'GET'
  })
}

/**
 * get formula list
 */
export function getFormulaList() {
  return request({
    url: `/ask/askFormulaList/search`,
    method: 'GET'
  })
}

/**
 * ask result using existing formula
 */
export function askFormulaResult(askInfo) {
  return request({
    url: `/ask/formulaResult`,
    method: 'POST',
    data: askInfo
  })
}
