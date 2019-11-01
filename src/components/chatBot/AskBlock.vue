<template>
  <div class="ask-container">
    <div class="ask-block">
      <div class="user-question-block">
        <!-- 這裡的 prevent 要避免在 firefox 產生換行的問題 -->
        <input class="question-input input"
          ref="questionInput"
          :name="new Date().getTime()"
          :placeholder="$t('editing.askPlaceHolder')"
          autocomplete="off"
          v-model="userQuestion"
          @keypress.enter.prevent="enterQuestion"
          @keyup.shift.ctrl.72="toggleHelper()"
        >
        <a href="javascript:void(0);" class="clean-btn"
          @click="cleanQuestion"
        >
          <svg-icon icon-class="remove-circle"></svg-icon>
        </a>
        <a href="javascript:void(0);" class="ask-btn"
          @click="enterQuestion"
        >
          <svg-icon icon-class="go-right"></svg-icon>
        </a>
      </div>
      <div class="ask-remark-block">{{ $t('askHelper.askHelpRemark') }}<a href="javascript:void(0)" class="link help-link"
        @click="showHelper"
      >{{ $t('askHelper.helpLink') }}</a> </div>
    </div>
    <div class="history-question-block"
      :class="{show: showHistoryQuestion && historyQuestionList.length > 0}"
    >
      <a href="javascript:void(0)" class="close-btn"
        @click="hideHistory"
      >
        <svg-icon icon-class="close"></svg-icon>
      </a>
      <div class="title">{{ $t('askHelper.historyTitle') }}</div>
      <div class="history-question"
        v-for="singleHistory in historyQuestionList"
        :key="singleHistory.id"
        @click="copyQuestion(singleHistory.question)"
      ><svg-icon icon-class="clock" class="icon"></svg-icon> {{ singleHistory.question }}</div>
    </div>
    <ask-helper-dialog
      ref="helperDialog"
      :key="bookmarkId"
      :show="showAskHelper"
      @close="closeHelper"
    ></ask-helper-dialog>
  </div>
</template>
<script>
import AskHelperDialog from './AskHelperDialog'

export default {
  name: 'AskBlock',
  components: {
    AskHelperDialog
  },
  data () {
    return {
      userQuestion: null,
      showHistoryQuestion: false,
      showAskHelper: false
    }
  },
  mounted () {
    // this.$refs.questionInput.focus()
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
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
      this.userQuestion = null
    },
    enterQuestion () {
      this.$store.commit('bookmark/setAppQuestion', this.userQuestion)
      this.$store.dispatch('bookmark/updateResultRouter', 'key_in')
      this.hideHistory()
      this.closeHelper()
    },
    copyQuestion (value) {
      this.userQuestion = value
    },
    showHistory () {
      if (this.showHistoryQuestion || this.showAskHelper) return
      this.showHistoryQuestion = true
    },
    hideHistory () {
      this.showHistoryQuestion = false
    },
    showHelper () {
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
    }
  },
  computed: {
    bookmarkId () {
      return this.$store.state.bookmark.bookmarkId
    },
    appQuestion () {
      return this.$store.state.bookmark.appQuestion
    },
    historyQuestionList () {
      // 過濾 boomark 以及 問題字串
      return this.userQuestion
        ? this.$store.state.bookmark.historyQuestionList.filter(d => { return d.question.indexOf(this.userQuestion) > -1 && d.bookmark_id === this.bookmarkId })
        : []
    }
  },
  watch: {
    userQuestion () {
      if (document.activeElement === this.$refs.questionInput) {
        this.showHistory()
      }
    },
    appQuestion (value) {
      this.copyQuestion(value)
    },
    bookmarkId (value, oldValue) {
      if (!oldValue) return
      this.userQuestion = null
    }
  }
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

  .ask-remark-block {
    font-size: 13px;
    line-height: 30px;
    text-align: left;
    letter-spacing: 0.05em;

    .help-link {
      font-size: 13px;
      margin-left: 4px;
    }
  }

  .history-question-block {
    position: absolute;
    text-align: left;
    left: 0;
    bottom: 110px;
    width: 100%;
    height: 0;
    overflow: hidden;
    padding: 0 32px;
    transition: height 0.3s;
    z-index: 90;
    background-color: rgba(40, 71, 74, 0.95);
    border-top: 1px solid #415E60;

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
