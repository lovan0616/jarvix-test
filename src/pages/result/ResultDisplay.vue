<template>
  <div class="result-layout">
    <filter-info></filter-info>
    <spinner class="layout-spinner"
      v-if="isLoading"
      :title="$t('resultDescription.analysisProcessing')"
      size="50"
    ></spinner>
    <empty-result
      v-else-if="!layout"
    ></empty-result>
    <component
      v-else
      :is="layout"
      :data-result-id="currentResultId"
      :resultInfo="resultInfo"
    ></component>
    <!-- <display-group-line-chart
      :dataset="{
        data: [
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            22124,
            17044,
            61131,
            20391,
            5915,
            31737,
            23005,
            248582,
            40456,
            153161,
            417391,
            328395,
            54294,
            7037,
            248670,
            221291,
            22371
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            5328,
            13301,
            51686,
            19596,
            3353,
            26791,
            14816,
            227008,
            35031,
            148788,
            401344,
            332438,
            44895,
            3109,
            218247,
            154641,
            15946
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            6331,
            10493,
            62198,
            19515,
            7158,
            21925,
            15939,
            211540,
            34669,
            145049,
            467705,
            353098,
            73237,
            3274,
            235274,
            206469,
            27320
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            12835,
            20521,
            59040,
            23917,
            6055,
            33047,
            17411,
            228104,
            34230,
            152909,
            393915,
            303579,
            74149,
            6576,
            238595,
            203938,
            27942
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            14881,
            5775,
            67059,
            24361,
            7675,
            28978,
            16324,
            224051,
            40165,
            146794,
            416365,
            350073,
            41536,
            5757,
            243217,
            172783,
            29557
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            5933,
            9083,
            60715,
            19274,
            7697,
            27663,
            21430,
            216990,
            35634,
            158395,
            411461,
            331477,
            61876,
            5686,
            225966,
            217566,
            36721
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            26693,
            15741,
            57897,
            20294,
            8192,
            29541,
            17411,
            231277,
            32623,
            132113,
            430813,
            320619,
            69742,
            6943,
            247854,
            212340,
            37802
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            4683,
            10579,
            63768,
            20190,
            7620,
            25114,
            20887,
            209535,
            31684,
            170298,
            477618,
            326875,
            45295,
            6892,
            233186,
            193994,
            33844
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            20404,
            7249,
            55672,
            18463,
            6848,
            24258,
            21080,
            235620,
            25540,
            145113,
            445287,
            305120,
            68271,
            4118,
            237422,
            192963,
            38085
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            231489.89,
            null,
            5349,
            7844,
            54432,
            23337,
            6554,
            24558,
            18952,
            250322,
            27973,
            173420,
            422332,
            332229,
            44049,
            4776,
            254389,
            236842.03,
            42885
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            349598.41,
            null,
            3867,
            14726,
            58231,
            24335,
            7563,
            28593,
            18972,
            237588,
            29126,
            141857,
            444067,
            310054,
            39595,
            2577,
            244081,
            204992.35,
            29467
          ],
          [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            246529.42,
            null,
            12426,
            18555,
            57578,
            22319,
            8257,
            26999,
            22126,
            217593,
            36145,
            166213,
            448158,
            328032,
            72245,
            4492,
            239014,
            179032.96,
            26741
          ]
        ],
        index: [
          '2018年12月',
          '2019年01月',
          '2019年02月',
          '2019年03月',
          '2019年04月',
          '2019年05月',
          '2019年06月',
          '2019年07月',
          '2019年08月',
          '2019年09月',
          '2019年10月',
          '2019年11月'
        ],
        columns: [
          [
            '單車促銷',
            'Bike Racks'
          ],
          [
            '單車促銷',
            'Bike Stands'
          ],
          [
            '單車促銷',
            'Bottles and Cages'
          ],
          [
            '單車促銷',
            'Caps'
          ],
          [
            '單車促銷',
            'Cleaners'
          ],
          [
            '單車促銷',
            'Fenders'
          ],
          [
            '單車促銷',
            'Gloves'
          ],
          [
            '單車促銷',
            'Helmets'
          ],
          [
            '單車促銷',
            'Hydration Packs'
          ],
          [
            '單車促銷',
            'Jerseys'
          ],
          [
            '單車促銷',
            'Mountain Bikes'
          ],
          [
            '單車促銷',
            'Road Bikes'
          ],
          [
            '單車促銷',
            'Shorts'
          ],
          [
            '單車促銷',
            'Socks'
          ],
          [
            '單車促銷',
            'Tires and Tubes'
          ],
          [
            '單車促銷',
            'Touring Bikes'
          ],
          [
            '單車促銷',
            'Vests'
          ],
          [
            '原價',
            'Bike Racks'
          ],
          [
            '原價',
            'Bike Stands'
          ],
          [
            '原價',
            'Bottles and Cages'
          ],
          [
            '原價',
            'Caps'
          ],
          [
            '原價',
            'Cleaners'
          ],
          [
            '原價',
            'Fenders'
          ],
          [
            '原價',
            'Gloves'
          ],
          [
            '原價',
            'Helmets'
          ],
          [
            '原價',
            'Hydration Packs'
          ],
          [
            '原價',
            'Jerseys'
          ],
          [
            '原價',
            'Mountain Bikes'
          ],
          [
            '原價',
            'Road Bikes'
          ],
          [
            '原價',
            'Shorts'
          ],
          [
            '原價',
            'Socks'
          ],
          [
            '原價',
            'Tires and Tubes'
          ],
          [
            '原價',
            'Touring Bikes'
          ],
          [
            '原價',
            'Vests'
          ]
        ]
      }"
      :title="{
        xAxis: [{
          display_name: '日期',
          drillable: true
        }],
        yAxis: [{
          display_name: '收入總合',
          drillable: false
        }]
      }"
    ></display-group-line-chart> -->
    <div class="related-question-block" v-if="relatedQuestionList.length > 0">
      <div class="block-title">{{ $t('editing.relatedQuesion') }}</div>
      <div class="related-question-list">
        <preview-result-board class="result-board"
          v-for="(relatedQuestion, index) in relatedQuestionList"
          :key="index"
          :question-info="relatedQuestion"
        ></preview-result-board>
      </div>
    </div>
  </div>
