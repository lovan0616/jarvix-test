import request from '@/utils/publicRequest'

/**
 * ask question
 */
export function askQuestion (askInfo, cancelFunction) {
  return request({
    url: '/ask/question',
    method: 'POST',
    data: askInfo,
    cancelToken: cancelFunction
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
 * ask clustering by resultId
 */
export function askClustering (resultId) {
  // return request({
  //   url: `/ask/result/${resultId}/to/clustering`,
  //   method: 'POST'
  // })
  // MOCL DATA
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(60000)
    }, 5)
  })
}

/**
 * ask overview by resultId
 */
export function askOverview (resultId) {
  // return request({
  //   url: `/ask/result/${resultId}/to/overview`,
  //   method: 'POST'
  // })
  // MOCL DATA
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(50000)
    }, 5)
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
 * get related question
 * @param resultId
 */
export function getRelatedQuestionList(resultId, dataSourceId) {
  return request({
    url: `/ask/relatedQuestionList`,
    method: 'POST',
    data: {
      resultId,
      dataSourceId
    }
  })
}

/**
 * get quick start question
 */
export function getQuickStartQuestion(dataSourceId, dataFrameId, restrictions, selectedColumnList = null) {
  return request({
    url: `/ask/quickQuestionList/search`,
    method: 'POST',
    data: {
      dataSourceId, 
      dataFrameId,
      restrictions,
      selectedColumnList
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
