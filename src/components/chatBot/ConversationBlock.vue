<template>
  <div class="conversation-container">
    <single-chat-block
      v-if="!showBotIndefaultPosition"
      v-for="(conversation, index) in conversationList"
      :key="index"
      :content="conversation"
    ></single-chat-block>
    <chat-spinner
      v-if="isAnalyzing"
    ></chat-spinner>
    <div class="system-bot-block"
      :class="{'default-position': showBotIndefaultPosition}"
    >
      <ChatBotbtn class="system-bot" />
      <single-chat-block
        v-if="showBotIndefaultPosition"
        :content="conversationList[0]"
        isDefault
      ></single-chat-block>
    </div>
  </div>
</template>
<script>
import ChatBotbtn from './ChatBotBtn'
import SingleChatBlock from './SingleChatBlock'
import ChatSpinner from './ChatSpinner'
export default {
  name: 'ConversationBlock',
  components: {
    ChatSpinner,
    SingleChatBlock,
    ChatBotbtn
  },
  computed: {
    conversationList () {
      return this.$store.state.chatBot.conversationList
    },
    isAnalyzing () {
      return this.$store.state.chatBot.isAnalyzing
    },
    showBotIndefaultPosition () {
      return this.conversationList.length === 1 && this.conversationList[0].type === 'System'
    }
  }
}
</script>
<style lang="scss" scoped>
.conversation-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 58vh;
  padding-bottom: 30vh;

  .system-bot-block {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 120px;
    margin: auto;
    padding: 0 40px;
    transition: all 0.3s;

    &.default-position {
      bottom: 150px;

      .system-bot {
        width: 100px;
        height: 100px;
      }
    }

    .system-bot {
      width: 70px;
      height: 70px;
      margin-bottom: 16px;
    }
  }
}
</style>
