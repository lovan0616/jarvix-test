<template>
<div class="question-sample">
  <div class="question-sample-block">
    <div class="question-description">
      <span class="question-lamp">
        <svg-icon icon-class="lamp"></svg-icon>
        {{$t('askHelper.description')}}:
      </span>
      {{$t('askHelper.category')}}</div>
    <div class="question-description">
      <span class="question-lamp">
        <svg-icon icon-class="lamp"></svg-icon>
        {{$t('askHelper.description')}}:
      </span>
      {{$t('askHelper.numeric')}}</div>
    <div class="question-description">
      <span class="question-lamp">
        <svg-icon icon-class="lamp"></svg-icon>
        {{$t('askHelper.description')}}:
      </span>
      {{$t('askHelper.value')}}</div>
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
          <div class="question-ask">{{$t('askHelper.ask')}}: {{ question.questionText }}</div>
          <div class="question-example">{{$t('askHelper.example')}}:</div>
          <div
            v-for="(exampleQuestion, exampleQuestionIndex) in question.questionExample"
            :key="index + '-' + exampleQuestionIndex + '-' + exampleQuestionIndex"
            class="question-sentence"
          > ●&nbsp;
            <span
              v-for="(example, exampleIndex) in exampleQuestion"
              :key="index + '-' + questionIndex + '-' + exampleIndex"
              :class="[example.type ? `question-${example.type}` : '']"
              @mouseover="tooltipOn(example.type, $event)"
              @mouseleave="tooltipOff"
              :name="example.type"
            >
            {{ example.text }}
            </span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div
    v-if="position.type==='category' && position.isShow"
    :class="['question-type', 'question-category-type']"
    :style="{top: position.top, left: position.left}"
  >
    {{ $t('askHelper.category') }}
  </div>
  <div
    v-if="position.type==='numeric' && position.isShow"
    :class="['question-type', 'question-numeric-type']"
    :style="{top: position.top, left: position.left}"
  >
    {{ $t('askHelper.numeric') }}
  </div>
  <div
    v-if="position.type==='filter' && position.isShow"
    :class="['question-type', 'question-filter-type']"
    :style="{top: position.top, left: position.left}"
  >
    {{ $t('askHelper.filter') }}
  </div>
  <div
    v-if="position.type==='value' && position.isShow"
    :class="['question-type', 'question-value-type']"
    :style="{top: position.top, left: position.left}"
  >
    {{ $t('askHelper.value') }}
  </div>
</div>
</template>
<script>
export default {
  name: 'QuestionSample',
  data () {
    return {
      activeName: null,
      position: {
        type: '',
        top: '',
        left: '',
        isShow: false
      }
    }
  },
  methods: {
    tooltipOn (type, event) {
      this.position.left = `${event.layerX - event.offsetX - 34}px`
      this.position.top = `${event.relatedTarget.offsetTop + 26}px`
      this.position.type = type
      this.position.isShow = true
    },
    tooltipOff () {
      this.position.isShow = false
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
.question-sample {
  position: relative;

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
      line-height: 22px;
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
      display: flex;
      font-size: 14px;
      line-height: 18px;
      color: #DDDDDD;
      padding: 4px 16px;
    }

    .question-category {
      border-bottom: 1px solid #44D2FF;
      cursor: pointer;
    }

    .question-numeric {
      border-bottom: 1px solid #00A3FF;
      cursor: pointer;
    }

    .question-filter {
      border-bottom: 1px solid #FF9559;
      cursor: pointer;
    }

    .question-value {
      border-bottom: 1px solid #CA66DA;
      cursor: pointer;
    }
    
    .question-mark {
      line-height: 32px;
      font-weight: bold;
      margin-right: 4px;
    }
  }

  .question-type {
    font-size: 12px;
    padding: 4px 8px;
    text-align: center;
    border-radius: 8px;
    position: absolute;
    z-index: 1;
  }

  .question-category-type {
    max-width: 130px;
    background: #44D2FF;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 8px 9px;
      border-color: transparent transparent #44D2FF transparent;
      left: 56px;
      top: -5px;
      position: absolute;
    }
  }

  .question-numeric-type {
    max-width: 130px;
    background: #00A3FF;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 8px 9px;
      border-color: transparent transparent #00A3FF transparent;
      left: 56px;
      top: -5px;
      position: absolute;
    }
  }

  .question-filter-type {
    max-width: 130px;
    background: #FF9559;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 8px 9px;
      border-color: transparent transparent #FF9559 transparent;
      left: 50%;
      top: -5px;
      position: absolute;
    }
  }

  .question-value-type {
    max-width: 130px;
    background: #CA66DA;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 8px 9px;
      border-color: transparent transparent #CA66DA transparent;
      left: 56px;
      top: -5px;
      position: absolute;
    }
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
