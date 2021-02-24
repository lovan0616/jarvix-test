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
 * @param {Array} columns - 篩選的欄位(帶入勾選的選項, 全部選為 null, 都沒選為 [])
 */
export function getDataSourceColumnInfoById(dataSourceId, dataFrameId, columns = null, restrictions) {
  return request({
    url: `/datasources/${dataSourceId}/dataColumns/name/search`,
    method: 'POST',
    params: {
      dataFrameId
    },
    data: {
      columns,
      restrictions
    }
  })
}

/**
 * get dataSource data value
 * @param {Number} dataSourceId - 資料源 ID
 * @param {Array} columns - 篩選的欄位(帶入勾選的選項, 全部選為 null, 都沒選為 [])
 */
export function getDataSourceDataValueById(dataSourceId, dataFrameId, columns = null, restrictions, size = 50) {
  return request({
    url: `/datasources/${dataSourceId}/dataValue/search`,
    method: 'POST',
    params: {
      dataFrameId,
      size
    },
    data: {
      columns,
      restrictions
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
export function getDataFrameData(dataFrameId, selectedColumnList, restrictions, page = 0, cancelToken) {
  // FIXME just default a big size, doesn't implement with pagination
  return request({
    url: `/dataFrame/${dataFrameId}/data/search`,
    method: 'POST',
    params: {
      page,
      size: 20
    },
    data: {
      selectedColumnList,
      restrictions
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
 * @param {Boolean} hasAliasLimit - true: get one primary alias, false: get all alias
 * @param {Boolean} hasBlockClustering - whether to filter out clustering columns
 */
export function getDataFrameColumnInfoById(dataFrameId, hasFeature = true, hasAliasLimit = true, hasBlockClustering = false) {
  return request({
    url: `/dataColumn/dataFrame/${dataFrameId}?hasFeature=${hasFeature}&hasAliasLimit=${hasAliasLimit}&hasBlockClustering=${hasBlockClustering}`,
    method: 'GET'
  })
}

/**
 * update dataColumn primaryAlias by dataColumnId
 * @param {Object} dataColumn - 欲更新的欄位
 * @param {Number} dataColumn.id - id
 * @param {string} dataColumn.primaryAlias - primaryAlias
 */
export function patchDataColumnPrimaryAlias (dataColumn) {
  return request({
    url: `/dataColumn/display-alias`,
    method: 'PATCH',
    data: dataColumn
  })
}

/**
 * delete dataColumn by id
 * @param {Number} dataColumnId - id
 */
export function deleteDataColumnById(dataColumnId) {
  return request({
    url: `/dataColumn/clustering-columns/${dataColumnId}  `,
    method: 'DELETE'
  })
}

/**
 * fuzzy search dataColumn value by id
 * @param {Number} dataColumnId - id
 */
export function dataValueSearch(dataColumnId, searchInfo) {
  return request({
    url: `/dataColumn/${dataColumnId}/dataValue-search`,
    method: 'POST',
    data: {
      page: 0,
      size: 200,
      restrictions: null,
      ...searchInfo
    }
  })
}

/**
 * get dataColumn value by id
 * @param {Number} dataColumnId - id
 * @param {String} searchString - query
 */
export function getDataColumnValue(dataColumnId) {
  return request({
    url: `/dataColumn/${dataColumnId}/value-and-alias`,
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
export function dataFrameColumnSummary(dataFrameId, selectedColumnList, restrictions, cancelToken) {
  return request({
    url: `/dataFrame/${dataFrameId}/summary/search`,
    method: 'POST',
    data: {
      selectedColumnList,
      restrictions
    },
    cancelToken
  })
}

/**
 * get column correlation matrix
 * @param {Number} dataFrameId - 欲查閱的資料表 ID
 */
export function getColumnCorrelationMatrix(dataFrameId, selectedColumnList, restrictions) {
  return request({
    url: `/dataFrame/${dataFrameId}/relationMatrix/search`,
    method: 'POST',
    data: {
      selectedColumnList,
      restrictions
    }
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
    url: `/dataFrame/${dataFrameId}/crontab/config`,
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
    url: `/dataFrame/${dataFrameId}/crontab/config`,
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
    url: `/dataFrame/${dataFrameId}/crontab/config`,
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
    url: `/dataFrame/${dataFrameId}/crontab/config/status`,
    method: 'PATCH',
    data: {
      status
    }
  })
}

/**
 * trigger calculated data summary and relation matrix
 * @param {Number} dataFrameId - 欲計算的資料表 ID
 */
export function triggerColumnDataCalculation(dataFrameId, restrictions) {
  return request({
    url: `/dataFrame/${dataFrameId}/calculated/data/trigger`,
    method: 'POST',
    data: {
      restrictions
    }
  })
}

/**
 * trigger get data immediately
 * @param {Number} dataFrameId - 欲更新的資料表 ID
 */
export function triggerUpdateData (dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/crontab/config/triggerUpdateData`,
    method: 'PATCH'
  })
}

/**
 * 資料更新設定
 * @param {Number} dataFrameId - 欲更新的資料表 ID
 */
export function updateDataUpdateSetting (dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/crontab/config/column`,
    method: 'PUT'
  })
}

/**
 * 取得dataFrame DB連線資訊
 * @param {Number} dataFrameId - 欲查閱的資料表 ID
 */
export function getDataFrameCreatedInfo(dataFrameId) {
  return request({
    url: `/dataFrame/${dataFrameId}/advanced/info`,
    method: 'GET'
  })
}

/**
 * 將分群結果儲存為欄位
 * @param {Object} inputData
 * @param {Number} inputData.askResultId - 欲儲存的分群結果
 * @param {String} inputData.primaryAlias - 儲存的欄位名稱
 */
export function saveClusteringColumn (data) {
  return request({
    url: `/dataColumn/clustering-columns`,
    method: 'POST',
    data
  })
}

/**
 * 確認分群欄位的建置狀態
 * @param {Number} taskId - 背景建置工作 id
 */
export function checkClusteringColumnStatus (taskId) {
  return request({
    url: `/dataColumn/clustering-columns/${taskId}`,
    method: 'GET'
  })
}

/**
 * update numeric column ordinal setting
 * @param {Object} data - 欄位設定資料
 */
export function updateColumnOrdinality(data) {
  return request({
    url: `/dataColumn/ordinality`,
    method: 'PUT',
    data
  })
}
