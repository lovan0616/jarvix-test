<template>
  <div class="conversation-container"
    :class="{'default-position': showBotIndefaultPosition}"
  >
    <div class="conversation-list"
      v-if="!showBotIndefaultPosition"
    >
      <single-chat-block
        v-for="(conversation, index) in conversationList"
        :key="index"
        :content="conversation"
      ></single-chat-block>
      <chat-spinner
        v-if="isAnalyzing"
      ></chat-spinner>
    </div>
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
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;

  &.default-position {
    align-items: center;
  }

  .conversation-list {
    flex: 1;
    overflow: auto;
    padding-bottom: 30vh;
    display: flex;
    flex-direction: column;
  }

  .system-bot-block {
    margin: auto;
    transition: all 0.3s;

    &.default-position {

      .system-bot {
        width: 100px;
        height: 100px;
      }
    }

    .system-bot {
      width: 70px;
      height: 70px;
      margin-bottom: 8px;
    }
  }
}
</style>
