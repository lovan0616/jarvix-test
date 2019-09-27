import i18n from '@/lang/index.js'

const errorCodes = [
  // error
  'SYERR0001',
  'SYERR0002',
  'SYERR0003',
  'SYERR0004',
  'SYERR0005',
  'SYERR0006',
  'SYERR0007',
  'SYERR0008',
  'SYERR0009',
  'SYERR0010',
  // warn
  'SYWARN0001',
  'SYWARN0002',
  'SYWARN0003',
  'SYWARN0004',
  'SYWARN0005',
  'SYWARN0006',
  'SYWARN0007',
  'SYWARN0008',
  'SYWARN0009',
  // app error
  'APPERR0001',
  'APPWARN0001',
  'APPWARN0002',
  'APPWARN0003',
  'APPWARN0004'
]
export const errorsMessage = errorCodes.map(code => ({code: i18n.t(`errorMessage.${code}`)}))
