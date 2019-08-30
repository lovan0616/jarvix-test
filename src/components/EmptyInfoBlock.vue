<template>
  <div class="empty-info-block">
    {{ msg }}
  </div>
</template>
<script>
export default {
  name: 'EmptyInfoBlock',
  props: {
    msg: {
      type: String,
      default: '暂无资料'
    }
  }
}
</script>
<style lang="scss" scoped>
.empty-info-block {
  padding: 24px 0;
  border-radius: 4px;
  background-color: $theme-bg-lighter-color;
  text-align: center;
}
</style>
