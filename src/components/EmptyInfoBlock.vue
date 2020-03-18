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
      default () {
        return this.$t('resultDescription.noData')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.empty-info-block {
  padding: 24px 0;
  background-color: rgba(29, 30, 30, 0.95);
  border-radius: 5px;
  text-align: center;
  color: #AAAAAA;
}
</style>
