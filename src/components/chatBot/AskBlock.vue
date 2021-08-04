<template>
  <div
    :class="{'is-focus': isInputFocus}"
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
          v-model.trim="currentUserQuestionPreview"
          class="question-input input"
          autocomplete="off"
          @keyup.shift.ctrl.72="toggleAskHelper()"
          @keyup.shift.ctrl.90="toggleAlgorithm()"
          @keyup.shift.ctrl.88="toggleWebSocketConnection()"
          @keydown.up.exact="handleKeydownMoveSuggestionCursor('up', $event)"
          @keydown.down.exact="handleKeydownMoveSuggestionCursor('down', $event)"
          @keydown.esc.exact.prevent="currentSelectedSuggestionIndex = -1"
          @keydown.tab.exact.prevent="autocompleteSuggestionQuestion(false)"
          @keypress.enter.exact.prevent="autocompleteSuggestionQuestion(true)"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        >
        <a
          href="javascript:void(0);"
          class="clean-btn"
          @click="clearQuestion"
        >
          <svg-icon icon-class="remove-circle" />
        </a>
        <a
          href="javascript:void(0);"
          class="ask-btn"
          @click="submitQuestion"
        >
          <svg-icon icon-class="go-right" />
        </a>
      </div>
      <div
        v-if="isShowAskHelperEntry"
        :class="{ 'disabled': availableDataSourceList.length === 0 }"
        class="ask-remark-block"
        @click="openAskHelper"
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
      :class="{hide: !isSuggestionBlockVisible, 'has-filter': hasFilter}"
      class="suggestion-block"
      @mouseleave="currentSelectedSuggestionIndex = -1"
    >
      <div
        v-show="isLoadingKnownTerms && userQuestion"
        class="known-terms-loading-status"
      >
        <spinner size="16" />
        <span class="known-terms-loading-status__text">{{ $t('editing.suggestionSearching') }}</span>
      </div>
      <div
        v-for="(suggestion, index) in suggestionList"
        :key="`suggestion-${index}`"
        class="suggestion"
        :class="{ focus: index === currentSelectedSuggestionIndex || (currentSelectedSuggestionIndex === -1 && index === 0) }"
        @click="fillInQuestion(suggestion.question, true, false)"
        @mouseenter="currentSelectedSuggestionIndex = index"
        tabindex="0"
      >
        <svg-icon
          :icon-class="suggestion.iconClass"
          class="icon"
        />
        <span v-html="suggestion.html" />
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
        @close="closeAskHelper"
      />
    </transition>
  </div>
</template>
<script>
import Vue from 'vue'
import AskHelperDialog from './AskHelperDialog'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { Message } from 'element-ui'
import DefaultSelect from '@/components/select/DefaultSelect'
import { Suggester, trimRedundant, defineTerm, defineSuggestionListItem } from '@/utils/questionSuggester'
import { getDataFrameCategoryDataValueById } from '@/API/DataSource'

