import request from '@/schedule/utils/publicRequest.js'

export function getPlanInfo (projectId) {
  return request({
    url: '/plan/info',
    method: 'GET',
    params: {
      projectId
    }
  })
}

export function getPlanKPI (projectId) {
  return request({
    url: '/plan/kpi',
    method: 'GET',
    params: {
      projectId
    }
  })
}

export function getOrderPlanResult ({ projectId, page, size, keyword, deadlineStartDate, deadlineEndDate, delayed, withinScheduleTime }) {
  return request({
    url: '/plan/result/general/list',
    method: 'GET',
    params: {
      projectId,
      page,
      size,
      keyword,
      deadlineStartDate,
      deadlineEndDate,
      delayed,
      withinScheduleTime
    }
  })
}

export function getMachinePlanResult ({ projectId, page, size, keyword, deadlineStartDate, deadlineEndDate, overlapStartTime, overlapEndTime, delayed, withinScheduleTime }) {
  return request({
    url: '/plan/result/detail/list',
    method: 'GET',
    params: {
      projectId,
      page,
      size,
      keyword,
      deadlineStartDate,
      deadlineEndDate,
      overlapStartTime,
      overlapEndTime,
      delayed,
      withinScheduleTime
    }
  })
}

export function getMachinePlanExcludeList (projectId) {
  return request({
    url: '/plan/excludeEquipment/list',
    method: 'GET',
    params: {
      projectId
    }
  })
}

export function getLastSolution (projectId) {
  return request({
    url: '/plan/solution/list',
    method: 'GET',
    params: {
      projectId
    }
  })
}

export function keywordSearch ({ projectId, page = 0, size = 200, keyword }) {
  return request({
    url: '/plan/result/keywordSearch',
    method: 'GET',
    params: {
      projectId,
      page,
      size,
      keyword
    }
  })
}

/**
 * 取得工單進度表
 * @param {Number} projectId
 */
export function planExcelDownload ({ projectId }) {
  return request({
    url: '/plan/result/excelFile',
    method: 'GET',
    params: {
      projectId
    }
  })
}

/**
 * 取得子專案特定版本 excel
 * @param {Number} projectId
 * @param {Number} solutionId
 */
export function downloadPlanExcel ({ projectId, solutionId }) {
  return request({
    url: '/plan/result/excel',
    method: 'GET',
    responseType: 'blob',
    params: {
      projectId,
      solutionId
    }
  })
}

/**
 * 取得子專案採用過的 solutions
 * @param {Number} projectId
 */
export function getHistorySolutions (projectId) {
  return request({
    url: '/plan/applied/history',
    method: 'GET',
    params: {
      projectId,
      fetchAll: true
    }
  })
}
