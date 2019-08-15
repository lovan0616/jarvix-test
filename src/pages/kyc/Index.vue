<template>
   <page-layout>
    <div class="page-kyc">
      <ChatBotBtn class="chat-bot-btn" />
      <transition name="fade" mode="out-in">
        <div class="question-block"
          v-for="(question, index) in questionList"
          :key="index"
          v-if="index + 1 === currentQuestion"
        >
          <div class="question-title">{{ question.text }}</div>
          <div class="kyc-select-block">
            <sy-select class="kyc-select"
              :items="question.options"
              placeholder="请选择"
              @update:selected="onOptionChange"
            >
            </sy-select>
            <img src="@/assets/images/input.svg" class="kyc-input-img" alt="">
          </div>
        </div>
      </transition>
    </div>
   </page-layout>
</template>
<script>
import PageLayout from '@/components/layout/PageLayout'
import ChatBotBtn from '@/components/chatBot/ChatBotBtn'
import SySelect from '@/components/select/SySelect'

export default {
  name: 'PageKYC',
  components: {
    PageLayout,
    ChatBotBtn,
    SySelect
  },
  data () {
    return {
      currentQuestion: 1,
      questionList: [
        {
          text: '请选择您的职务类别',
          options: [
            {
              name: '管理阶层',
              id: 'manager'
            },
            {
              name: '一般员工',
              id: 'employee'
            }
          ]
        },
        {
          text: '请选择您感兴趣的主题',
          options: [
            {
              name: '销售',
              id: 'business'
            },
            {
              name: '运营',
              id: 'operation'
            },
            {
              name: '生产',
              id: 'production'
            }
          ]
        }
      ],
      responseList: []
    }
  },
  methods: {
    onOptionChange (value) {
      this.responseList.push(value)

      window.setTimeout(() => {
        this.currentQuestion += 1
      }, 500)
    }
  },
  watch: {
    currentQuestion (value) {
      if (value > this.questionList.length) {
        this.$router.push('/')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-kyc {
  .chat-bot-btn {
    margin-bottom: 32px;

    &:after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      content: "";
      display: block;
      width: 80px;
      height: 80px;
      box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.7);
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      z-index: -1;
    }
  }
  .question-title {
    font-size: 32px;
    line-height: 44px;
    margin-bottom: 104px;
  }
  .kyc-select-block {
    position: relative;

    .kyc-input-img {
      position: absolute;
      right: 0;
      bottom: -48px;
      left: 0;
      margin: auto;
      z-index: -1;
    }
  }
}
</style>
<style lang="scss">
.kyc-select {
  &.sy-select.theme-default .el-input__inner {
    font-size: 24px;
    line-height: 44px;
  }
  &.el-select {
    .el-input .el-select__caret {
      font-size: 24px;
    }
  }
}
</style>
