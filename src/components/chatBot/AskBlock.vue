<template>
  <div class="ask-container">
    <div class="ask-block">
      <div 
        :class="{
          'has-filter': hasFilter,
          'is-use-algorithm': isUseAlgorithm,
          'is-connect-channel': websocketHandler,
          'is-focus': isFocus
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
          @keyup="handleAskText"
          @focus="focusInput"
          @blur="blurInput"
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
        class="ask-remark-block"
        @click="toggleAdvanceDataFrameSetting">
        <svg-icon icon-class="ask-helper"/>
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
import { mapState, mapMutations } from 'vuex'


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
      websocketHandler: null,
      recommendList: [],
      cursorPositionQuestion: null,
      isFocus: false
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceId', 'appQuestion', 'dataSourceColumnInfoList', 'dataSourceDataValueList']),
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    dictionaries () {
      return [
        ...this.dataSourceColumnInfoList.booleanList.map(element => ({type: 'boolean', text: element})),
        ...this.dataSourceColumnInfoList.category.map(element => ({type: 'category', text: element})),
        ...this.dataSourceColumnInfoList.dateTime.map(element => ({type: 'dateTime', text: element})),
        ...this.dataSourceColumnInfoList.numeric.map(element => ({type: 'numeric', text: element})),
        ...this.dataSourceColumnInfoList.uniqueList.map(element => ({type: 'unique', text: element})),
        ...this.dataSourceDataValueList.map(element => ({type: 'dataValue', text: element})),
        ...this.$t('questionToken')
      ]
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
    },
    questionTokenList () {
      let tokenList = []
      // 處理問句字串
      if (!this.userQuestion) return []
      for (let i = 0; i < this.userQuestion.length; i++) {
        for (let j = this.userQuestion.length; j >= i + 1; j--) {
          let currentText = this.userQuestion.slice(i, j)
          // 找出是否有符合的 token
          let tokenIndex = this.dictionaries.findIndex(element => element.text.toLowerCase() === currentText.toLowerCase())
          if (tokenIndex > -1) {
            tokenList.push(this.dictionaries[tokenIndex])
            i = j - 1
            break
          }

          if (j === i + 1) {
            tokenList.push({type: 'unknown', text: this.userQuestion[i]})
          }
        }
      }

      return tokenList
    }
  },
  watch: {
    questionTokenList (value, oldValue) {
      if (value.length === 0) return
      // token 減少不處理
      let newRecognizeTokenList = value.filter(element => element.type !== 'unknown')
      let oldRecognizeTokenList = oldValue.filter(element => element.type !== 'unknown')
      if (newRecognizeTokenList.length <= oldRecognizeTokenList.length) return

      // 如果最後一個是認得出來的 token 就問問題
      let lastToken = value[value.length - 1]
      if (lastToken.type !== 'unknown') {
        this.enterQuestion()
      } else {
        // 未來作推薦問句的處理
        // this.recommendList = this.dictionaries.filter(element => {
        //   return element.text.indexOf(lastToken.text) !== -1
        // }).map(element => element.text)
      }
    },
    userQuestion (val) {
      if (document.activeElement === this.$refs.questionInput) {
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
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox']),
    // TODO 暫時先由這邊打開基表設定，等datasource選單做好再拔掉
    toggleAdvanceDataFrameSetting () {
      const dataFrameId = this.$route.query.dataFrameId
      if (dataFrameId === 'all') return 
      this.toggleSettingBox(!this.isShowSettingBox)
    },
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
    },
    focusInput () {
      this.isFocus = true
      this.$store.dispatch('chatBot/openAskInMemory')
    },
    blurInput () {
      this.isFocus = false
    },
    handleAskText (e) {
      this.cursorPositionQuestion = this.userQuestion.slice(0, e.target.selectionStart)
    }
  },
}
</script>
<style lang="scss" scoped>
.ask-container {
  position: relative;
  flex: 1;

  .ask-block {
    display: flex;
    align-items: center;
  }

  .user-question-block {
    flex: 1;
    display: flex;
    align-items: center;
    z-index: 999;
    background-color: rgba(35, 61, 64, 0.6);
    border-radius: 5px;
    padding: 0 10px;

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
    &.is-focus {
      box-shadow: 0px 0px 20px rgba(12, 209, 222, 0.5);
      border: 1px solid #0CD1DE;
    }

    .question-input {
      width: 100%;
      font-size: 14px;
      line-height: 36px;
      height: 38px;
      overflow: auto;
      padding-right: 30px;
      border-bottom: none;

      &::placeholder {
        opacity: #888;
      }

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
      font-size: 16px;
      color: rgba(255, 255, 255, 0.5);
      margin-right: 16px;
    }

    .ask-btn {
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
    font-size: 16px;
    height: 40px;
    width: 40px;
    text-align: left;
    letter-spacing: 0.05em;
    border: 1px solid #2D3033;
    border-radius: 5px;
    margin-left: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .svg-icon {
      color: #AAAAAA;
    }

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
    top: 100%;
    width: calc(100% - 56px);
    height: 0;
    overflow: hidden;
    padding: 0 32px;
    transition: height 0.3s;
    z-index: 90;
    background-color: rgba(40, 71, 74, 0.95);

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