</template>

<script>
import FilterInfo from '@/components/display/FilterInfo'

export default {
  name: 'ResultDisplay',
  components: {
    FilterInfo
  },
  data () {
    return {
      isLoading: false,
      layout: null,
      resultInfo: null,
      timeStamp: this.$route.query.stamp,
      relatedQuestionList: [],
      timeoutFunction: null
    }
  },
  watch: {
    '$route.query' ({ question, action, stamp }) {
      if (!question) return false
      this.fetchApiAsk({question, 'dataSourceId': this.dataSourceId})
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    currentQuestionInfo () {
      return this.$store.state.dataSource.currentQuestionInfo
    },
    currentQuestionId () {
      return this.$store.state.dataSource.currentQuestionId
    },
    currentResultId () {
      return this.$store.state.result.currentResultId
    },
    filterRestrictionList () {
      return this.$store.getters['dataSource/filterRestrictionList']
    }
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let dataSourceId = parseInt(this.$route.query.dataSourceId)
      if (question) {
        this.fetchApiAsk({dataSourceId, question})
      }
    },
    clearLayout () {
      this.layout = null
      this.resultInfo = null
      this.relatedQuestionList = []
    },
    fetchApiAsk (data) {
      this.clearLayout()
      this.isLoading = true
      this.$store.commit('chatBot/addUserConversation', data.question)
      this.$store.commit('chatBot/updateAnalyzeStatus', true)
      // 動態變更 title 為了方便前一頁、下一頁變更時可以快速找到
      document.title = `SyGPS-${data.question}`

      if (this.currentQuestionInfo) {
        this.$store.dispatch('chatBot/askResult', {
          questionId: this.currentQuestionId,
          segmentationPayload: this.currentQuestionInfo,
          restrictions: this.filterRestrictionList
        }).then(res => {
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
          this.getComponent(res)
        }).catch(() => {
          this.isLoading = false
          this.$store.commit('chatBot/updateAnalyzeStatus', false)
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })
        return false
      }

      this.$store.dispatch('chatBot/askQuestion', data)
        .then(response => {
          this.$store.dispatch('dataSource/getHistoryQuestionList', data.dataSourceId)
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
          let questionId = response.questionId
          this.$store.commit('dataSource/setCurrentQuestionId', questionId)
          let segmentationList = response.parseQuestionPayload.segmentations

          if (segmentationList.length === 1) {
            // 介紹資料集的處理
            if (segmentationList[0].implication.intent === 'Introduction') {
              this.layout = 'PreviewDataSource'
              this.resultInfo = null
              this.isLoading = false
              return false
            }
            this.$store.dispatch('chatBot/askResult', {
              questionId,
              segmentationPayload: segmentationList[0],
              restrictions: this.filterRestrictionList
            }).then(res => {
              this.getComponent(res)
            }).catch(() => {
              this.isLoading = false
            })
          } else {
            // 多個結果
            this.layout = 'MultiResult'
            this.resultInfo = response
            this.isLoading = false
          }
        }).catch(() => {
          this.isLoading = false
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })

      this.getRelatedQuestion(data)
    },
    getComponent (res) {
      window.clearTimeout(this.timeoutFunction)
      this.$store.commit('result/updateCurrentResultId', res.resultId)
      if (res.layout === 'no_answer') {
        this.layout = 'EmptyResult'
        this.resultInfo = {
          title: res.noAnswerTitle,
          description: res.noAnswerDescription
        }
        this.isLoading = false
        return false
      }

      this.$store.dispatch('chatBot/getComponentList', res.resultId)
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponent(res)
              }, 1000)
              break
            case 'Complete':
              this.resultInfo = componentResponse.componentIds
              this.layout = this.getLayout(res.layout)
              this.isLoading = false
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              this.layout = 'EmptyResult'
              this.isLoading = false
              break
          }
        })
    },
    getRelatedQuestion (data) {
      this.$store.dispatch('chatBot/getRelatedQuestionList', {
        question: data.question,
        dataSourceId: data.dataSourceId
      }).then(response => {
        this.$nextTick(() => {
          window.setTimeout(() => {
            this.$store.commit('chatBot/addSystemConversation', {
              text: response ? this.$t('bot.defaultResponse') : this.$t('bot.finish'), options: response
            })
            this.$store.commit('chatBot/updateAnalyzeStatus', false)
          }, 2000)
        })
      }).catch(() => {
        this.$store.commit('chatBot/addSystemConversation', {
          text: this.$t('bot.finish'), options: []
        })
        this.$store.commit('chatBot/updateAnalyzeStatus', false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.result-layout {
  width: 100%;

  .seciotn-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }
  .recommend-question-list-block {
    margin-top: 64px;

    .block-title {
      font-size: 24px;
      line-height: 40px;
      letter-spacing: 0.1em;
      margin-bottom: 48px;
    }

    .category-title {
      font-size: 18px;
      line-height: 26px;
      margin-bottom: 12px;
    }
  }

  .related-question-block {
    background-color: $theme-bg-color;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 28px 28px 4px;

    .block-title {
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 18px;
    }

    .related-question-list {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
