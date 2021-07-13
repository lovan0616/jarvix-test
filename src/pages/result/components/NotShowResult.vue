<template>
  <div class="not-show-result">
    <div class="not-show-result-title">{{ this.$t('editing.notShowResultTitle') }}</div>
    <div class="empty-result-sub-title">{{ this.$t('editing.notShowResultDescription') }}</div>
  </div>
</template>

<script>
export default {
  name: 'NotShowResult',
}
</script>
<style lang="scss" scoped>
.not-show-result {
  text-align: center;
  margin-top: 128px;

  .not-show-result-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  .not-show-result-sub-title {
    margin-bottom: 16px;
  }
}
</style>
