<template>
  <div class="bot-btn">
    <img class="bot-img" :src="filePath" alt="">
  </div>
</template>
<script>
export default {
  name: 'ChatBotBtn',
  computed: {
    isAnalyzing () {
      return this.$store.state.chatBot.isAnalyzing
    },
    filePath () {
      return this.isAnalyzing ? require('@/assets/images/bot-speak.gif') : require('@/assets/images/bot.gif')
    }
  }
}
</script>
<style lang="scss" scoped>
.bot-btn {
  .bot-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}
</style>
