const updateAppSettingVersion = (appInfo) => {
  const versionList = ['1.0.0', '1.0.1']
  const returnData = appInfo
  if (!returnData.settings.version) { returnData.settings.version = '1.0.0' }
  while (returnData.settings.version !== versionList[versionList.length - 1]) {
    const currentVersionIndex = versionList.indexOf(returnData.settings.version)
    const nextVersion = versionList[currentVersionIndex + 1]

    if (nextVersion === '1.0.1') {
      const settingsArr = ['editModeData', 'viewModeData']
      settingsArr.forEach((key) => {
        returnData.settings[key].dashboards.forEach((dashboard) => {
          dashboard.components.forEach((component) => {
            component.position = {
              x: 0, // add position
              y: 0,
              row: component.config.size?.row ?? 6,
              column: component.config.size?.column ?? 6
            }
            delete component.config.size // remove component .config.size

            component.config.isCustomizeTitle = true // add custom title flag
          })
        })
      })
    }

    returnData.settings.version = nextVersion
  }
  return returnData
}

export default updateAppSettingVersion
