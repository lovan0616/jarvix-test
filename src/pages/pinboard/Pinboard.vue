<template>
  <div class="page-pinboard">
    <h1 class="page-title">{{ $t('editing.pinboard') }}</h1>
    <div class="bread-crumb-block">
      <router-link class="page root" to="/pinboard">{{ $t('editing.allCategory') }}</router-link>
      <span class="divider">/</span>
      <span class="page">{{ boardName }}</span>
    </div>
    <spinner
      v-if="isLoading"
    ></spinner>
    <empty-info-block
      v-else-if="boardList.length === 0"
      :msg="$t('editing.emptyPinboard')"
    ></empty-info-block>
    <component
      v-for="result in boardList"
      :key="result.id"
      :is="result.layout"
      :resultInfo="result.info"
    ></component>
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
      boardList: []
    }
  },
  mounted () {
    this.getPinboardInfo()
  },
  methods: {
    getPinboardInfo () {
      this.$store.dispatch('pinboard/getPinboardById', this.$route.params.id).then(response => {
        response.forEach(element => {
          this.boardList.push({
            id: element.resultId,
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
              currentResult.layout = this.getLayout(componentResponse.layout)
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
      return this.boardList.filter(element => element.id === resultId)[0]
    }
  },
  computed: {
    pinboardList () {
      return this.$store.state.pinboard.pinboardList
    },
    boardName () {
      if (this.pinboardList.length === 0) {
        this.$store.dispatch('pinboard/getPinboardList')
        return ''
      } else {
        return this.pinboardList.filter(element => element.id === parseInt(this.$route.params.id))[0].name
      }
    }
  }
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
