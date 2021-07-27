<template>
  <div
    :class="{'is-focus': isFocus}"
    class="ask-container"
  >
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
          :class="{ 'disabled': availableDataSourceList.length === 0 }"
          :name="new Date().getTime()"
          :placeholder="$t('editing.askPlaceHolder')"
          :disabled="availableDataSourceList.length === 0"
          v-model.trim="userQuestion"
          class="question-input input"
          autocomplete="off"
          @keypress.enter.prevent="enterQuestion"
          @keyup.shift.ctrl.72="toggleHelper()"
          @keyup.shift.ctrl.90="toggleAlgorithm()"
          @keyup.shift.ctrl.88="toggleWebSocketConnection()"
          @keydown.up.exact.prevent="currentSelectedSuggestionIndex -= 1"
          @keydown.down.exact.prevent="currentSelectedSuggestionIndex += 1"
          @focus="focusInput"
          @blur="blurInput"
        >
        <a
          href="javascript:void(0);"
          class="clean-btn"
          @click="cleanQuestion"
        >
          <svg-icon icon-class="remove-circle" />
        </a>
        <a
          href="javascript:void(0);"
          class="ask-btn"
          @click="enterQuestion"
        >
          <svg-icon icon-class="go-right" />
        </a>
      </div>
      <div
        v-if="isShowAskHelperEntry"
        :class="{ 'disabled': availableDataSourceList.length === 0 }"
        class="ask-remark-block"
        @click="openAskHelperDialog"
      >
        <el-tooltip
          slot="label"
          :content="$t('askHelper.title')"
        >
          <svg-icon
            :class="{'ask-btn__icon--show': isShowAskHelper}"
            icon-class="ask-helper"
            class="ask-btn__icon"
          />
        </el-tooltip>
      </div>
    </div>
    <div
      ref="suggestionBlock"
      :class="{show: isSuggestionBlockVisible && (historyQuestionList.length > 0 || suggestionQuestionList.length > 0), 'has-filter': hasFilter}"
      class="suggestion-block"
      @keydown.up.exact.prevent="currentSelectedSuggestionIndex -= 1"
      @keydown.down.exact.prevent="currentSelectedSuggestionIndex += 1"
      @keydown.tab.exact.prevent="autocompleteQuestion(false)"
      @keypress.enter.exact.prevent="autocompleteQuestion(true)"
      @focus="focusSuggestionBlock"
      @blur="blurSuggestionBlock"
    >
      <div
        v-for="(singleHistory, index) in historyQuestionList"
        :key="`history-${index}`"
        class="suggestion"
        @click="copyQuestion(singleHistory.question)"
        tabindex="0"
      >
        <svg-icon
          icon-class="clock"
          class="icon"
        />
        <span>{{ singleHistory.question }}</span>
      </div>
      <div
        v-for="(singleSuggestion, index) in suggestionQuestionList"
        :key="`suggestion-${index}`"
        class="suggestion"
        @click="copyQuestion(singleSuggestion.question)"
        tabindex="0"
      >
        <svg-icon
          icon-class="search"
          class="icon"
        />
        <span v-html="singleSuggestion.questionHtml" />
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
import Vue from 'vue'
import AskHelperDialog from './AskHelperDialog'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import DefaultSelect from '@/components/select/DefaultSelect'
import { Suggester, replaceWith } from '@/utils/questionSuggester'

