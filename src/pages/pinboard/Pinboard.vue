<template>
  <div class="page-pinboard">
    <h1 class="page-title">{{ $t('editing.pinboard') }}</h1>
    <div 
      v-if="boardName"
      class="bread-crumb-block"
    >
      <router-link 
        :to="{name: prevPage}"
        class="page root"
      >{{ $t('editing.allCategory') }}</router-link>
      <span class="divider">/</span>
      <span class="page">{{ boardName }}</span>
    </div>
    <spinner
      v-if="isLoading"
    />
    <empty-info-block
      v-else-if="boardList.length === 0"
      :msg="$t('editing.emptyPinboard')"
    />
    <component
      v-for="result in boardList"
      :key="result.pinboardId"
      :is="result.layout"
      :data-pinboard-id="result.pinboardId"
      :data-data-source-id="result.dataSourceId"
      :data-data-frame-id="result.dataFrameId"
      :result-info="result.info"
      :restrictions="result.restrictions"
      :question="result.question"
    />
  </div>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'PagePinboard',
  components: {
    EmptyInfoBlock
  },
  data () {
    return {
      isLoading: true,
      timeoutFunction: null,
      boardList: [],
      boardName: null,
      accountId: null,
      groupId: null,
      isProjectPinboard: false
    }
  },
  computed: {
    pinboardList () {
      return this.$store.state.pinboard.pinboardList
    },
    pinboardInfo () {
      return this.$store.state.pinboard.pinboardInfo
    },
    prevPage () {
      return this.isProjectPinboard ? 'projectPagePinboardList' : 'personalPagePinboardList'
    }
  },
  mounted () {
    this.getPinboardInfo()
    this.getPinboardName()
    this.accoutId = this.$route.params.accoutId
    this.groupId = this.$route.params.groupId
    this.isProjectPinboard = this.groupId !== undefined
  },
  methods: {
    getPinboardName () {
      if (this.pinboardList.length > 0) {
        this.setPinboardName()
      } else {
        this.$store.dispatch('pinboard/getPinboardList').then(() => {
          this.setPinboardName()
        })
      }
    },
    setPinboardName () {
      let currentBoard = this.pinboardList.filter(element => element.id === parseInt(this.$route.params.id))
      this.boardName = currentBoard.length > 0 ? currentBoard[0].name : null
    },
    getPinboardInfo () {
      this.$store.dispatch('pinboard/getPinboardById', this.$route.params.id).then(response => {
        if (response.length === 0) {
          this.isLoading = false
          return false
        }
        response.forEach(element => {
          this.boardList.push({
            pinboardId: element.id,
            resultId: element.resultId,
            dataSourceId: element.dataSourceId,
            dataFrameId: element.dataFrameId,
            layout: null,
            info: null
          })
          this.getComponent(element)
        })
      }).catch(() => {
        this.isLoading = false
      })
    },
    getComponent (res) {
      window.clearTimeout(this.timeoutFunction)
      let currentResult = this.getResult(res.resultId)
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
              currentResult.info = componentResponse.componentIds
              currentResult.restrictions = componentResponse.restrictions
              currentResult.layout = this.getLayout(componentResponse.layout)
              currentResult.question = componentResponse.segmentationPayload.question
              this.$nextTick(() => {
                this.isLoading = false
              })
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              currentResult.info = []
              currentResult.layout = 'EmptyResult'
              this.isLoading = false
              break
          }
        })
    },
    getResult (resultId) {
      return this.boardList.filter(element => element.resultId === resultId)[0]
    }
  },
}
</script>
<style lang="scss" scoped>
.page-pinboard {
  .bread-crumb-block {
    line-height: 20px;
    margin-bottom: 32px;
    font-weight: 700;

    .page {
      &.root {
        color: #65cfd9;
        text-decoration: underline;
      }
    }
    .divider {
      color: #979797;
      margin: 0 4px;
    }
  }
  .page-title {
    margin-top: 0;
  }
  .single-pinboard {
    transition: all 0.3s;

    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}
</style>
