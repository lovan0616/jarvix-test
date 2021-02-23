export function compileMiniApp(appData = {}) {
  const updatedAppData = JSON.parse(JSON.stringify(appData))
  let { editModeData, viewModeData } = updatedAppData.settings

  /**
  * 更新不同模式下的資料
  * @param { editModeData } - 編輯模式下的資料
  * @param { viewModeData } - 發布模式下的資料
  * @returns { data, isDataChanged } - 更新後的資料, 是否有任何資料被更新
  */
  const updatedEditModeInfo = compileModeData(editModeData)
  const updatedViewModeInfo = compileModeData(viewModeData)

  updatedAppData.settings.editModeData = updatedEditModeInfo.data
  updatedAppData.settings.viewModeData = updatedViewModeInfo.data

  return {
    updatedAppData,
    isDataChanged: updatedEditModeInfo.isDataChanged || updatedViewModeInfo.isDataChanged
  }
}

// 更新單一模式的資料
function compileModeData(modeData) {
  const updatedModeData = JSON.parse(JSON.stringify(modeData))
  let isDataChanged = false

  // 至少需要符合哪些基本條件才需要進行向下兼容任務
  const hasMetBasicCriteria = checkHasMetMinimumCriteria(updatedModeData)
  if (!hasMetBasicCriteria) return { data: updatedModeData, isDataChanged }

  /*
  * 2020.01.28 後版本
  * [更新一] 針對 table 元件進行關聯設定：從只能設定欄位到能設定整條列
  */
  const hasColumnRelatedDashboardSetting = component => component.config.hasOwnProperty('hasColumnRelatedDashboard')
  const hasOldTableRelationSetting = updatedModeData.dashboards.some(dashboard => dashboard.components.some(hasColumnRelatedDashboardSetting))
  if (hasOldTableRelationSetting) {
    isDataChanged = true
    updatedModeData.dashboards = updateColumnRelationDashboardSetting(updatedModeData.dashboards)
  }

  return { data: updatedModeData, isDataChanged }
}

// Basic Check：至少要符合這些基本條件才需要進行向下兼容
function checkHasMetMinimumCriteria(modeData) {
  // 至少有一個 dashboard
  const hasDashboard = modeData.dashboards.length > 0
  if (!hasDashboard) return false

  // 至少有一個 dashboard 含有一個以上的元件
  const hasComponent = dashboard => dashboard.components.length > 0
  const hasDashboardWithComponent = modeData.dashboards.some(hasComponent)
  if (!hasDashboardWithComponent) return false

  return true
}

function updateColumnRelationDashboardSetting(dashboards) {
  return dashboards.map(dashboard => ({
    ...dashboard,
    components: dashboard.components.map(component => convertToColumnRelationComponent(component))
  }))
}

function convertToColumnRelationComponent(component) {
  if (!component.config.hasOwnProperty('hasColumnRelatedDashboard')) return component
  const updatedComponent = JSON.parse(JSON.stringify(component))

  // 增添新增項目
  updatedComponent.config.hasTableRelatedDashboard = component.config.hasColumnRelatedDashboard
  updatedComponent.config.tableRelationInfo = {
    triggerTarget: 'column',
    columnRelations: component.config.columnRelations,
    rowRelation: { relatedDashboardId: null }
  }

  // 移除刪除項目
  delete updatedComponent.config.hasColumnRelatedDashboard
  delete updatedComponent.config.columnRelations
  return updatedComponent
}
