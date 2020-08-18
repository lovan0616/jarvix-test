<template>
  <div class="result-board-title">
    <div class="board-name">
      <div class="question-mark">Q</div>
      <div 
        v-if="segmentation.sentence && segmentation.sentence.length"
        class="question-name"
      >
        <question-name-token-v2
          v-for="(tokenInfo, index) in segmentation.sentence"
          :key="index"
          :token-info="tokenInfo"
          :data-frame="segmentation.transcript.dataFrame"
          :style="enMargin"
        />
      </div>
    </div>
  </div>
</template>
<script>
import QuestionNameTokenV2 from './QuestionNameTokenV2'
import { mapState } from 'vuex'

export default {
  name: 'ResultBoardHeaderV2',
  components: {
    QuestionNameTokenV2
  },
  props: {
    segmentation: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState('chatBot', ['parserLanguage']),
    ...mapState('setting', ['locale']),
    enMargin () {
      if (this.parserLanguage === 'EN_US' || this.locale === 'en-US') {
        return {'margin-right': '10px'}
      }
      return null
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board-title {
  .board-name {
    display: flex;
    align-items: center;
    font-size: 30px;
    line-height: 38px;
    letter-spacing: 0.1em;
    color: $theme-text-color;
    margin-right: 16px;
  }

  .question-mark {
    width: 30px;
    height: 30px;
    background-color: $theme-color-primary;
    color: #fff;
    margin-right: 8px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 8px;
    text-align: center;
    line-height: 30px;
  }

  .question-name {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    letter-spacing: 0.05em;
  }
}
</style>
