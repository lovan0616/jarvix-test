<template>
  <div class="empty-result">
    <div class="empty-result-title">此問題沒有對應結果</div>
    <div class="empty-result-sub-title">請重新問問題</div>
  </div>
</template>
<script>
export default {
  name: 'EmptyResult'
}
</script>
<style lang="scss" scoped>
.empty-result {
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  border: 1px solid #eaeaea;
  padding: 64px;

  .empty-result-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
  }
}
</style>
