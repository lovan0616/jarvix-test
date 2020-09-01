<template>
  <div class="question-name-block">
    <span class="question-mark">Q</span>
    <span 
      v-if="questionSegmentation.sentence && questionSegmentation.sentence.length"
      class="question-name"
    >
      <question-name-token-v2
        v-for="(segmentation, index) in questionSegmentation.sentence"
        :key="index"
        :token-info="segmentation"
        :data-frame="questionSegmentation.transcript.dataFrame"
        :style="{'margin-left': needSpaceList[index] ? '10px' : null}"
      />
    </span>
    <span 
      v-else
      class="question-name"
    >{{ question }}</span>
  </div>
</template>
<script>
import QuestionNameTokenV2 from './QuestionNameTokenV2'

export default {
  name: 'QuestionNameV2',
  components: {
    QuestionNameTokenV2
  },
  props: {
    questionSegmentation: {
      type: Object,
      default: () => null
    },
    question: {
      type: String,
      default: ''
    }
  },
  computed: {
    needSpaceList () {
      if (this.questionSegmentation.sentence.length === 0) return []
      // 英數字或是空白
      let isEnOrEnumList = this.questionSegmentation.sentence.map(singleSegmentation => {
        return /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/.test(singleSegmentation.word)
      })

      return this.questionSegmentation.sentence.reduce((acc, cur, index) => {
        let needSpace   
        if (index === 0) {
          needSpace = false
        } else {
          if (isEnOrEnumList[index - 1] && isEnOrEnumList[index]) {
            needSpace = true
          } else {
            needSpace = false
          }
        }
        acc.push(needSpace)
        return acc
      }, [])
    }
  }
}
</script>
<style lang="scss" scoped>
.question-name-block {
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 26px;
  letter-spacing: 0.1em;
  text-align: left;
  color: $theme-text-color;

  .question-mark {
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
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    letter-spacing: 0.05em;
    margin-right: 16px;
  }
}
</style>
