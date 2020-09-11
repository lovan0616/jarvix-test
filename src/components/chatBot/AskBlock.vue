<template>
  <div 
    :class="{'is-focus': isFocus}" 
    class="ask-container">
    <div class="ask-block">
      <div 
        :class="{
          'has-filter': hasFilter,
          'is-use-algorithm': isUseAlgorithm,
          'is-connect-channel': websocketHandler,
        }"
        class="user-question-block"
      >
        <default-select
          v-if="newParserMode || hasPermission('english_parser')"
          v-model="selectParser"
          :option-list="languageList"
          class="parser-select"
        />
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
        @click="openAskHelperDialog">
        <el-tooltip
          slot="label"
          :content="$t('askHelper.title')"
        >
          <svg-icon 
            :class="{'ask-btn__icon--show': isShowAskHelper}" 
            icon-class="ask-helper"
            class="ask-btn__icon"/>
        </el-tooltip>
        
      </div>
    </div>
    <div
      :class="{show: showHistoryQuestion && historyQuestionList.length > 0, 'has-filter': hasFilter}"
      class="history-question-block"
    >
      <div 
        v-for="singleHistory in historyQuestionList"
        :key="singleHistory.id"
        class="history-question"
        @click="copyQuestion(singleHistory.question)"
      >
        <svg-icon 
          icon-class="clock" 
          class="icon"/>
        {{ singleHistory.question }}
      </div>
    </div>
    <transition name="fast-fade-in">
      <ask-helper-dialog 
        v-if="isShowAskHelper"
        ref="helperDialog"
        :class="{ 'ask-helper--has-basic-df-setting': isShowSettingBox }"
        :key="dataSourceId"
        class="ask-helper"
        mode="popup"
        @close="closeHelper"
      />
    </transition>
  </div>
