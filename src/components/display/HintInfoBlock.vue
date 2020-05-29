<template>
  <div
    :class="{'hint-info--inline': inline}"
    class="hint-info"
  >
    <span class="hint-info__title"><svg-icon icon-class="lamp"/> {{ $t('resultDescription.prompt') }}:</span> {{ msg }}
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String,
      default: null
    },
    inline: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.hint-info {
  background-color: rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  padding: 11px;
  font-size: 14px;
  line-height: 1;
  margin-bottom: 12px;

  &--inline {
    display: inline-block;
  }

  &__title {
    color: #FFDF6F;
  }
}
</style>
