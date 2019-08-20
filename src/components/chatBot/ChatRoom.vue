<template>
  <div class="chat-room-block"
    :class="{'is-show': isShowChatRoom}"
  >
    <a href="javascript:void(0)" class="close-btn"
      @click="closeChatRoom"
    >
      <svg-icon icon-class="double-arrow-left" class="arrow-icon"></svg-icon>
    </a>
    <div class="chat-room-header">
      <img src="@/assets/images/logo_white.svg" alt="sygps-logo" class="chat-bot-logo">
      <bookmark-select class="bookmark-select"></bookmark-select>
    </div>
    <conversation-block></conversation-block>
    <div class="user-input-block">
      <div class="user-question-block">
        <!-- 這裡的 prevent 要避免在 firefox 產生換行的問題 -->
        <textarea name="question" class="question-input"
          rows="1"
          ref="questionInput"
          placeholder="请输入您的问题"
          @input="textareaResize"
          v-model="userQuestion"
          @keypress.enter.prevent="enterQuestion"
        ></textarea>
        <img src="@/assets/images/input.svg" class="question-input-img" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import ConversationBlock from './ConversationBlock'
import BookmarkSelect from '@/components/select/BookmarkSelect'

export default {
  name: 'ChatRoomBlock',
  components: {
    BookmarkSelect,
    ConversationBlock
  },
  data () {
    return {
      userQuestion: null
    }
  },
  mounted () {
    this.$refs.questionInput.focus()
  },
  methods: {
    closeChatRoom () {
      this.$store.commit('updateChatRoomStatus', false)
    },
    textareaResize () {
      this.$refs.questionInput.style.height = 'auto'
      this.$refs.questionInput.style.height = this.$refs.questionInput.scrollHeight + 'px'
    },
    enterQuestion () {
      this.$store.commit('bookmark/setAppQuestion', this.userQuestion)
      this.$refs.questionInput.blur()
      this.$store.dispatch('bookmark/updateResultRouter')
      this.userQuestion = null
    }
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  },
  watch: {
    // 判斷關閉時機
    '$route.name' (value) {
      if (value === 'PageDataSourceList' || value === 'PagePinboard') {
        this.$store.commit('updateChatRoomStatus', false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-room-block {
  position: relative;
  width: $chat-room-width;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow: auto;
  padding: 24px 32px 32px;
  transform: translateX(-$chat-room-width);
  transition: transform 0.3s;

  &.is-show {
    transform: translateX(0);
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: block;
    width: 50px;
    height: 50px;
    z-index: 999;

    .arrow-icon {
      font-size: 48px;
    }
  }

  .chat-room-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .chat-bot-logo {
      width: 120px;
    }

    .bookmark-select {
      width: 150px;
    }
  }

  .user-input-block {
    position: absolute;
    right: 0;
    bottom: 48px;
    left: 0;
    margin: auto;
    padding: 0 40px;
  }
  .user-question-block {
    position: relative;

    .question-input {
      width: 100%;
      font-size: 24px;
      line-height: 36px;
      height: auto;
      min-height: 48px;
      max-height: 76px;
      overflow: auto;
    }

    .question-input-img {
      position: absolute;
      right: 0;
      bottom: -42px;
      left: 0;
      margin: auto;
      width: 100%;
      z-index: -1;
    }
  }
}
</style>
