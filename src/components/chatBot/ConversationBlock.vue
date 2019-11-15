<template>
  <div class="conversation-container">
    <single-chat-block
      v-for="(conversation, index) in conversationList"
      :key="index"
      :content="conversation"
    ></single-chat-block>
    <div class="spinner-container"
      v-if="isAnalyzing"
    >
      <chat-spinner></chat-spinner>
    </div>
  </div>
</template>
<script>
import ChatBotBtn from './ChatBotBtn'
import SingleChatBlock from './SingleChatBlock'
import ChatSpinner from './ChatSpinner'
export default {
  name: 'ConversationBlock',
  components: {
    ChatSpinner,
    SingleChatBlock,
    ChatBotBtn
  },
  computed: {
    conversationList () {
      return this.$store.state.chatBot.conversationList
    },
    isAnalyzing () {
      return this.$store.state.chatBot.isAnalyzing
    }
  }
}
</script>
<style lang="scss" scoped>
.conversation-container {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0 32px;

  .system-bot-block {
    margin: auto;
    transition: all 0.3s;

    .system-bot {
      width: 70px;
      height: 70px;
      margin-bottom: 8px;
    }
  }

  .spinner-container {
    text-align: center;
  }
}
</style>
