import request from '@/schedule/utils/publicRequest.js'

/**
 * 建立排程子專案
 * @param {Number} data - groupId
 * @param {String} data - project name
 */
export function createProject (data) {
  return request({
    url: '/project',
    method: 'POST',
    data
  })
}

/**
 * 取得 group 之下所有排程子專案
 * @param {Number} groupId
 */
export function fetchProjectList (groupId) {
  return request({
    url: `/project/group/${groupId}`,
    method: 'GET'
  })
}

/**
 * 建立新的排程子專案，並綁定到已存在的資料源
 * @param {Number} data - groupId
 * @param {String} data - name
 * @param {Number} data - datasourceId
 */
export function postProjectWithDatasource (data) {
  return request({
    url: `/project/create/withDatasource`,
    method: 'POST',
    data
  })
}

/**
 * 建立新的排程子專案，並綁定到同時新建立的資料源
 * @param {Number} data - groupId
 * @param {String} data - name
 * @param {Number} data - datasourceName
 */
export function postProjectNewDatasource (data) {
  return request({
    url: `/project/create/newDatasource`,
    method: 'POST',
    data
  })
}

/**
 * 子專案重新命名
 * @param {Number} data - id 子專案 id
 * @param {String} data - name 子專案新名字
 */
export function renameProject (data) {
  return request({
    url: `/project/rename`,
    method: 'POST',
    data
  })
}

/**
 * 刪除子專案重新命名
 * @param {Number} data - id 子專案 id
 */
export function deleteProject (projectId) {
  return request({
    url: `/project/${projectId}`,
    method: 'DELETE'
  })
}

/**
 * 更換專案綁定的資料源
 * @param {Number} data - id 子專案 id
 * @param {Number} data - datasourceId 資料源 id
 */
export function rebindDataSource (data) {
  return request({
    url: '/project/rebind',
    method: 'POST',
    data
  })
}