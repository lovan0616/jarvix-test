<template>
  <div class="single-result-board"
    @click="linkToResult"
  >
    <div class="board-top-section">
      <div class="board-title">{{ question }}</div>
      <img alt="chart-img" class="board-img"
        :src="imgPath"
      >
    </div>
    <div class="board-indicators"
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
    </div>
  </div>
</template>
<script>
import { getQuestionPreview, getTaskData } from '@/API/Ask'
export default {
  name: 'SingleResultBoard',
  props: {
    question: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      picType: null,
      indicators: [],
      isLoading: false
    }
  },
  mounted () {
    this.fetechData()
  },
  methods: {
    fetechData () {
      this.isLoading = true
      getQuestionPreview({'question': this.question, 'bookmark_id': this.bookmarkId})
        .then(response => {
          this.picType = response.pictype
          if (response.task.length > 0) {
            let promiseList = []
            /**
             * indicatorList 會將 indicator 的資料全都收集完再 assign 給 indicators
             * 主要是因為 request 回來的 response 不會依序回來，但是希望順序是固定的
             **/
            let indicatorList = []
            response.task.forEach((element, index) => {
              element.entities['bookmark_id'] = this.bookmarkId
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
          } else {
            this.isLoading = false
          }
        }).catch(() => {
          this.isLoading = false
        })
    },
    linkToResult () {
      this.$store.commit('bookmark/setAppQuestion', this.question)
      this.$router.push({
        name: 'PageResultDisplay',
        query: {
          question: this.question,
          bookmarkId: this.bookmarkId
        }
      })
    }
  },
  computed: {
    bookmarkId () {
      return this.$store.getters['bookmark/bookmarkId']
    },
    imgPath () {
      switch (this.picType) {
        case 'bar_chart':
          return require('@/assets/images/bar_chart.png')
        default:
          return require('@/assets/images/line_chart.png')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.single-result-board {
  width: 31.34%;
  background-color: #F5FBFB;
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
    padding: 15px 20px 0;
    background-color: #fff;
    border-radius: 8px 8px 0 0;
  }

  .board-title {
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
  }
  .board-img {
    width: 100%;
    height: auto;
    margin-bottom: 16px;
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
