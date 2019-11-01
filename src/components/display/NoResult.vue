<template>
  <div class="no-result-block">
    {{ displayMessage }}
  </div>
</template>
<script>
export default {
  name: 'NoResult',
  props: {
    message: { type: String, default: '' }
  },
  computed: {
    displayMessage () {
      if (!this.message) return this.$t('message.noResult')
      else return this.message
    }
  }
}
</script>
<style lang="scss" scoped>
.no-result-block {
  padding: 15px 20px;
  background-color: $theme-bg-color;
  color: #fff;
  text-align: center;
}
</style>
