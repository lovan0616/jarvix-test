<template>
  <div class="history-question-list-block">
    <div class="icon-button"
      :class="{active: isDropdownOpen}"
      @click="toggleListDisplay"
    >
      <svg-icon icon-class="clock" class="icon"></svg-icon>
    </div>
    <transition name="fade">
      <div class="history-question-list"
        v-if="isDropdownOpen"
      >
        <div class="single-history-question"
          v-for="singleQuestion in questionList"
          :key="singleQuestion.id"
          @click="chooseHistoryQuestion(singleQuestion)"
        >
          <div class="ask-time">{{ timeStampToDateTime2(singleQuestion.askDate) }}</div>
          <div class="question-name">{{ singleQuestion.question }}</div>
          <div class="ask-type-block">
            <div class="ask-type"
              :class="{preview: singleQuestion.askType === 'Preview'}"
            >{{ typeTransform(singleQuestion.askType) }}</div>
          </div>
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
  watch: {
    '$route.path' () {
      this.isDropdownOpen = false
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
    chooseHistoryQuestion (questionInfo) {
      this.$store.commit('bookmark/setAppQuestion', questionInfo.question)
      this.$store.dispatch('bookmark/changeBookmarkById', questionInfo.bookmark_id)
      this.$store.dispatch('bookmark/updateResultRouter')
      this.isDropdownOpen = false
    },
    typeTransform (value) {
      switch (value) {
        case 'Preview':
          return '预览'
        case 'Result':
          return '结果'
      }
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
    background-color: rgba(255, 255, 255, 0.15);
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
      color: #fff;
      font-size: 30px;
    }
  }
}
.history-question-list {
  position: absolute;
  top: auto;
  right: 0;
  width: 210px;
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  max-height: 75vh;
  overflow: auto;
  z-index: 990;

  .single-history-question {
    padding: 15px;
    cursor: pointer;

    &:not(:last-child) {
      border-bottom: 0.75px solid $theme-line-color;
    }

    &:hover {
      .question-name {
        color: #9FC2C6;
      }
    }

    .ask-time {
      font-size: 12px;
      line-height: 16px;
      color: $theme-text-color-light;
      margin-bottom: 10px;
    }

    .question-name {
      font-weight: 400;
      font-size: 14px;
      line-height: normal;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }

    .ask-type-block {
      display: flex;
    }

    .ask-type {
      background-color: #9FC2C6;
      border-radius: 10px;
      font-size: 12px;
      line-height: 16px;
      padding: 0 8px;
      color: #fff;

      &.preview {
        background-color: #48666A;
      }
    }
  }
}
</style>
