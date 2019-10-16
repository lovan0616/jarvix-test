<template>
  <div class="question-sample-block">
    <el-collapse class="question-sample-collapse"
      v-model="activeName"
      accordion
    >
      <el-collapse-item
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
      </el-collapse-item>
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
  .question-list {
    line-height: 32px;
    padding: 4px 16px;

    &:nth-child(odd) {
      background-color: rgba(50, 75, 78, 0.6);
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
