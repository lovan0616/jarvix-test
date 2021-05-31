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

export function getOrderPlanResult ({ projectId, page, size, fetchAll = false, keyword = '' }) {
  return request({
    url: '/plan/result/general/list',
    method: 'GET',
    params: {
      projectId,
      page,
      size,
      fetchAll,
      keyword
    }
  })
}

export function getMachinePlanResult ({ projectId, page = 0, size = 0, fetchAll = false, keyword = '' }) {
  return request({
    url: '/plan/result/detail/list',
    method: 'GET',
    params: {
      projectId,
      page,
      size,
      fetchAll,
      keyword
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
