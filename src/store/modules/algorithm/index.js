import actions from './actions'
import mutations from './mutations'
import getters from './getters'

function getAlgorithms () {
  let result = localStorage.getItem('algorithms')
  if (result === null) return []
  else return JSON.parse(result)
}

export default {
  namespaced: true,
  state: {
    algorithms: getAlgorithms()
  },
  actions,
  mutations,
  getters
}
