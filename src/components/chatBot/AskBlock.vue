<template>
  <div class="ask-container">
    <div class="ask-block">
      <div 
        v-show="hasFilter"
        class="filter-block"
      ><svg-icon 
        icon-class="filter" 
        class="icon"/> {{ $t('resultDescription.filterRestrictions') }}</div>
      <div 
        :class="{
          'has-filter': hasFilter,
          'is-use-algorithm': isUseAlgorithm,
          'is-connect-channel': websocketHandler
        }"
        class="user-question-block"
      >
        <!-- 這裡的 prevent 要避免在 firefox 產生換行的問題 -->
        <input 
          ref="questionInput"
          :class="{'disabled': !dataSourceList.length}"
          :name="new Date().getTime()"
          :placeholder="$t('editing.askPlaceHolder')"
          :disabled="!dataSourceList.length"
          v-model.trim="userQuestion"
          class="question-input input"
          autocomplete="off"
          @keypress.enter.prevent="enterQuestion"
          @keyup.shift.ctrl.72="toggleHelper()"
          @keyup.shift.ctrl.90="toggleAlgorithm()"
          @keyup.shift.ctrl.88="toggleWebSocketConnection()"
        >
        <a 
          href="javascript:void(0);" 
          class="clean-btn"
          @click="cleanQuestion"
        >
          <svg-icon icon-class="remove-circle"/>
        </a>
        <a 
          href="javascript:void(0);" 
          class="ask-btn"
          @click="enterQuestion"
        >
          <svg-icon icon-class="go-right"/>
        </a>
      </div>
      <div 
        :class="{ 'disabled': dataSourceList.length === 0 }" 
        class="ask-remark-block">{{ $t('askHelper.askHelpRemark') }}
        <a 
          href="javascript:void(0)" 
          class="link help-link"
          @click="showHelper"
        >{{ $t('askHelper.helpLink') }}</a>
      </div>
    </div>
    <div 
      :class="{show: showHistoryQuestion && historyQuestionList.length > 0, 'has-filter': hasFilter}"
      class="history-question-block"
    >
      <a 
        href="javascript:void(0)" 
        class="close-btn"
        @click="hideHistory"
      >
        <svg-icon icon-class="close"/>
      </a>
      <div class="title">{{ $t('askHelper.historyTitle') }}</div>
      <div 
        v-for="singleHistory in historyQuestionList"
        :key="singleHistory.id"
        class="history-question"
        @click="copyQuestion(singleHistory.question)"
      ><svg-icon 
        icon-class="clock" 
        class="icon"/> {{ singleHistory.question }}</div>
    </div>
    <ask-helper-dialog 
      ref="helperDialog"
      :class="{'has-filter': hasFilter}"
      :key="dataSourceId"
      :show="showAskHelper"
      class="ask-helper-dialog"
      @close="closeHelper"
    />
  </div>
</template>
<script>
import AskHelperDialog from './AskHelperDialog'
import { mapState } from 'vuex'

