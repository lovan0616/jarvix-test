import request from '@/schedule/utils/publicRequest.js'

/**
 * 創建模擬計畫
 */
export function newPlan (data) {
  return request({
    url: '/simulation/plan/new',
    method: 'POST',
    data
  })
}

/**
 * 重新模擬傳送的方案
 * @param {Number} planId - 模擬計畫 ID
 */
export function reSimulate ({ planId, solutions }) {
  return request({
    url: `/simulation/plan/${planId}/solution/resimulate`,
    method: 'PUT',
    data: { planId, solutions }
  })
}

/**
 * 確認模擬計畫完成與否
 * @param {Number} planId - 欲檢查的模擬計畫 ID
 */
export function checkSimulationProgress (planId) {
  return request({
    url: `/simulation/plan/${planId}/check/progress`,
    method: 'GET'
  })
}

/**
 * 取消模擬方案
 * @param {Number} planId - 模擬計畫 ID
 * @param {Number} solutionId - 模擬方案 ID
 */
export function deleteSimulatedSolution (planId, solutionId) {
  request({
    url: `/simulation/plan/${planId}/solution/${solutionId}`,
    method: 'DELETE'
  })
}

/**
 * 取消模擬計畫
 * @param {Number} planId - 模擬計畫 ID
 */
export function cancelSimulationPlan (planId) {
  return request({
    url: `/simulation/plan/${planId}/cancel`,
    method: 'PUT'
  })
}

export function getOrderSimulateResult (planId, solutionId, page, size, fetchAll = false) {
  return request({
    url: `/simulation/plan/${planId}/solution/${solutionId}/result/general`,
    method: 'GET',
    params: {
      page,
      size,
      fetchAll
    }
  })
}

export function getMachineSimulateResult (planId, solutionId, page, size, fetchAll = false) {
  return request({
    url: `/simulation/plan/${planId}/solution/${solutionId}/result/details`,
    method: 'GET',
    params: {
      page,
      size,
      fetchAll
    }
  })
}

export function getMachineExcludeList (planId, solutionId) {
  return request({
    url: `/simulation/plan/${planId}/solution/${solutionId}/excludeEquipment/list`,
    method: 'GET'
  })
}

export function getKpiResult (planId) {
  return request({
    url: `/simulation/plan/${planId}/general/kpi/list`,
    method: 'GET'
  })
}

export function adoptionSolution (planId, solutionId) {
  return request({
    url: `/simulation/plan/${planId}/solution/${solutionId}/apply`,
    method: 'PUT'
  })
}
