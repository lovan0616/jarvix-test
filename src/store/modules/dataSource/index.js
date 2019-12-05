import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    isInit: false,
    dataSourceList: [],
    dataSourceId: null,
    dataSourceCloumnInfoList: [],
    dataSourceDataValueList: [],
    appQuestion: null,
    currentQuestionInfo: null,
    historyQuestionList: [],
    filterList: [
      {
        status: true,
        restriction: [
          {
            type: 'range',
            properties: {
              dc_name: 'col_1',
              start: '2018年1月',
              end: '2018年11月'
            }
          }
        ]
      },
      {
        status: true,
        restriction: [
          {
            type: 'enum',
            properties: {
              dc_name: 'col_2',
              datavalues: ['US', 'CN', 'JP', 'KR']
            }
          }
        ]
      },
      {
        status: true,
        restriction: [
          {
            type: 'compound',
            restraints: [
              {
                type: 'enum',
                properties: {
                  dc_name: 'col_1',
                  datavalues: ['US', 'CN', 'JP', 'KR']
                }
              },
              {
                type: 'range',
                properties: {
                  dc_name: 'col_1',
                  start: '2018年1月',
                  end: '2018年11月'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  actions,
  mutations,
  getters
}
