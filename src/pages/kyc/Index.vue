<template>
   <page-layout>
    <div class="page-kyc">
      <ChatBotBtn class="chat-bot-btn" />
      <transition name="fade" mode="out-in">
        <div class="question-block"
          v-if="currentQuestion === index + 1"
          v-for="(singleQuestion, index) in questionList"
          :key="index"
        >
          <div class="question-title">{{ singleQuestion.question }}</div>
          <div class="kyc-select-block">
            <sy-select class="kyc-select"
              :items="singleQuestion.option"
              :selected="response"
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
import { answerKYC, cleanKYC } from '@/API/KYC'

export default {
  name: 'PageKYC',
  components: {
    PageLayout,
    ChatBotBtn,
    SySelect
  },
  data () {
    return {
      questionList: [],
      currentQuestion: 0,
      response: null
    }
  },
  mounted () {
    cleanKYC()
    this.responseData()
  },
  methods: {
    responseData (question, answers) {
      let promise
      if (question && answers) {
        promise = answerKYC({question, answers})
      } else {
        promise = answerKYC()
      }
      promise.then(response => {
        if (response) {
          response.option = response.option.map(item => {
            return {
              name: item,
              id: item
            }
          })
          this.questionList.push(response)
          window.setTimeout(() => {
            this.currentQuestion += 1
            this.response = null
          }, 300)
        } else {
          this.$router.push('/')
        }
      })
    },
    onOptionChange (value) {
      this.response = value
      this.responseData(this.questionList[this.currentQuestion - 1].question, value)
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
      box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.5);
      background-color: rgba(0, 0, 0, 0.5);
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
