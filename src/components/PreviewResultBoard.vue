<template>
  <div class="single-result-board"
    @click="linkToResult"
  >
    <div class="board-top-section">
      <div class="board-title">{{ questionInfo.question }}</div>
      <div class="board-chart-block"
        v-loading="isLoading"
      >
        <component
          v-if="questionInfo.template"
          :is="getChartTemplate(questionInfo.template)"
          :dataset="questionInfo.data.dataset"
          isPreview
        ></component>
      </div>
    </div>
    <!-- <div class="board-indicators"
      v-loading="isLoading"
    >
      <div class="single-indicator"
        v-if="indicators.length > 0"
        v-for="(indicator, index) in indicators"
        :key="index"
      >
        <div class="indicator-title">{{ indicator.title }}</div>
        <div class="indicator-value">{{ indicator.value }}</div>
      </div>
    </div> -->
  </div>
</template>
<script>
import { getTaskData } from '@/API/Ask'
export default {
  name: 'PreviewResultBoard',
  props: {
    questionInfo: {
      type: Object,
      default () {
        return {
          data: null,
          question: null,
          result: null,
          task: [],
          template: null
        }
      }
    }
  },
  data () {
    return {
      indicators: [],
      isLoading: false
    }
  },
  // mounted () {
  //   this.fetechData()
  // },
  // watch: {
  //   'questionInfo.result.entities.bookmark_id' () {
  //     this.fetechData()
  //   }
  // },
  methods: {
    fetechData () {
      this.isLoading = true
      let promiseList = []
      /**
       * indicatorList 會將 indicator 的資料全都收集完再 assign 給 indicators
       * 主要是因為 request 回來的 response 不會依序回來，但是希望順序是固定的
       **/
      let indicatorList = []
      this.questionInfo.task.forEach((element, index) => {
        // element.entities['bookmark_id'] = this.bookmarkId
        let getTaskPromise = getTaskData(element.intent, element.entities)
          .then(res => {
            indicatorList[index] = res
          })
        // 收集所有 promise 送進 promiseAll
        promiseList.push(getTaskPromise)
      })
      Promise.all(promiseList).then(() => {
        this.indicators = indicatorList
        this.isLoading = false
      }, () => {
        this.isLoading = false
      })
    },
    linkToResult () {
      this.$store.commit('bookmark/setQuestionResult', this.questionInfo.result)
      this.$store.commit('bookmark/setAppQuestion', this.questionInfo.question)
      this.$store.dispatch('bookmark/updateResultRouter')
    }
  },
  computed: {
    bookmarkId () {
      return this.$store.getters['bookmark/bookmarkId']
    }
  }
}
</script>
<style lang="scss" scoped>
.single-result-board {
  background-color: #fff;
  // background-color: #F5FBFB;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 40px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translate3d(0,-5px,0);
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
  }

  .board-top-section {
    padding: 15px 20px 16px;
    // background-color: #fff;
    // border-radius: 8px 8px 0 0;
  }

  .board-title {
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.1em;
    padding-bottom: 16px;
    text-align: left;
  }
  .board-chart-block {
    width: 100%;
    min-height: 105px;
  }
  .board-indicators {
    display: flex;
    justify-content: space-between;
    min-height: 77px;
    padding: 15px 20px;
  }
  .single-indicator {
    width: 47.37%;
  }
  .indicator-title {
    font-size: 13px;
    line-height: 22px;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
  }
  .indicator-value {
    font-family: Oswald;
    font-size: 28px;
    line-height: 163.42%;
    letter-spacing: 0.05em;
  }
}
</style>
<style lang="scss">
// spinner 的底色調整
.board-indicators {
  .el-loading-mask {
    background-color: #F5FBFB;
  }
}
</style>
