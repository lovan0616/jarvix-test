import request from '@/utils/publicRequest'
import store from '@/store'

/**
 * get data source list
 */
export function getDataSourceList () {
  const groupId = store.getters['userManagement/getCurrentGroupId']
  return request({
    url: `/datasources/new/${groupId}`,
    method: 'GET'
  })
}

/**
 * createDataSource
 * @param {String} dataSourceInfo.name - 資料源名稱
 * @param {Number} dataSourceInfo.groupId - 專案 id
 */
export function createDataSource (dataSourceInfo) {
  return request({
    url: '/datasources',
    method: 'POST',
    data: dataSourceInfo
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
export function getDataSourceColumnInfoById(dataSourceId, dataFrameId) {
  return request({
    url: `/datasources/${dataSourceId}/dataColumns/name`,
    method: 'GET',
    params: {
      dataFrameId
    }
  })
}

/**
 * get dataSource data value
 * @param {Number} dataSourceId - 資料源 ID
 */
export function getDataSourceDataValueById(dataSourceId, dataFrameId, size = 50) {
  return request({
    url: `/datasources/${dataSourceId}/dataValue`,
    method: 'GET',
    params: {
      dataFrameId,
      size
    }
  })
}

/**
 * get data frame by dataSourceId
 * @param {Number} dataSourceId - 欲檢查的資料源 ID
 */
export function getDataFrameById (dataSourceId, getAllState = false) {
  return request({
    url: `datasources/${dataSourceId}/dataFrame`,
    method: 'GET',
    params: {
      stateList: getAllState ? [] : 'Enable'
    }
  })
}

/**
 * get data of dataframe by dataFrameId
 * @param {Number} dataFrameId - 欲檢查的資料表 ID
 */
export function getDataFrameData (dataFrameId, page = 0, cancelToken) {
  // FIXME just default a big size, doesn't implement with pagination
  return request({
    url: `/dataFrame/${dataFrameId}/data`,
    method: 'GET',
    params: {
      page,
      size: 20
    },
    cancelToken
  })
}

/**
 * delete dataframe by dataFrameId
 * @param {Number} dataFrameId - 欲檢查的資料表 ID
 */
export function deleteDataFrameById (dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}`,
    method: 'DELETE'
  })
}

/**
 * get data column by dataFrameId
 * @param {Number} dataFrameId - 欲檢查的資料表 ID
 * @param {Boolean} hasFeature
 * @param {Boolean} hasAliasLimit - ture: get one primary alias, false: get all alias
 */
export function getDataFrameColumnInfoById (dataFrameId, hasFeature = true, hasAliasLimit = true) {
  return request({
    url: `/dataColumn/dataFrame/${dataFrameId}?hasFeature=${hasFeature}&hasAliasLimit=${hasAliasLimit}`,
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

/**
 * get data value
 */
export function getDataValue (columnId) {
  return request({
    url: `/dataColumn/${columnId}`,
    method: 'GET'
  })
}

/**
 * get dataColumn ans dataValue
 */
export function getDataColumnDataValue (dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/dataColumn/aliasAndValue`,
    method: 'GET'
  })
}

/**
 * get all columns whose stats_type is marked as Datetime
 */
export function getDateTimeColumns (dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/columns/datetime`,
    method: 'GET'
  })
}

/**
 * set specific column as main datetime
 * @param {Number} dataFrameId
 * @param {Object} dataColumnData - 送給後端的資料物件
 * @param {String} dataColumnData.dataColumnName - 時間欄位名稱
 * @param {String} dataColumnData.dataColumnPrimaryAlias - 時間欄位別名
 */
export function setMainDateTimeColumn (dataFrameId, dataColumnData) {
  return request({
    url: `/dataFrame/${dataFrameId}/columns/datetime/default`,
    method: 'PUT',
    data: dataColumnData
  })
}

/*
 * data preprocessor
 */
export function dataPreprocessor (data) {
  return request({
    url: `/data/preprocessor`,
    method: 'POST',
    data
  })
}

/*
 * data re-preprocessor
 */
export function dataRepreprocessor (data) {
  return request({
    url: `/data/repreprocessor`,
    method: 'POST',
    data
  })
}

/*
 * Dataframe column summary
 */
export function dataFrameColumnSummary (dataFrameId, cancelToken) {
  return request({
    url: `/dataFrame/${dataFrameId}/summary`,
    method: 'GET',
    cancelToken
  })
}

/**
 * get column correlation matrix
 * @param {Number} dataFrameId - 欲查閱的資料表 ID
 */
export function getColumnCorrelationMatrix (dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/relationMatrix`,
    method: 'GET'
  })
}

/**
 * get dataframe etl setting
 * @param {Number} dataFrameId - 欲查閱的資料表 ID
 */
export function getDataFrameEtlSetting (dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/importSetting`,
    method: 'GET'
  })
}

/**
 * get batch load setting
 * @param {Number} dataFrameId - 欲查閱的資料表 ID
 */
export function getBatchLoadSetting(dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/corntabConfig`,
    method: 'GET'
  })
}

/**
 * set batch load
 * @param {Number} dataFrameId - 欲設定的資料表 ID
 * @param {Object} data - 送給後端的設定資料
 */
export function setBatchLoad(dataFrameId, data) {
  return request({
    url: `/dataFrame/${dataFrameId}/corntabConfig`,
    method: 'POST',
    data
  })
}

/**
 * update batch load setting
 * @param {Number} dataFrameId - 欲更新的資料表 ID
 * @param {Object} data - 送給後端的設定資料
 */
export function updateBatchLoadSetting(dataFrameId, data) {
  return request({
    url: `/dataFrame/${dataFrameId}/corntabConfig`,
    method: 'PUT',
    data
  })
}

/**
 * change batch load setting status
 * @param {Number} dataFrameId - 欲更新的資料表 ID
 * @param {Object} status - 是否啟動設定
 */
export function changeBatchLoadSettingStatus(dataFrameId, status = 'Disable') {
  return request({
    url: `/dataFrame/${dataFrameId}/corntabConfig/status`,
    method: 'PATCH',
    data: {
      status
    }
  })
}
