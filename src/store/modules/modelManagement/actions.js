import { getModelInfo } from '@/API/Model'

export default {
  getModelInfo ({ commit }, modelId) {
    return getModelInfo(modelId)
      .then(({name, in_used}) => {
        // TODO 
        commit('setModelInfo', {modelId, name, inUsed: false})
      })
  }
}