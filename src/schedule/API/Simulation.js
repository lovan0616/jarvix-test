import request from '@/schedule/utils/publicRequest.js'

/**
 * 創建模擬計畫
 * @param {Object} data - 模擬資料
 */
export function newPlan (data) {
  return request({
    url: '/simulation/plan/new',
    method: 'POST',
    data
  })
}

/**
 * 創建子模擬
 * @param {Object} subSimulation - 子模擬資料
 */
export function newChildSimulation (data) {
  return request({
    url: '/simulation/childSolution',
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
 * 確認子模擬完成與否
 * @param {Number} solutionId - 欲檢查的模擬計畫 ID
 */
export function checkChildSimulationProgress (solutionId) {
  return request({
    url: `/simulation/solution/${solutionId}/check/progress`,
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

/**
 * 取消子模擬
 * @param {Number} planId - 模擬計畫 ID
 */
export function cancelChildSimulation (solutionId) {
  return request({
    url: `simulation/solution/${solutionId}/cancel`,
    method: 'PUT'
  })
}

export function getOrderSimulateResult ({ planId, solutionId, page, size, keyword, deadlineStartDate, deadlineEndDate, scheduled, withinScheduleTime }) {
  return request({
    url: `/simulation/plan/${planId}/solution/${solutionId}/result/general`,
    method: 'GET',
    params: {
      page,
      size,
      keyword,
      deadlineStartDate,
      deadlineEndDate,
      scheduled,
      withinScheduleTime
    }
  })
}

export function getMachineSimulateResult ({ planId, solutionId, page, size, keyword, deadlineStartDate, deadlineEndDate, overlapStartTime, overlapEndTime, scheduled, withinScheduleTime }) {
  return request({
    url: `/simulation/plan/${planId}/solution/${solutionId}/result/details`,
    method: 'GET',
    params: {
      page,
      size,
      keyword,
      deadlineStartDate,
      deadlineEndDate,
      overlapStartTime,
      overlapEndTime,
      scheduled,
      withinScheduleTime
    }
  })
}

export function getMachineSimulateExcludeList (planId, solutionId) {
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

/**
 * 任二方案的達交比較
 * @param {Object} data - 模擬資料
 * @param {Number} compareeSolutionId - 比較方案 1 solutionId
 * @param {Boolean} compareeWithinScheduleTime - 比較方案 1 是否達交
 * @param {Number | Null} comparerSolutionId - 比較方案 2 solutionId，若不帶則回傳 比較方案 1 達交資訊
 * @param {Boolean | Null} comparerWithinScheduleTime - 比較方案 1 是否達交
 * Note - 比較結果與順序無關
 */
export function getSolutionScheduleCompare ({
  compareeSolutionId,
  compareeWithinScheduleTime,
  comparerSolutionId,
  comparerWithinScheduleTime,
  page = 0,
  size = 20
}) {
  return request({
    url: 'simulation/compare',
    method: 'GET',
    params: {
      compareeSolutionId,
      compareeWithinScheduleTime,
      comparerSolutionId,
      comparerWithinScheduleTime,
      page,
      size
    }
  })
}
