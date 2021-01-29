export function compileMiniApp (appData = {}) {
  const updatedAppData = JSON.parse(JSON.stringify(appData))
  const { editModeData, viewModeData } = updatedAppData.settings

  // Basic check
  // 確認有無 dashboard
  const hasDashboard = editModeData.dashboards.length > 0 || viewModeData.dashboards.length > 0
  if (!hasDashboard) return updatedAppData

  // 確認所有 Dashboard 有無 component
  const hasComponent = dashboard => dashboard.components.length > 0
  const hasDashboardWithComponent = editModeData.dashboards.some(hasComponent) || viewModeData.dashboards.some(hasComponent)
  if (!hasDashboardWithComponent) return updatedAppData

  // 2020.01.28 後版本
  // 針對 table 元件進行關聯設定：從只能設定欄位到能設定整條列
  const hasColumnRelatedDashboardSetting = component => component.config.hasOwnProperty('hasColumnRelatedDashboard')
  const hasComponentWithColumnRelatedDashboardSetting = dashboard => dashboard.components.some(hasColumnRelatedDashboardSetting)
  const hasAnyComponentWithColumnRelatedDashboardSetting = editModeData.dashboards.some(hasComponentWithColumnRelatedDashboardSetting) || viewModeData.dashboards.some(hasComponentWithColumnRelatedDashboardSetting)

  if (hasAnyComponentWithColumnRelatedDashboardSetting) {
    const isInEditMode = editModeData.dashboards.some(hasComponentWithColumnRelatedDashboardSetting)
    const isInViewMode = viewModeData.dashboards.some(hasComponentWithColumnRelatedDashboardSetting)
  }


  return updatedAppData
}