export default {
  name: 'AskBlock',
  components: {
    AskHelperDialog
  },
  data () {
    return {
      userQuestion: null,
      showHistoryQuestion: false,
      showAskHelper: false,
      websocketHandler: null
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceId', 'appQuestion', 'dataSourceColumnInfoList', 'dataSourceDataValueList']),
    tokenList () {
      let tokens = []
      for (let i = 0; i < this.userQuestion.length; i++) {
        console.log(this.userQuestion.charAt[i])
      }
      return tokens
    },
    hasFilter () {
      return this.$store.state.dataSource.filterList.length > 0
    },
    historyQuestionList () {
      // 過濾 boomark 以及 問題字串
      return this.userQuestion
        ? this.$store.state.dataSource.historyQuestionList.filter(element => { return element.question.indexOf(this.userQuestion) > -1 })
        : []
    },
    isUseAlgorithm () {
      return this.$store.state.chatBot.isUseAlgorithm
    },
    dataSourceList () {
      return this.$store.state.dataSource.dataSourceList
    }
  },
  watch: {
    userQuestion (val) {
      if (document.activeElement === this.$refs.questionInput) {
        // 處理問句字串
        for (let i = 0; i < val.length; i++) {
          for (let j = i + 1; j <= val.length; j++) {
            let currentText = val.slice(i, j)
            console.log(currentText, 'currentText')
          }
          
        }
        this.showHistory()
      }
    },
    appQuestion (value) {
      this.copyQuestion(value)
    },
    dataSourceId (value, oldValue) {
      if (!oldValue) return
      this.userQuestion = null
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
    if (this.websocketHandler) this.closeWebSocketConnection()
  },
  methods: {
    toggleWebSocketConnection () {
      if (this.websocketHandler) return this.closeWebSocketConnection()
      this.createWebSocketConnection()
    },
    createWebSocketConnection () {
      let connectionRequestUrl = `${window.env.PUBLIC_API_ROOT_URL.replace('https', window.location.protocol === 'https:' ? 'wss' : 'ws')}websocket/ROBOT`
      this.websocketHandler = new WebSocket(connectionRequestUrl)
      this.websocketHandler.onopen = this.onWebSocketOpen
      this.websocketHandler.onmessage = this.onWebSocketReceiveMessage
      this.websocketHandler.onclose = this.onWebSocketClose
    },
    closeWebSocketConnection () {
      this.websocketHandler.close()
      this.websocketHandler = null
    },
    onWebSocketOpen () {
    },
    onWebSocketReceiveMessage (evt) {
      this.userQuestion = evt.data
      this.enterQuestion()
    },
    onWebSocketClose (evt) {
    },
    autoHide (evt) {
      let clickInside = this.$el.contains(evt.target)
      if (this.showHistoryQuestion && !clickInside) {
        this.showHistoryQuestion = false
      }
      if (this.showAskHelper && !clickInside) {
        this.showAskHelper = false
      }
      // 歷史問句與問句提示同時顯示時，若是點擊到問句提示則關閉歷史問句
      if (this.showHistoryQuestion && this.$refs.helperDialog.$el.contains(evt.target)) {
        this.showHistoryQuestion = false
      }
    },
    cleanQuestion () {
      if (!this.dataSourceList.length) return
      this.userQuestion = null
    },
    enterQuestion () {
      if (!this.dataSourceList.length) return
      this.$store.commit('dataSource/setAppQuestion', this.userQuestion)
      this.$store.dispatch('dataSource/updateResultRouter', 'key_in')
      this.hideHistory()
      this.closeHelper()
    },
    copyQuestion (value) {
      this.userQuestion = value
      this.$refs.questionInput.focus()
    },
    showHistory () {
      if (this.showHistoryQuestion || this.showAskHelper) return
      this.showHistoryQuestion = true
    },
    hideHistory () {
      this.showHistoryQuestion = false
    },
    showHelper () {
      if (this.dataSourceList.length === 0) return
      this.showAskHelper = true
      this.hideHistory()
    },
    closeHelper () {
      this.showAskHelper = false
    },
    toggleHelper () {
      if (this.showAskHelper) {
        this.closeHelper()
      } else {
        this.showHelper()
      }
    },
    toggleAlgorithm () {
      this.$store.commit('chatBot/updateIsUseAlgorithm', !this.isUseAlgorithm)
    }
  },
}
</script>
<style lang="scss" scoped>
.ask-container {
  position: relative;
  padding: 16px 32px;
  background-color: rgba(35, 61, 64, 0.6);

  .user-question-block {
    position: relative;
    z-index: 999;

    &.has-filter {
      &:after {
        background-image: linear-gradient(90deg, $filter-color 0%, rgba(67, 138, 248, 0.2) 100%);
      }
      .ask-btn {
        color: $filter-color;
      }
    }

    &.is-use-algorithm {
      .ask-btn {
        color: $theme-color-warning;
      }
    }

    &.is-connect-channel {
      .clean-btn {
        color: $theme-color-danger;
      }
    }

    &:after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background-image: linear-gradient(90deg, $theme-color-primary 0%, rgba(77, 226, 240, 0.2) 100%);
    }

    .question-input {
      width: 100%;
      font-size: 20px;
      line-height: 36px;
      height: 48px;
      overflow: auto;
      padding-right: 74px;
      border-bottom: none;

      &:disabled {
        &::placeholder {
          opacity: .15;
        }

        & ~ .ask-btn,
        & ~ .clean-btn {
          opacity: .15;
        }
      }
    }

    .clean-btn {
      position: absolute;
      top: 14px;
      right: 44px;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.5);
    }

    .ask-btn {
      position: absolute;
      top: 11px;
      right: 2px;
      font-size: 20px;
      color: $theme-color-primary;
    }
  }

  .filter-block {
    color: $filter-color;
    border: 1px solid $filter-color;
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 12px;
    line-height: 1;
    display: inline-flex;
    align-items: center;

    .icon {
      margin-right: 4px;
    }
  }

  .ask-remark-block {
    font-size: 13px;
    line-height: 30px;
    text-align: left;
    letter-spacing: 0.05em;

    &.disabled {
      opacity: .3;
    }

    .help-link {
      font-size: 13px;
    }
  }

  .ask-helper-dialog {
    bottom: 100%;

    &.has-filter {
      bottom: 137px;
    }
  }

  .algorithm-status {
    position: absolute;
    left: 0;
    top: -18px;
    font-size: 14px;
    color: #333;
    opacity: 0.6;
  }

  .history-question-block {
    position: absolute;
    text-align: left;
    left: 0;
    bottom: 100%;
    width: 100%;
    height: 0;
    overflow: hidden;
    padding: 0 32px;
    transition: height 0.3s;
    z-index: 90;
    background-color: rgba(40, 71, 74, 0.95);
    border-top: 1px solid #415E60;

    &.has-filter {
      bottom: 137px;
    }

    &.show {
      height: 160px;
      overflow: auto;
    }

    .close-btn {
      position: absolute;
      top: 12px;
      right: 16px;
      color: #fff;
      font-size: 14px;
    }

    .title {
      line-height: 50px;
    }

    .history-question {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      font-size: 14px;
      line-height: 20px;
      padding: 8px 12px;
      color: $theme-color-primary;
      cursor: pointer;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      .icon {
        margin-right: 4px;
      }
    }
  }
}
</style>