/**
 * @typedef {Object} SuggestionListItem
 * @property {string} iconClass
 * @property {string} question
 * @property {string} html
 */

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
      userQuestion: '',
      websocketHandler: null,
      newParserMode: localStorage.getItem('newParser') === 'true',
      isInputFocus: false,
      isCompositionInputting: false,
      isLoadingKnownTerms: false,
      compositionInputStatusHandler: null,
      selectedSuggestionIndex: -1,
      /** @type {Suggester | null} */
      suggester: null,
      requestAnimationFrameTaskId: -1
    }
  },
  computed: {
    ...mapState(['isShowAskHelper']),
    ...mapState('chatBot', ['parserLanguageList', 'parserLanguage', 'copiedColumnName', 'isUseAlgorithm', 'setParserLanguage']),
    ...mapState('dataSource', ['dataSourceId', 'dataSourceList', 'appQuestion', 'filterList', 'historyQuestionList', 'dataFrameId', 'dataFrameList']),
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId', 'hasPermission']),
    isSuggestionBlockVisible () {
      return this.isInputFocus && (this.suggestionList.length > 0 || (this.isLoadingKnownTerms && this.userQuestion)) && !this.isShowAskHelper
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
        this.setParserLanguage(value)
      }
    },
    hasFilter () {
      return this.filterList.length > 0
    },
    dataSourceIdAndDataFrameId () {
      return `${this.dataSourceId}/${this.dataFrameId}`
    },
    dataFramesId () {
      return this.dataFrameList.map((dataFrame) => dataFrame.id)
    },
    currentUserQuestionPreview: {
      get () {
        return this.suggestionList[this.currentSelectedSuggestionIndex]?.question ??
          this.userQuestion
      },
      set (value) {
        this.currentSelectedSuggestionIndex = -1
        this.userQuestion = value
      }
    },
    currentSelectedSuggestionIndex: {
      get () {
        return this.isSuggestionBlockVisible
          ? this.selectedSuggestionIndex
          : -1
      },
      set (value) {
        if (!this.isSuggestionBlockVisible) {
          value = -1
        } else if (value !== -1) {
          const length = this.suggestionList.length
          if (length > 0) {
            value += 1
            value = ((value + length + 1) % (length + 1)) - 1
          } else {
            value = -1
          }
        }
        this.selectedSuggestionIndex = value

        if (value !== -1) {
          this.$refs.suggestionBlock.querySelectorAll('.suggestion')[value].focus()
          this.$refs.questionInput.focus()
        }
      }
    },
    suggestionList () {
      // History suggestion items
      const historySuggestionItems = [...new Set(this.historyQuestionList.map(history => history.question))]
        .filter((question) => this.userQuestion ? question.includes(trimRedundant(this.userQuestion)) : true)
        .map((question) => {
          return defineSuggestionListItem({
            iconClass: 'clock',
            question,
            html: question
          })
        })
      if (historySuggestionItems.length > 3) {
        historySuggestionItems.length = 3
      }

      // Keyword suggestion items
      /** @type {SuggestionListItem[]} */
      const keywordSuggestionItems = this.suggester?.suggestions ?? []

      return [...keywordSuggestionItems, ...historySuggestionItems]
    },
    availableDataSourceList () {
      if (!this.dataSourceList) return []
      return this.dataSourceList.filter(dataSource => dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount > 0)
    }
  },
  watch: {
    appQuestion (value) {
      this.fillInQuestion(value, false, false)
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
        this.clearQuestion()
        this.closeAskHelper()
      }

      if (to.name === 'PageIndex') {
        this.clearQuestion()
        this.closeAskHelper()
      }
    },
    copiedColumnName (value) {
      if (!value) return
      this.userQuestion = this.userQuestion ? this.userQuestion + value : value
      this.clearCopiedColumnName()
    },
    dataSourceIdAndDataFrameId () {
      this.setupSuggester()
    }
  },
  mounted () {
    this.userQuestion = this.defaultQuestion || this.$route.query.question
    this.$refs.questionInput.addEventListener('compositionstart', this.handleCompositionInputStart)
    this.$refs.questionInput.addEventListener('compositionend', this.handleCompositionInputEnd)
    this.suggester = Vue.observable(new Suggester())
    this.requestAnimationFrameTaskId = requestAnimationFrame(this.requestAnimationFrameTask)
    this.setupSuggester()
  },
  beforeDestroy () {
    this.$refs.questionInput.removeEventListener('compositionstart', this.handleCompositionInputStart)
    this.$refs.questionInput.removeEventListener('compositionend', this.handleCompositionInputEnd)
    this.closeAskHelper()
    if (this.websocketHandler) this.closeWebSocketConnection()
    cancelAnimationFrame(this.requestAnimationFrameTaskId)
  },
  methods: {
    ...mapMutations(['updateAskHelperStatus']),
    ...mapMutations('chatBot', ['clearCopiedColumnName', 'setDoDrillDown', 'setDoClickCorrelation', 'updateIsUseAlgorithm']),
    ...mapMutations('dataSource', ['setIsManuallyTriggeredAskQuestion', 'clearFilterList', 'setAppQuestion']),
    ...mapMutations('result', ['updateIsModelResult']),
    ...mapMutations('previewDataSource', ['togglePreviewDataSource']),
    ...mapActions('chatBot', ['openAskInMemory']),
    ...mapActions('dataSource', ['updateResultRouter', 'getDataSourceColumnInfo', 'getDataSourceDataValue']),
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
        this.setDoDrillDown(true)
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
        this.clearQuestion()
        return
      }
      if (evt.data === '點擊環境濕度') {
        // 點擊環境溫度
        this.setDoClickCorrelation(true)
        return
      }
      if (evt.data === '取消過濾條件') {
        // 清空 drill down
        this.clearFilterList()
        Message({
          message: '已取消過濾條件',
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        return
      }

      this.userQuestion = evt.data
      this.submitQuestion()
    },
    onWebSocketClose (evt) {
    },
    clearQuestion () {
      if (this.availableDataSourceList.length === 0) return
      this.userQuestion = ''
    },
    submitQuestion () {
      let modelQuestionKeyWordList = ['預測', '專案', '是否', '成案']
      if (this.availableDataSourceList.length === 0) return
      /**
       * 移除特殊符號 (unicode \u0008, referred to as \b in strings)
       * 先移除特殊符號再問問句
       */
      this.setAppQuestion(this.userQuestion.replace(/[\b]/g, ''))
      if (this.redirectOnAsk) {
        this.updateResultRouter('key_in')

        /* For demo */
        let correctCount = 0
        modelQuestionKeyWordList.forEach(word => {
          correctCount += this.userQuestion.includes(word)
        })
        if (correctCount >= 2) this.updateIsModelResult(true)
        else this.updateIsModelResult(false)
        /* For demo */
      } else {
        // 手動觸發問問題
        this.setIsManuallyTriggeredAskQuestion(true)
      }
      this.closeAskHelper()
    },
    fillInQuestion (question, submit, focusAfterFillIn) {
      this.userQuestion = question
      if (focusAfterFillIn) {
        this.focusInput()
      } else {
        this.blurInput()
      }

      if (submit) {
        this.submitQuestion()
      }
    },
    autocompleteSuggestionQuestion (submit) {
      if (this.isCompositionInputting) return
      if (this.currentSelectedSuggestionIndex === -1 && submit) {
        this.submitQuestion()
        return
      }
      const index = this.currentSelectedSuggestionIndex === -1 && this.suggestionList.length > 0
        ? 0
        : this.currentSelectedSuggestionIndex
      if (index === -1) return
      const { question } = this.suggestionList[index]
      this.fillInQuestion(question, submit, !submit)
      this.currentSelectedSuggestionIndex = -1
    },
    closePreviewDataSource () {
      this.togglePreviewDataSource(false)
    },
    openAskHelper () {
      if (this.availableDataSourceList.length === 0) return
      this.updateAskHelperStatus(true)
      this.closePreviewDataSource()
    },
    closeAskHelper () {
      this.updateAskHelperStatus(false)
    },
    toggleAskHelper () {
      if (this.isShowAskHelper) {
        this.closeAskHelper()
      } else {
        this.openAskHelper()
      }
    },
    toggleAlgorithm () {
      this.updateIsUseAlgorithm(!this.isUseAlgorithm)
    },
    handleInputFocus () {
      this.isInputFocus = true
      this.openAskInMemory()
    },
    handleInputBlur () {
      this.isInputFocus = false
    },
    focusInput () {
      this.$refs.questionInput.focus()
    },
    blurInput () {
      this.$refs.questionInput.blur()
    },
    handleCompositionInputStart () {
      this.isCompositionInputting = true
    },
    handleCompositionInputEnd () {
      this.isCompositionInputting = false
    },
    handleKeydownMoveSuggestionCursor (direction, event) {
      if (this.isCompositionInputting) return

      event?.preventDefault?.()
      const availableDirections = ['up', 'down']
      if (!availableDirections.includes(direction)) return
      this.currentSelectedSuggestionIndex = direction === 'up'
        ? this.currentSelectedSuggestionIndex - 1
        : this.currentSelectedSuggestionIndex + 1
    },
    async setupSuggester () {
      if (this.dataSourceIdAndDataFrameId.includes('null')) return
      this.suggester = null

      const newSuggester = Vue.observable(new Suggester())
      this.suggester = newSuggester
      const appendColumns = async () => {
        const data = await this.getDataSourceColumnInfo({ shouldStore: false })
        const terms = [...new Set(Object.values(data).flat())]
          .map((value) => defineTerm({ type: 'dataColumn', value }))
        newSuggester.appendKnownTerms(terms)
      }
      const appendDataValueByDataFrameId = async (dataFrameId) => {
        const data = await getDataFrameCategoryDataValueById(dataFrameId)
        const terms = data.values
          .map((value) => defineTerm({ type: 'dataValue', value }))
        newSuggester.appendKnownTerms(terms)
      }
      this.isLoadingKnownTerms = true
      const promises = [
        appendColumns(),
        ...(this.dataFrameId === 'all' ? this.dataFramesId : [this.dataFrameId])
          .map((dataFrameId) => appendDataValueByDataFrameId(dataFrameId))
      ]
      await Promise.all(promises)
      this.isLoadingKnownTerms = false
    },
    updateSuggester () {
      const el = this.$refs.questionInput ?? null
      if (el === null || this.suggester === null || this.currentSelectedSuggestionIndex !== -1) return
      this.suggester.update(el.value, el.selectionStart)
    },
    requestAnimationFrameTask () {
      this.updateSuggester()
      this.requestAnimationFrameTaskId = requestAnimationFrame(this.requestAnimationFrameTask)
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
      border-bottom: 0;
      flex-basis: calc(100% - 65px);
      font-size: 14px;
      height: 38px;
      line-height: 36px;
      overflow: auto;
      padding: 0 10px;
      padding-right: 30px;
      width: 100%;

      &::placeholder {
        opacity: 0.5;
      }

      &:disabled {
        &::placeholder {
          opacity: 0.15;
        }

        ~ .ask-btn,
        ~ .clean-btn {
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
    left: 0;
    max-height: 200px;
    overflow: auto;
    padding: 4px 0;
    position: absolute;
    text-align: left;
    top: 100%;
    transform: translateY(0) scaleY(1);
    transition: all 0.1s;
    width: calc(100% - 56px);
    z-index: 90;

    &.has-filter {
      bottom: 137px;
    }

    &.hide {
      transform: translateY(-50%) scaleY(0);
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
      &.focus {
        background-color: #464a50;
        outline: none;
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

    .known-terms-loading-status {
      align-items: center;
      display: flex;
      font-size: 0;

      ::v-deep .spinner-block {
        display: inline-block;
        padding: 8px 16px;
      }

      &__text {
        font-size: 16px;
        opacity: 0.5;
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
