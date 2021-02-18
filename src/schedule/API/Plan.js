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

export function getOrderPlanResult (projectId, page, size, fetchAll = false) {
  return request({
    url: '/plan/result/general/list',
    method: 'GET',
    params: {
      projectId,
      page,
      size,
      fetchAll
    }
  })
}

export function getMachinePlanResult (projectId, page, size, fetchAll = false) {
  return request({
    url: '/plan/result/detail/list',
    method: 'GET',
    params: {
      projectId,
      page,
      size,
      fetchAll
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
