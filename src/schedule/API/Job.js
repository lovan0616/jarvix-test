import request from '@/schedule/utils/publicRequest.js'

export function getJobList ({ projectId, fetchAll = false, page = 0, size = 20, keyword = null, deadlineStartDate, deadlineEndDate, scheduled, delayed, withinScheduleTime }) {
  return request({
    url: '/job/list',
    method: 'GET',
    params: {
      projectId,
      fetchAll,
      page,
      size,
      keyword,
      deadlineStartDate,
      deadlineEndDate,
      scheduled,
      delayed,
      withinScheduleTime
    }
  })
}

export function getJobInfo ({ solutionId, jobId }) {
  return request({
    url: '/job/info',
    method: 'GET',
    params: {
      solutionId,
      jobId
    }
  })
}
