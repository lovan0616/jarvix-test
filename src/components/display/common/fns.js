import variables from '@/styles/common/variables.scss'

const colorListDanger10 = [variables['theme-color-danger'], variables['theme-color-danger-light-1'], variables['theme-color-danger-light-2'], variables['theme-color-danger-light-3'], variables['theme-color-danger-light-4'], variables['theme-color-danger-light-5'], variables['theme-color-danger-light-6'], variables['theme-color-danger-light-7'], variables['theme-color-danger-light-8'], variables['theme-color-danger-light-9']]

export function setSeriesDataColorDangerByIndex (target) {
  return function ({ colIndex, rowIndex }) {
    if (!matchIndex(target, rowIndex)) return {}
    else {
      return {
        itemStyle: {
          color: colorListDanger10[colIndex % 10]
        }
      }
    }
  }
}

function matchIndex (target, value) {
  if (typeof target === 'number') {
    return target === value
  } else if (Array.isArray(target)) {
    return target.find(c => c === value) !== undefined
  } else {
    return false
  }
}
