<template>
  <div class="hint-info">
    <span class="hint-info__title">{{ $t('resultDescription.prompt') }}:</span> {{ msg }}
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
.hint-info {
  display: inline-block;
  // background-color: rgba(0, 0, 0, 0.55);
  // border-radius: 5px;
  // padding: 8px;
  font-size: 12px;
  line-height: 1;
  margin-bottom: 8px;
  color: #bbb;
}
</style>