export default {
  name: 'AskBlock',
  components: {
    AskHelperDialog,
    DefaultSelect
  },
  props: {
    // 因應 Dashboard 問問題後不需要轉址
    redirectOnAsk: {
      type: Boolean,
      default: true
    },
    isShowAskHelperEntry: {
      type: Boolean,
      default: true
    },
    defaultQuestion: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      userQuestion: null,
      isSuggestionBlockVisible: false,
      websocketHandler: null,
      isInputFocus: false,
      isSuggestionBlockFocus: false,
      selectedSuggestionIndex: -1,
      /** @type {Suggester | null} */
      suggester: null,
      updateSuggesterRequestFrameId: -1
    }
  },
  computed: {
    ...mapState('chatBot', ['parserLanguageList', 'parserLanguage', 'copiedColumnName']),
    ...mapState('dataSource', ['dataSourceId', 'appQuestion']),
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId', 'hasPermission']),
    isFocus () {
      return this.isInputFocus || this.isSuggestionBlockFocus
    },
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
    hasFilter () {
      return this.$store.state.dataSource.filterList.length > 0
    },
    isShowAskHelper () {
      return this.$store.state.isShowAskHelper
    },
    currentSelectedSuggestionIndex: {
      get () {
        return this.selectedSuggestionIndex
      },
      set (value) {
        if (value !== -1) {
          const length = this.historyQuestionList.length + this.suggestionQuestionList.length
          if (length > 0) {
            value += 1
            value = ((value + length + 1) % (length + 1)) - 1
          } else {
            value = -1
          }
        }
        this.selectedSuggestionIndex = value

        let el
        if (value === -1) {
          el = this.$refs.questionInput
        } else {
          el = this.$refs.suggestionBlock.querySelectorAll('.suggestion')[value]
        }
        el.focus()
      }
    },
    historyQuestionList () {
      // 過濾 boomark 以及 問題字串
      return this.userQuestion
        ? this.$store.state.dataSource.historyQuestionList.filter(element => { return element.question.indexOf(this.userQuestion) > -1 })
        : []
    },
    suggestionQuestionList () {
      if (this.suggester === null) return []
      /** @type {import('@/utils/questionSuggester').Suggestion[]} */
      const suggestions = this.suggester.suggestions
      const originalQuestion = this.suggester.getInputString()
      return suggestions.map((suggestion) => {
        const replacementStart = suggestion.keyword.words[0].startGapIndex
        const replacementEnd = suggestion.keyword.words.slice(-1)[0].endGapIndex
        const newReplacementEnd = replacementStart + suggestion.result.value.length
        const finalQuestion = replaceWith(originalQuestion, replacementStart, replacementEnd, suggestion.result.value)

        let questionHtml = `${finalQuestion.substring(0, replacementStart)}<span class="bold">` +
          finalQuestion.substring(replacementStart, newReplacementEnd)
            .split('')
            .map((c, i) => suggestion.result.positions.includes(i)
              ? `<span class="highlight">${c}</span>`
              : c
            )
            .join('') +
            `</span>${finalQuestion.substring(newReplacementEnd)}`

        return {
          questionHtml,
          question: finalQuestion
        }
      })
    },
    isUseAlgorithm () {
      return this.$store.state.chatBot.isUseAlgorithm
    },
    dataSourceList () {
      return this.$store.state.dataSource.dataSourceList
    },
    availableDataSourceList () {
      if (!this.dataSourceList) return []
      return this.dataSourceList.filter(dataSource => dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount > 0)
    }
  },
  watch: {
    userQuestion (val) {
      if (document.activeElement === this.$refs.questionInput) {
        this.showSuggestionBlock()
      }
    },
    appQuestion (value) {
      this.copyQuestion(value)
    },
    '$route' (to, from) {
      // 透過 drilldown 切換 dataframe 時不清空問句 input
      if (from.name === 'PageResult' && to.name === 'PageResult') return
      // 其他情況切換 datasource 或 dataframe 時會觸發回首頁，此變化才清空問句 input: 可能切換至沒有 datasource 的群組
      if (
        !to.query.dataSourceId ||
        !to.query.dataFrameId ||
        (to.query.dataSourceId).toString() !== (from.query.dataSourceId).toString() ||
        (to.query.dataFrameId).toString() !== (from.query.dataFrameId).toString()
      ) {
        this.userQuestion = null
        this.closeHelper()
      }

      // 回首頁的話，關閉彈出視窗，有需要清問句的話，再加進上方條件
      if (to.name === 'PageIndex') {
        this.closeHelper()
      }
    },
    copiedColumnName (value) {
      if (!value) return
      this.userQuestion = this.userQuestion ? this.userQuestion + value : value
      this.clearCopiedColumnName()
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    this.userQuestion = this.defaultQuestion || this.$route.query.question
    this.suggester = Vue.observable(new Suggester())
    this.updateSuggesterRequestFrameId = requestAnimationFrame(this.updateSuggester)
  },
  destroyed () {
    this.closeHelper()
    document.removeEventListener('click', this.autoHide, false)
    if (this.websocketHandler) this.closeWebSocketConnection()
    cancelAnimationFrame(this.updateSuggesterRequestFrameId)
  },
  methods: {
    ...mapMutations('chatBot', ['clearCopiedColumnName']),
    ...mapMutations('dataSource', ['setIsManuallyTriggeredAskQuestion']),
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
            account_id: this.getCurrentAccountId,
            group_id: this.getCurrentGroupId
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
      if (this.isSuggestionBlockVisible && !clickInside) {
        this.isSuggestionBlockVisible = false
      }

      // 歷史問句與問句提示同時顯示時，若是點擊到問句提示則關閉歷史問句
      if (this.isSuggestionBlockVisible && this.$refs.helperDialog && this.$refs.helperDialog.$el.contains(evt.target)) {
        this.isSuggestionBlockVisible = false
      }
    },
    cleanQuestion () {
      if (this.availableDataSourceList.length === 0) return
      this.userQuestion = null
    },
    enterQuestion () {
      let modelQuestionKeyWordList = ['預測', '專案', '是否', '成案']
      if (this.availableDataSourceList.length === 0) return
      /**
       * 移除特殊符號 (unicode \u0008, referred to as \b in strings)
       * 先移除特殊符號再問問句
       */
      this.$store.commit('dataSource/setAppQuestion', this.userQuestion.replace(/[\b]/g, ''))
      if (this.redirectOnAsk) {
        this.$store.dispatch('dataSource/updateResultRouter', 'key_in')

        /* For demo */
        let correctCount = 0
        modelQuestionKeyWordList.forEach(word => {
          correctCount += this.userQuestion.includes(word)
        })
        if (correctCount >= 2) this.$store.commit('result/updateIsModelResult', true)
        else this.$store.commit('result/updateIsModelResult', false)
        /* For demo */
      } else {
        // 手動觸發問問題
        this.setIsManuallyTriggeredAskQuestion(true)
      }
      this.hideSuggestionBlock()
      this.closeHelper()
    },
    copyQuestion (value) {
      this.userQuestion = value
      this.$refs.questionInput.focus()
      this.enterQuestion()
    },
    showSuggestionBlock () {
      if (this.isSuggestionBlockVisible || this.isShowAskHelper) return
      this.isSuggestionBlockVisible = true
    },
    hideSuggestionBlock () {
      this.isSuggestionBlockVisible = false
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    },
    openAskHelperDialog () {
      if (this.availableDataSourceList.length === 0) return
      this.$store.commit('updateAskHelperStatus', !this.isShowAskHelper)
      this.closePreviewDataSource()
      this.hideSuggestionBlock()
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
      this.isInputFocus = true
      this.$store.dispatch('chatBot/openAskInMemory')
      this.currentSelectedSuggestionIndex = -1
      this.showSuggestionBlock()
    },
    blurInput () {
      this.isInputFocus = false
    },
    focusSuggestionBlock () {
      this.isSuggestionBlockFocus = true
    },
    blurSuggestionBlock () {
      this.isSuggestionBlockFocus = false
    },
    updateSuggester () {
      if (this.suggester === null) return
      const el = this.$refs.questionInput
      this.suggester.setInputString(el.value)
      this.suggester.setCaretGapIndex(el.selectionStart)
      this.updateSuggesterRequestFrameId = requestAnimationFrame(this.updateSuggester)
    },
    async autocompleteQuestion (needEnter = false) {
      if (this.currentSelectedSuggestionIndex === -1) return
      const { question } = [...this.historyQuestionList, ...this.suggestionQuestionList][this.currentSelectedSuggestionIndex]
      if (needEnter) {
        this.copyQuestion(question)
      } else {
        this.userQuestion = question
        this.$refs.questionInput.focus()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ask-container {
  flex: 1;
  position: relative;

  &.is-focus {
    .user-question-block {
      border: 1px solid #0cd1de;
      border-radius: 5px 5px 0 0;
      border-radius: 5px;
      box-shadow: 0 0 20px rgba(12, 209, 222, 0.5);
    }
  }

  .ask-block {
    display: flex;
    height: 100%;
    position: relative;
  }

  .parser-select {
    width: 160px;

    >>> .el-input__inner {
      font-size: 14px;
    }
  }

  .user-question-block {
    align-items: center;
    background-color: #1d2424;
    border: 1px solid #1d2424;
    border-radius: 5px;
    display: flex;
    padding-right: 16px;
    transition: all 0.1s;
    width: 100%;

    &.has-filter {
      &::after {
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
      border-bottom: none;
      flex-basis: calc(100% - 65px);
      font-size: 14px;
      height: 38px;
      line-height: 36px;
      overflow: auto;
      padding: 0 10px;
      padding-right: 30px;

      &::placeholder {
        opacity: #888;
      }

      &:disabled {
        &::placeholder {
          opacity: 0.15;
        }

        & ~ .ask-btn,
        & ~ .clean-btn {
          opacity: 0.15;
        }
      }
    }

    .clean-btn {
      color: rgba(255, 255, 255, 0.5);
      flex-basis: 16px;
      font-size: 16px;
      margin-right: 16px;
    }

    .ask-btn {
      color: $theme-color-primary;
      flex-basis: 16px;
      font-size: 20px;
    }

    &:not(:last-child) {
      margin-right: 16px;
      width: calc(100% - 54px);
    }
  }

  .ask-remark-block {
    align-items: center;
    border: 1px solid #2d3033;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    height: 40px;
    justify-content: center;
    letter-spacing: 0.05em;
    text-align: left;
    width: 40px;

    .ask-btn {
      &__icon {
        fill: rgba(255, 255, 255, 0.8);
        font-size: 18px;

        &:hover {
          fill: rgba(255, 255, 255, 1);
        }

        &--show {
          fill: rgba(42, 210, 226, 0.8);

          &:hover {
            fill: #2ad2e2;
          }
        }
      }
    }

    &.disabled {
      opacity: 0.3;
    }

    .help-link {
      font-size: 13px;
    }
  }

  .algorithm-status {
    color: #333;
    font-size: 14px;
    left: 0;
    opacity: 0.6;
    position: absolute;
    top: -18px;
  }

  .suggestion-block {
    background-color: #2d3033;
    border-radius: 5px;
    height: 0;
    left: 0;
    overflow: hidden;
    position: absolute;
    text-align: left;
    top: 100%;
    transition: all 0.1s;
    width: calc(100% - 56px);
    z-index: 90;

    &.has-filter {
      bottom: 137px;
    }

    &.show {
      height: 160px;
      overflow: auto;
      padding: 4px 0;
    }

    .suggestion {
      border-bottom: 1px solid #464a50;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: 300;
      line-height: 20px;
      padding: 10px 18px;

      &:hover,
      &:focus {
        background-color: #464a50;
      }

      .icon {
        margin-right: 14px;
      }

      ::v-deep .bold {
        font-weight: 600;
      }

      ::v-deep .highlight {
        color: $theme-color-primary;
      }
    }
  }

  .ask-helper {
    background: #000;
    height: calc(100vh - #{$header-height + $chat-room-height + $ask-condition-height});
    overflow: auto;
    padding: 32px 40px 0;
    position: fixed;
    right: 0;
    top: $header-height + $chat-room-height + $ask-condition-height;
    width: calc(100% - #{$app-side-nav-closed-width});

    &--has-basic-df-setting {
      width: calc(100% - #{$app-side-nav-closed-width} - #{$basic-df-setting-width});
    }
  }
}
</style>
