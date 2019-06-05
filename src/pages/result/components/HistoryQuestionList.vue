<template>
  <div class="history-question-list-block">
    <div class="icon-button"
      :class="{active: isDropdownOpen}"
      @click="toggleListDisplay"
    >
      <svg-icon icon-class="circle-outline" class="icon"></svg-icon>
    </div>
    <transition name="fade">
      <div class="history-question-list"
        v-if="isDropdownOpen"
      >
        <div class="single-history-question"
          v-for="singleQuestion in questionList"
          :key="singleQuestion.id"
          @click="chooseHistoryQuestion(singleQuestion.bookmark_id, singleQuestion.question)"
        >
          <div class="question-database">{{ findBookmarkById(singleQuestion.bookmark_id) }}</div>
          <div class="question-name">{{ singleQuestion.question }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'HistoryQuestionList',
  data () {
    return {
      isDropdownOpen: false
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.isDropdownOpen) return false
      if (!this.$el.contains(evt.target)) {
        this.isDropdownOpen = false
      }
    },
    toggleListDisplay () {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    findBookmarkById (bookmarkId) {
      if (!bookmarkId) return 'no bookmark'
      return this.$store.getters['bookmark/findBookmarkById'](bookmarkId)
    },
    chooseHistoryQuestion (bookmarkId, question) {
      this.$store.commit('bookmark/setAppQuestion', question)
      this.$store.commit('bookmark/setBookmarkId', bookmarkId)
      this.$store.dispatch('bookmark/updateResultRouter')
    }
  },
  computed: {
    questionList () {
      return this.$store.state.bookmark.historyQuestionList
    }
  }
}
</script>
<style lang="scss" scoped>
.history-question-list-block {
  position: relative;

  .icon-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    background-color: #fff;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.12);
    border-radius: 50%;
    margin-bottom: 16px;
    cursor: pointer;

    &.active, &:hover {
      background-color: #78A5A9;

      .icon {
        color: #fff;
      }
    }

    .icon {
      color: #42A5B3;
      font-size: 30px;
    }
  }
}
.history-question-list {
  position: absolute;
  top: auto;
  right: 0;
  width: 210px;
  background: #FFF;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;

  .single-history-question {
    padding: 15px;
    cursor: pointer;

    &:not(:last-child) {
      border-bottom: 0.75px solid $theme-line-color;
    }

    .question-database {
      font-size: 12px;
      line-height: normal;
      letter-spacing: 0.05em;
      color: $theme-text-color-light;
      margin-bottom: 10px;
    }

    .question-name {
      font-weight: 400;
      font-size: 14px;
      line-height: normal;
      letter-spacing: 0.05em;
    }
  }
}
</style>
