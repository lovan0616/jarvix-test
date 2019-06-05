<template>
  <div class="single-result-board"
    @click="linkToResult"
  >
    <div class="board-title">{{ question }}</div>
    <div class="board-img"></div>
    <div class="board-indicators">
      <div class="single-indicator"
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
      dataType: null,
      indicators: []
    }
  },
  mounted () {
    this.fetechData()
  },
  methods: {
    fetechData () {
      getQuestionPreview({'question': this.question, 'bookmark_id': this.bookmarkId})
        .then(response => {
          this.dataType = response.pictype
          response.task.forEach((element, index) => {
            element.entities['bookmark_id'] = this.bookmarkId
            // path
            this.indicators = []
            getTaskData(element.intent, element.entities)
              .then(res => {
                this.$set(this.indicators, index, res)
              })
          })
        })
    },
    linkToResult () {
      this.$store.commit('bookmark/setAppQuestion', this.question)
      this.$router.push({
        name: 'PageResultDisplay',
        query: {
          question: this.question,
          bookmark_id: this.bookmarkId
        }
      })
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
  width: 31.34%;
  padding: 15px 20px;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 40px;
  cursor: pointer;

  .board-title {
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.1em;
  }
  .board-img {
    margin-bottom: 24px;
  }
  .board-indicators {
    display: flex;
    justify-content: space-between;
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
