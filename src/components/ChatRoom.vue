<template>
  <div class="chat-room-block"
    :class="{'is-show': isShowChatRoom}"
  >
    <a href="javascript:void(0)" class="close-btn"
      @click="closeChatRoom"
    >
      <svg-icon icon-class="double-arrow-left" class="arrow-icon"></svg-icon>
    </a>
    <img src="@/assets/images/logo_white.svg" alt="sygps-logo" class="chat-bot-logo">
    <bookmark-select></bookmark-select>
    <div class="system-bot-block">
      <ChatBotbtn class="system-bot" />
      <div class="system-bot-msg">廠長您好，有什麼特別需要關注的資訊嗎？</div>
    </div>
    <div class="user-input-block">
      <div class="user-question-block">
        <textarea name="question" class="question-input"
          rows="1"
          ref="questionInput"
          @input="textareaResize"
          v-model="userQuestion"
        ></textarea>
        <img src="@/assets/images/input.svg" class="question-input-img" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import ChatBotbtn from './ChatBotBtn'
import BookmarkSelect from '@/components/select/BookmarkSelect'

export default {
  name: 'ChatRoomBlock',
  components: {
    BookmarkSelect,
    ChatBotbtn
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
    }
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-room-block {
  position: relative;
  flex: initial;
  width: $chat-room-width;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow: auto;
  padding: 36px 32px 32px;
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

  .chat-bot-logo {
    margin-bottom: 8px;
  }

  .system-bot-block {
    position: absolute;
    top: 40%;
    left: 0;
    right: 0;
    margin: auto;
    padding: 0 40px;

    .system-bot {
      margin-bottom: 32px;
    }

    .system-bot-msg {
      font-size: 24px;
      line-height: 44px;
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
