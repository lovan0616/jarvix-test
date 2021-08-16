import request from '@/schedule/utils/publicRequest.js'

export function getRecommendedEmailList (project_id) {
  return request({
    url: `/email/project/${project_id}/recommend`,
    method: 'GET'
  })
}

export function createContact (data) {
  return request({
    url: '/email/addEmail',
    method: 'POST',
    data
  })
}

export function editContact (data) {
  return request({
    url: '/email/info',
    method: 'PUT',
    data
  })
}

export function createGroup (data) {
  return request({
    url: '/email/addGroup',
    method: 'POST',
    data
  })
}

export function deleteGroup (emailGroupId) {
  return request({
    url: `/email/group/${emailGroupId}`,
    method: 'DELETE'
  })
}

export function editGroup ({ emailGroupId, emailGroupName }) {
  return request({
    url: `/email/group/${emailGroupId}`,
    method: 'PUT',
    params: {
      emailGroupName
    }
  })
}

export function getContactGroups (projectId) {
  return request({
    url: `/email/project/${projectId}`,
    method: 'GET'
  })
}

export function deleteEmail (emailId) {
  return request({
    url: `/email/${emailId}`,
    method: 'DELETE'
  })
}
