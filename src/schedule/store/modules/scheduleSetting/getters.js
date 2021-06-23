import i18n from '@/lang/index.js'

export default {
  getCurrentProject (state) {
    return state.scheduleProjects.find(item => item.id === state.scheduleProjectId)
  },
  // 鈺齊排程
  isYKSchedule () {
    return window.location.hostname === 'jarvix.sp1.sis.ai' || window.location.hostname === 'jarvix.synergiesai.cn'
  },
  jobTableHeaderList (state, getters) {
    return getters.isYKSchedule ? [
      { title: 'generalNumber', name: i18n.t('schedule.simulation.yukiTable.generalNumber'), width: '' },
      { title: 'shortName', name: i18n.t('schedule.simulation.yukiTable.shortName'), width: '' },
      { title: 'subJob', name: i18n.t('schedule.simulation.yukiTable.subJob'), width: '150' },
      { title: 'deadline', name: i18n.t('schedule.simulation.yukiTable.deadline'), width: '' },
      { title: 'confirmDate', name: i18n.t('schedule.simulation.yukiTable.confirmDate'), width: '' },
      { title: 'size', name: i18n.t('schedule.simulation.yukiTable.size'), width: '' },
      { title: 'sizeCode', name: i18n.t('schedule.simulation.yukiTable.sizeCode'), width: '' },
      { title: 'quantity', name: i18n.t('schedule.simulation.yukiTable.quantity'), width: '' },
      { title: 'factory', name: i18n.t('schedule.simulation.yukiTable.factory'), width: '' },
      { title: 'depart', name: i18n.t('schedule.simulation.yukiTable.depart'), width: '' },
      { title: 'owner', name: i18n.t('schedule.simulation.yukiTable.owner'), width: '' },
      { title: 'acceptDate', name: i18n.t('schedule.simulation.yukiTable.acceptDate'), width: '' },
      { title: 'customerName', name: i18n.t('schedule.simulation.yukiTable.customerName'), width: '' },
      { title: 'shoeName', name: i18n.t('schedule.simulation.yukiTable.shoeName'), width: '180' },
      { title: 'codeNo', name: i18n.t('schedule.simulation.yukiTable.codeNo'), width: '180' },
      { title: 'head', name: i18n.t('schedule.simulation.yukiTable.head'), width: '' },
      { title: 'fullMold', name: i18n.t('schedule.simulation.yukiTable.fullMold'), width: '' },
      { title: 'mold', name: i18n.t('schedule.simulation.yukiTable.mold'), width: '' },
      { title: 'bottom', name: i18n.t('schedule.simulation.yukiTable.bottom'), width: '' },
      { title: 'cutter', name: i18n.t('schedule.simulation.yukiTable.cutter'), width: '' },
      { title: 'seasonCode', name: i18n.t('schedule.simulation.yukiTable.seasonCode'), width: '' },
      { title: 'deliveryNote', name: i18n.t('schedule.simulation.yukiTable.deliveryNote'), width: '' },
      { title: 'customerPo', name: i18n.t('schedule.simulation.yukiTable.customerPo'), width: '' },
      { title: 'color', name: i18n.t('schedule.simulation.yukiTable.color'), width: '180' },
      { title: 'paymentCompany', name: i18n.t('schedule.simulation.yukiTable.paymentCompany'), width: '' },
      { title: 'poCustomer', name: i18n.t('schedule.simulation.yukiTable.poCustomer'), width: '' },
      { title: 'planFactory', name: i18n.t('schedule.simulation.yukiTable.planFactory'), width: '' },
      { title: 'planStart', name: i18n.t('schedule.simulation.yukiTable.planStart'), width: '' },
      { title: 'planEnd', name: i18n.t('schedule.simulation.yukiTable.planEnd'), width: '' },
      { title: 'sum', name: i18n.t('schedule.simulation.yukiTable.sum'), width: '' },
      { title: 'cutQuantity', name: i18n.t('schedule.simulation.yukiTable.cutQuantity'), width: '' },
      { title: 'boxes', name: i18n.t('schedule.simulation.yukiTable.boxes'), width: '' },
      { title: 'receiptPlace', name: i18n.t('schedule.simulation.yukiTable.receiptPlace'), width: '' },
      { title: 'deliveryPlace', name: i18n.t('schedule.simulation.yukiTable.deliveryPlace'), width: '' },
      { title: 'productType', name: i18n.t('schedule.simulation.yukiTable.productType'), width: '' },
      { title: 'brand', name: i18n.t('schedule.simulation.yukiTable.brand'), width: '' },
      { title: 'bDeliveryDate', name: i18n.t('schedule.simulation.yukiTable.bDeliveryDate'), width: '' },
      { title: 'aDeliveryDate', name: i18n.t('schedule.simulation.yukiTable.aDeliveryDate'), width: '' },
      { title: 'bDate', name: i18n.t('schedule.simulation.yukiTable.bDate'), width: '210' },
      { title: 'aDate', name: i18n.t('schedule.simulation.yukiTable.aDate'), width: '210' },
      { title: 'sampleSize', name: i18n.t('schedule.simulation.yukiTable.sampleSize'), width: '' },
      { title: 't4Date', name: i18n.t('schedule.simulation.yukiTable.t4Date'), width: '' }
    ] : [
      { title: 'job', name: i18n.t('schedule.simulation.table.job'), width: '' },
      { title: 'order', name: i18n.t('schedule.simulation.table.order'), width: '' },
      { title: 'product', name: i18n.t('schedule.simulation.table.product'), width: '' },
      { title: 'deadline', name: i18n.t('schedule.simulation.table.deadline'), width: '120' },
      { title: 'quantity', name: i18n.t('schedule.simulation.table.quantity'), width: '120' }
    ]
  }
}