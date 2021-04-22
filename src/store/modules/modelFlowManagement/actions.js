import { updateModelFlow, deleteModelFlow } from '@/API/ModelFlow'
import { Message } from 'element-ui'
import i18n from '@/lang/index.js'

export default {
  updateModelFlow ({ state }, flowId) {
    return updateModelFlow(flowId)
      .then(() => {
        Message({
          message: i18n.t('modelFlow.updateAtBackground'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      })
      .catch(() => {})
  },
  deleteModelFlow ({ state }, flowId) {
    return deleteModelFlow(flowId)
      .then(() => {
        Message({
          message: i18n.t('message.deleteSuccess'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
    })
  }
}