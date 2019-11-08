import request from '@/utils/publicRequest'

/**
 * get data source list
 */
export function getDataSourceList () {
  return request({
    url: '/datasources',
    method: 'GET'
  })
}

/**
 * createDataSource
 * @param {String} name - 資料源名稱
 */
export function createDataSource (name) {
  return request({
    url: '/datasources',
    method: 'POST',
    data: {
      name
    }
  })
}

/**
 * get dataSource by id
 * @param {Number} dataSourceId - 欲取得的資料源 ID
 */
export function getDataSourceById (dataSourceId) {
  return request({
    url: `/datasources/${dataSourceId}`,
    method: 'GET'
  })
}

/**
 * check dataSource status by id
 * @param {Number} dataSourceId - 欲檢查的資料源 ID
 */
export function checkDataSourceStatusById (dataSourceId) {
  return request({
    url: `/datasources/${dataSourceId}`,
    method: 'GET'
  })
}

/**
 * delete dataSource by id
 * @param {Number} dataSourceId - 欲刪除的資料源 ID
 */
export function deleteDataSourceById (dataSourceId) {
  return request({
    url: `/datasources/${dataSourceId}`,
    method: 'DELETE'
  })
}

/**
 * rename dataSource by id
 * @param {Number} dataSourceId - 欲刪除的資料源 ID
 * @param {String} name - dataSource new name
 */
export function renameDataSourceById (dataSourceId, name) {
  return request({
    url: `/datasources/${dataSourceId}/name`,
    method: 'PUT',
    data: {
      name
    }
  })
}

/**
 * get dataSource column info
 * @param {Number} dataSourceId - 資料源 ID
 */
export function getDataSourceColumnInfoById (dataSourceId) {
  return request({
    url: `/datasources/${dataSourceId}/datacolumns/name`,
    method: 'GET'
  })
}

/**
 * get dataSource data value
 * @param {Number} dataSourceId - 資料源 ID
 */
export function getDataSourceDataValueById (dataSourceId, size = 50) {
  return request({
    url: `/datasources/${dataSourceId}/datavalue`,
    method: 'GET',
    params: {
      size: size
    }
  })
}

/**
 * get data frame by dataSourceId
 * @param {Number} dataSourceId - 欲檢查的資料源 ID
 */
export function getDataFrameById (dataSourceId) {
  return request({
    url: `/dataFrame/dataSource/${dataSourceId}`,
    method: 'GET'
  })
}

/**
 * get data column by dataFrameId
 * @param {Number} dataFrameId - 欲檢查的資料表 ID
 */
export function getDataFrameColumnInfoById (dataFrameId) {
  return request({
    url: `/dataColumn/dataFrame/${dataFrameId}`,
    method: 'GET'
  })
}

/**
 * update dataFrame alias
 * @param {Object} userEditedInput - 欲更新的資料
 * @param {Number} userEditedInput.dataFrameId - dataFrameId
 * @param {Number} userEditedInput.dataSourceId - dataSourceId
 * @param {Array} userEditedInput.userEditedColumnInputList - 欄位清單
 */
export function updateDataFrameAlias (userEditedInput) {
  return request({
    url: `/datasources/userEdited`,
    method: 'POST',
    data: userEditedInput
  })
}

/**
 * get dataFrame relation by dataFrameId
 * @param {Number} dataSourceId - 欲檢查的資料源 ID
 */
export function getDataFrameRelationById (dataSourceId) {
  return request({
    url: `/dataFrame/relation`,
    method: 'GET',
    params: {
      dataSourceId
    }
  })
}

/**
 * save dataFrame relation
 * @param {Object} inputData
 * @param {Number} inputData.leftDataColumnId - 左邊 columnID
 * @param {Number} inputData.rightDataColumnId - 左邊 columnID
 */
export function saveDataFrameRelation (inputData) {
  return request({
    url: `/dataFrame/relation`,
    method: 'POST',
    data: inputData
  })
}

/**
 * update dataFrame relation
 * @param {Number} relationId
 * @param {Object} inputData - 送給後端的資料物件
 * @param {Number} inputData.leftDataColumnId - 左邊 columnID
 * @param {Number} inputData.rightDataColumnId - 左邊 columnID
 */
export function updateDataFrameRelationById (relationId, inputData) {
  return request({
    url: `/dataFrame/relation/${relationId}`,
    method: 'PUT',
    data: inputData
  })
}

/**
 * delete dataFrame relation
 * @param {Number} relationId
 * @param {Object} inputData
 * @param {Number} inputData.leftDataColumnId - 左邊 columnID
 * @param {Number} inputData.rightDataColumnId - 左邊 columnID
 */
export function deleteDataFrameRelationById (relationId) {
  return request({
    url: `/dataFrame/relation/${relationId}`,
    method: 'DELETE'
  })
}
