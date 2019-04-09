import variables from '@/styles/App.scss'

export function changeItemStyleByKpi (kpi) {
  return function (params) {
    if (params.value[1] < kpi) return variables['theme-color-danger']
    return variables['theme-color-primary-dark']
  }
}