</template>
<script>
import AskHelperDialog from './AskHelperDialog'
import { mapState, mapGetters } from 'vuex'
import { Message } from 'element-ui'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'AskBlock',
  components: {
    AskHelperDialog,
    DefaultSelect
  },
  data () {
    return {
      userQuestion: null,
      showHistoryQuestion: false,
      websocketHandler: null,
      recommendList: [],
      cursorPositionQuestion: null,
      isFocus: false,
      closeQuickAsk: localStorage.getItem('closeQuickAsk') || false
    }
  },
  computed: {
    ...mapState('chatBot', ['parserLanguageList', 'parserLanguage']),
    ...mapState('dataSource', ['dataSourceId', 'appQuestion', 'dataSourceColumnInfoList']),
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId', 'hasPermission']),
    newParserMode () {
      return localStorage.getItem('newParser') === 'true'
    },
    languageList () {
      return this.parserLanguageList.map(option => {
        return {
          name: option.language === 'ZH_TW' ? '中文' : option.description,
          value: option.language
        }
      }).filter(element => element.value !== 'ZH_CN')
    },
    selectParser: {
      get () {
        return this.parserLanguage
      },
      set (value) {
        this.$store.commit('chatBot/setParserLanguage', value)
      }
    },
    dictionaries () {
      return [
        ...this.dataSourceColumnInfoList.booleanList.map(element => ({type: 'boolean', text: element})),
        ...this.dataSourceColumnInfoList.category.map(element => ({type: 'category', text: element})),
        ...this.dataSourceColumnInfoList.dateTime.map(element => ({type: 'dateTime', text: element})),
        ...this.dataSourceColumnInfoList.numeric.map(element => ({type: 'numeric', text: element})),
        ...this.dataSourceColumnInfoList.uniqueList.map(element => ({type: 'unique', text: element})),
        ...this.$t('questionToken')
      ]
    },
    hasFilter () {
      return this.$store.state.dataSource.filterList.length > 0
    },
    isShowAskHelper () {
      return this.$store.state.isShowAskHelper
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
    },
  },
  watch: {
    questionTokenList (value, oldValue) {
      if (this.closeQuickAsk === 'true') return
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
    '$route' (to, from) {
      // 透過 drilldown 切換 dataframe 時不清空問句 input
      if (from.name === 'PageResult' && to.name === 'PageResult') return

      // 其他情況切換 datasource 或 dataframe 時會觸發回首頁，此變化才清空問句 input
      if (
        (to.query.dataSourceId).toString() !== (from.query.dataSourceId).toString()
        || (to.query.dataFrameId).toString() !== (from.query.dataFrameId).toString()
      ) {
        this.userQuestion = null
        this.closeHelper()
      }

      // 回首頁的話，關閉彈出視窗，有需要清問句的話，再加進上方條件
      if (to.name === 'PageIndex') {
        this.closeHelper()
      }
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    this.userQuestion = this.$route.query.question
  },
  destroyed () {
    this.closeHelper()
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
      if (evt.data === '圈選2018年11月至2019年1月') {
        // drill down
        this.$store.commit('chatBot/setDoDrillDown', true)
        return
      }
      if (evt.data === '回到資料集') {
        // 回到首頁
        this.$router.push({ 
          name: 'PageIndex', 
          params: {
            'account_id': this.getCurrentAccountId,
            'group_id': this.getCurrentGroupId
          },
          query: {
            dataSourceId: this.$route.query.dataSourceId,
            dataFrameId: this.$route.query.dataFrameId
          }
        })
        this.cleanQuestion()
        return
      }
      if (evt.data === '點擊環境濕度') {
        // 點擊環境溫度
        this.$store.commit('chatBot/setDoClickCorrelation', true)
        return
      }
      if (evt.data === '取消過濾條件') {
        // 清空 drill down
        this.$store.commit('dataSource/clearFilterList')
        Message({
          message: '已取消過濾條件',
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        return
      }

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
      
      // 歷史問句與問句提示同時顯示時，若是點擊到問句提示則關閉歷史問句
      if (this.showHistoryQuestion && this.$refs.helperDialog && this.$refs.helperDialog.$el.contains(evt.target)) {
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
      this.enterQuestion()
    },
    showHistory () {
      if (this.showHistoryQuestion || this.isShowAskHelper) return
      this.showHistoryQuestion = true
    },
    hideHistory () {
      this.showHistoryQuestion = false
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    },
    openAskHelperDialog () {
      if (this.dataSourceList.length === 0) return
      this.$store.commit('updateAskHelperStatus', !this.isShowAskHelper)
      this.closePreviewDataSource()
      this.hideHistory()
    },
    closeHelper () {
      this.$store.commit('updateAskHelperStatus', false)
    },
    toggleHelper () {
      if (this.isShowAskHelper) {
        this.closeHelper()
      } else {
        this.openAskHelperDialog()
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
    }
  }
}
</script>
<style lang="scss" scoped>
.ask-container {
  position: relative;
  flex: 1;

  &.is-focus {

    .user-question-block {
      border-radius: 5px 5px 0 0;
      border: 1px solid #0CD1DE;
      box-shadow: 0px 0px 20px rgba(12, 209, 222, .5);
      border-radius: 5px;
    }
  }
  
  .ask-block {
    position: relative;
    height: 100%;
    display: flex;
  }

  .parser-select {
    width: 160px;

    & >>> .el-input__inner {
      font-size: 14px;
    }
  }

  .user-question-block {
    display: flex;
    align-items: center;
    width: calc(100% - 54px);
    margin-right: 16px;
    padding-right: 16px;
    background-color: #1D2424;
    border: 1px solid #1D2424;
    border-radius: 5px;
    overflow: hidden;
    transition: all .1s;

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

    .question-input {
      flex-basis: calc(100% - 65px);
      font-size: 14px;
      line-height: 36px;
      height: 38px;
      overflow: auto;
      padding-right: 30px;
      border-bottom: none;
      padding: 0 10px;

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
      flex-basis: 16px;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.5);
      margin-right: 16px;
    }

    .ask-btn {
      flex-basis: 16px;
      font-size: 20px;
      color: $theme-color-primary;
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .ask-btn {
      &__icon {
        font-size: 18px;
        fill: rgba(255, 255, 255, .8);

        &:hover {
          fill: rgba(255, 255, 255, 1);
        }

        &--show {
          fill: rgba(42, 210, 226, .8);

          &:hover {
            fill: #2AD2E2;
          }
        }
      }
    }

    &.disabled {
      opacity: .3;
    }

    .help-link {
      font-size: 13px;
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
    transition: all .1s;
    z-index: 90;
    background-color: #2D3033;
    border-radius: 5px;

    &.has-filter {
      bottom: 137px;
    }

    &.show {
      height: 160px;
      overflow: auto;
      padding: 4px 0;
    }

    .history-question {
      font-size: 14px;
      line-height: 20px;
      padding: 10px 18px;
      color: #fff;
      cursor: pointer;
      border-bottom: 1px solid #464A50;

      &:hover {
        background-color: #464A50;
      }


      .icon {
        margin-right: 14px;
      }
    }
  }

  .ask-helper {
    width: calc(100% - #{$app-side-nav-closed-width});
    height: calc(100vh - #{$header-height + $chat-room-height + $ask-condition-height});
    position: fixed;
    top: $header-height + $chat-room-height + $ask-condition-height;
    right: 0;
    background: #000;
    overflow: auto;
    padding: 32px 40px 0 40px;

    &--has-basic-df-setting {
      width: calc(100% - #{$app-side-nav-closed-width} - #{$basic-df-setting-width});
    }
  }
}
</style>
