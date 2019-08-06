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
  width: 100px;
  height: 100px;
  margin: 0 auto;

  .bot-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
