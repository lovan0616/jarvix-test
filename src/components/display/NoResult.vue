<template>
  <div class="no-result-block">
    {{ $t('message.noResult') }}
  </div>
</template>
<script>
export default {
  name: 'NoResult'
}
</script>
<style lang="scss" scoped>
.no-result-block {
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0.35);
  color: #fff;
  text-align: center;
}
</style>
