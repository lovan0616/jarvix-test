<template>
  <div class="empty-pinboard">
    <div class="empty-pinboard__text">{{ $t('pinboard.emptyInfo', {name: question}) }}</div>
  </div>
</template>
<script>
export default {
  name: 'EmptyPinboard',
  props: {
    question: {
      type: String,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
.empty-pinboard {
  background-color: rgba(0, 0, 0, .35);
  border-radius: 8px;
  margin-bottom: 48px;
  padding: 32px;
  text-align: center;
}
</style>
