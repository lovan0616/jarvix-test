import { getModelInfo } from '@/API/Model'

export default {
  getModelInfo ({ commit }, modelId) {
    return getModelInfo(modelId)
      .then(({name, inUse}) => {
        commit('setModelInfo', {modelId, name, inUse: inUse})
      })
  }
}