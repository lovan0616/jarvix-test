<template>
  <div class="single-result-board"
    @click="linkToResult"
  >
    <div class="board-top-section">
      <div class="board-title">
        <!-- <span class="question-mark">Q</span>
        <span class="question-name">{{ questionInfo.question }}</span> -->
        <question-name
          :question="questionInfo.question"
          :question-segmentation="questionInfo.segmentation"
        ></question-name>
      </div>
      <div class="board-chart-block" v-if="questionInfo.template">
        <component
          v-if="questionInfo.template"
          :is="getChartTemplate(questionInfo.template)"
          v-bind="questionInfo.data"
          :is-preview="true"
        ></component>
      </div>
    </div>
  </div>
</template>
<script>
import QuestionName from '@/components/resultBoard/QuestionName'

export default {
  name: 'PreviewResultBoard',
  components: {
    QuestionName
  },
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
  methods: {
    linkToResult () {
      this.$store.commit('dataSource/setAppQuestion', this.questionInfo.question)
      // this.$store.commit('dataSource/setCurrentQuestionInfo', this.questionInfo)
      this.$store.dispatch('dataSource/updateResultRouter', this.$route.name === 'PageResult' ? 'click_recommend_result' : 'click_recommend_index')
      this.$events.emit('cleanPreview')
    }
  }
}
</script>
<style lang="scss" scoped>
.single-result-board {
  margin-bottom: 24px;
  cursor: pointer;
  transition: transform 0.3s;
  @include card();

  .board-top-section {
    padding: 24px;
    border-top: 5px solid $theme-color-primary;
    border-radius: 5px 5px 0 0;
  }

  .board-title {
    display: flex;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.1em;
    text-align: left;
    color: $theme-text-color;
    margin-bottom: 14px;

    .question-mark {
      display: inline-block;
      width: 30px;
      height: 30px;
      background-color: $theme-color-primary;
      color: #fff;
      margin-right: 8px;
      border-radius: 8px;
      text-align: center;
      line-height: 30px;
      font-weight: bold;
    }

    .question-name {
      flex: 1;
    }
  }
  .board-chart-block {
    position: relative;
    width: 100%;
    min-height: 105px;

    /**
     * 因為 echarts 的圖表有 inline cursor: default，為了看出可以點擊
     * 所以用偽元素覆蓋一層上去
     */
    // &:after {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   display: block;
    //   content: "";
    //   width: 100%;
    //   height: 100%;
    //   cursor: pointer;
    // }
  }
}
</style>
