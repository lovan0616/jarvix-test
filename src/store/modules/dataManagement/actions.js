import { buildStorage } from '@/API/Upload'

export default {
  // build storage
  buildStorage ({ commit, state }, data) {
    return buildStorage(state.currentUploadInfo.storageId, state.currentUploadInfo.bookmarkId, data)
  }
}
