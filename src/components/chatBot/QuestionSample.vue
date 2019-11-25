<template>
  <div class="question-sample-block">
    <div class="question-description">
      <span class="question-lamp">
        <svg-icon icon-class="lamp"></svg-icon>
        說明:
      </span>
      Category）類型的欄位，不具有數量單位。</div>
    <div class="question-description">
      <span class="question-lamp">
        <svg-icon icon-class="lamp"></svg-icon>
        說明:
      </span> 
      Numeric類型的欄位，具有數量單位。</div>
    <div class="question-description">
      <span class="question-lamp">
        <svg-icon icon-class="lamp"></svg-icon>
        說明:
      </span>
      Value是欄位的資料，不限定數量或其他型態。</div>
    <el-collapse class="question-sample-collapse"
      v-model="activeName"
      accordion
    >
    <el-collapse-item
      v-for="(questionCategory, index) in $t('askHelper.questionSampleList')"
      :key="index"
      class="question-title"
      :title="questionCategory.name"
    >
      <div
        class="question-box"
        v-for="(question, questionIndex) in questionCategory.questionList"
        :key="index + '-' + questionIndex"      
      >
        <div class="question-ask">問: {{ question.questionText }}</div>
        <div class="question-example">範例:</div>
        <div
          v-for="(example, exampleIndex) in question.questionExample"
          :key="index + '-' + questionIndex + '-' + exampleIndex"  
          class="question-sentence"
        >        
          <span>{{ example[0].text }}</span>
          <span>{{ example[1].text }}</span>
         <span> {{ example[2].text }}</span>

        </div>
      </div>

    </el-collapse-item>
      <!-- <el-collapse-item
        v-for="(questionCategory, index) in $t('askHelper.questionSampleList')"
        :key="index"
        :title="questionCategory.name"
        :name="index"
      >
        <div class="question-list"
          v-for="(question, questionIndex) in questionCategory.questionList"
          :key="index + '-' + questionIndex"
        >
          <span class="question-mark">Q:</span>{{ question }}
        </div>
      </el-collapse-item> -->
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: 'QuestionSample',
  data () {
    return {
      activeName: null
    }
  },
  computed: {
    askSampleList () {
      return [
        {
          type: {

          },
          questionList: [
            {

            }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.question-sample-block {

  .question-description {
    font-size: 12px;
    line-height: 32px;
  }

  .question-lamp {
    color: #FFDF6F;
  }

  .question-list {
    line-height: 32px;
    padding: 4px 16px;

    &:nth-child(odd) {
      background-color: rgba(50, 75, 78, 0.6);
    }
  }

  .question-title {
    font-size: 14px;
  }

  .question-ask {
    padding: 11px 16px;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    background: rgba(50, 75, 78, 0.6);
    margin-top: 26px;

    &:first-child {
      margin-top: 0px;
    }    
  }

  .question-box {
    padding: 6px 0px;
  }

  .question-example {
    font-weight: 600;
    font-size: 14px;
    line-height: 26px;
    padding: 12px 16px 8px;
    color: #DDDDDD;
  }

  .question-sentence {
    font-size: 14px;
    line-height: 18px;
    color: #DDDDDD;
    padding: 4px 16px;

    .question-category {
      cursor: pointer;
      border-bottom: 1px solid #44D2FF;
    }
  }

  .question-mark {
    line-height: 32px;
    font-weight: bold;
    margin-right: 4px;
  }
}

</style>
<style lang="scss">
.question-sample-collapse.el-collapse {
  border-top: none;

  .el-collapse-item__header {
    background-color: transparent;
    color: $theme-text-color;
    padding-left: 16px;
  }

  .el-collapse-item__wrap {
    background-color: transparent;
  }

  .el-collapse-item__content {
    color: #fff;
  }
}
</style>
