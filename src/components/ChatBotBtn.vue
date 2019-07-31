<template>
  <div class="bot-btn">
    <img class="bot-img" src="@/assets/images/bot.gif" alt="">
  </div>
</template>
<script>
export default {
  name: 'ChatBotBtn'
}
</script>
<style lang="scss" scoped>
.bot-btn {
  cursor: pointer;

  .bot-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
}
</style>
