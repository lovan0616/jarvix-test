<template>
  <div class="single-result-board"
    @click="linkToResult"
  >
    <div class="board-top-section">
      <div class="board-title"><span class="question-mark">Q:</span>{{ questionInfo.question }}</div>
      <div class="board-chart-block">
        <component
          v-if="questionInfo.template"
          :is="getChartTemplate(questionInfo.template)"
          :dataset="questionInfo.data.dataset"
          :is-preview="true"
        ></component>
      </div>
    </div>
  </div>
</template>
<script>
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
  methods: {
    linkToResult () {
      this.$store.commit('bookmark/setAppQuestion', this.questionInfo.question)
      this.$store.dispatch('bookmark/updateResultRouter', this.$route.name === 'PageResult' ? 'click_recommend_result' : 'click_recommend_index')
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
  }

  .board-title {
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.1em;
    text-align: left;
    color: $theme-text-color;

    .question-mark {
      color: #4DE2F0;
      margin-right: 4px;
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
    &:after {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      content: "";
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
