<template>
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
        @focus="focusInput"
      >
    </div>
    <div class="history-question-block"
      :class="{show: showHistoryQuestion && historyQuestionList.length > 0}"
    >
      <div class="title">{{ $t('askHelper.historyTitle') }}</div>
      <div class="history-question"
        v-for="singleHistory in historyQuestionList"
        :key="singleHistory.id"
        @click="copyQuestion(singleHistory.question)"
      ><svg-icon icon-class="clock" class="icon"></svg-icon> {{ singleHistory.question }}</div>
    </div>
    <ask-helper-dialog></ask-helper-dialog>
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
      showHistoryQuestion: false
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
      if (this.showHistoryQuestion && !this.$el.contains(evt.target)) {
        this.showHistoryQuestion = false
      }
    },
    enterQuestion () {
      this.$store.commit('bookmark/setAppQuestion', this.userQuestion)
      this.$refs.questionInput.select()
      this.$store.dispatch('bookmark/updateResultRouter', 'key_in')
      this.hideHistory()
    },
    copyQuestion (value) {
      this.userQuestion = value
      this.$nextTick(() => {
        this.$refs.questionInput.select()
      })
    },
    focusInput () {
      if (this.showHistoryQuestion) return
      this.showHistoryQuestion = true
    },
    hideHistory () {
      this.showHistoryQuestion = false
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
        : this.$store.state.bookmark.historyQuestionList.filter(d => { return d.bookmark_id === this.bookmarkId })
    }
  },
  watch: {
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
.ask-block {
  position: relative;
  padding: 16px 32px;
  background-color: rgba(35, 61, 64, 0.6);

  .user-question-block {
    position: relative;
    margin-bottom: 16px;
    z-index: 999;

    &:after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background-image: linear-gradient(90deg, #4DE2F0 0%, rgba(77, 226, 240, 0.2) 100%);
    }

    .question-input {
      width: 100%;
      font-size: 24px;
      line-height: 36px;
      height: auto;
      min-height: 48px;
      max-height: 76px;
      overflow: auto;
    }
  }

  .history-question-block {
    position: absolute;
    text-align: left;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0;
    overflow: hidden;
    padding: 0 32px;
    transition: height 0.3s;
    z-index: 90;
    background-color: rgba(40, 71, 74, 0.95);
    border-top: 1px solid #415E60;

    &.show {
      bottom: 110px;
      height: 250px;
      overflow: auto;
    }

    .title {
      line-height: 50px;
    }

    .history-question {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      padding: 12px;
      color: #4DE2F0;
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
