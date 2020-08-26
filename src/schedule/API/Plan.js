import request from '@/schedule/utils/publicRequest.js'

export function getPlanInfo () {
  return request({
    url: '/plan/info',
    method: 'GET'
  })
}

export function getPlanKPI () {
  return request({
    url: '/plan/kpi',
    method: 'GET'
  })
}

export function getOrderPlanResult (page, size, fetchAll = false) {
  return request({
    url: '/plan/result/general/list',
    method: 'GET',
    params: {
      page,
      size,
      fetchAll
    }
  })
}

export function getMachinePlanResult (page, size, fetchAll = false) {
  return request({
    url: '/plan/result/detail/list',
    method: 'GET',
    params: {
      page,
      size,
      fetchAll
    }
  })
}

export function getMachinePlanExcludeList () {
  return request({
    url: '/plan/excludeEquipment/list',
    method: 'GET'
  })
}

export function getLastSolution () {
  return request({
    url: '/plan/solution/list',
    method: 'GET'
  })
}
