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
  background-color: rgba(35, 61, 64, 0.6);
  border: 1px solid #05282C;
  color: #ccc;
  text-align: center;
}
</style>
