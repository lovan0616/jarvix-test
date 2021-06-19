import i18n from '@/lang/index.js'

export default {
  getCurrentProject (state) {
    return state.scheduleProjects.find(item => item.id === state.scheduleProjectId)
  },
  // 鈺齊排程
  isYKSchedule () {
    return true
  },
  jobTableHeaderList (state, getters) {
    return getters.isYKSchedule ? [
      { title: 'id', name: 'ID', width: '' },
      { title: 'order', name: i18n.t('schedule.simulation.yukiTable.order'), width: '' },
      { title: 'job', name: i18n.t('schedule.simulation.yukiTable.job'), width: '' },
      { title: 'product', name: i18n.t('schedule.simulation.yukiTable.product'), width: '180' },
      { title: 'quantity', name: i18n.t('schedule.simulation.yukiTable.quantity'), width: '' },
      { title: 'priority', name: i18n.t('schedule.simulation.yukiTable.priority'), width: '' },
      { title: 'deadline', name: i18n.t('schedule.simulation.yukiTable.deadline'), width: '' },
      { title: 'shortName', name: i18n.t('schedule.simulation.yukiTable.shortName'), width: '' },
      { title: 'shoeName', name: i18n.t('schedule.simulation.yukiTable.shoeName'), width: '180' },
      { title: 'bottom', name: i18n.t('schedule.simulation.yukiTable.bottom'), width: '' },
      { title: 'head', name: i18n.t('schedule.simulation.yukiTable.head'), width: '' },
      { title: 'aDate', name: i18n.t('schedule.simulation.yukiTable.aDate'), width: '' },
      { title: 'bDate', name: i18n.t('schedule.simulation.yukiTable.bDate'), width: '' },
      { title: 't4Date', name: i18n.t('schedule.simulation.yukiTable.t4Date'), width: '' },
      { title: 'ps', name: i18n.t('schedule.simulation.yukiTable.ps'), width: '180' }
    ] : [
      { title: 'job', name: i18n.t('schedule.simulation.table.job'), width: '' },
      { title: 'order', name: i18n.t('schedule.simulation.table.order'), width: '' },
      { title: 'product', name: i18n.t('schedule.simulation.table.product'), width: '' },
      { title: 'deadline', name: i18n.t('schedule.simulation.table.deadline'), width: '120' },
      { title: 'quantity', name: i18n.t('schedule.simulation.table.quantity'), width: '120' }
    ]
  }
}