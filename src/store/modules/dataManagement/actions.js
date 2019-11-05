import { buildStorage } from '@/API/Storage'

export default {
  // build storage
  buildStorage ({ commit, state }, data) {
    return buildStorage(state.currentUploadInfo.storageId, state.currentUploadInfo.dataSourceId, data)
  }
}
