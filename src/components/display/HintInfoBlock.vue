<template>
  <div
    :class="{'hint-info-block--inline': inline}"
    class="hint-info-block"
  >
    <div
      v-for="(msg, index) in msgList"
      :key="index"
      class="hint-info"
    >
      <span class="hint-info__title"><svg-icon icon-class="lamp"/> {{ $t('resultDescription.prompt') }}:</span> {{ msg }}
    </div>
  </div>
  
</template>
<script>
export default {
  props: {
    msgList: {
      type: Array,
      default: () => []
    },
    inline: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.hint-info-block {
  background-color: rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  padding: 11px;
  font-size: 14px;
  line-height: 1;
  margin-bottom: 12px;

  .hint-info {
    line-height: 1.5;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
    &__title {
      color: #FFDF6F;
    }
  }

  &--inline {
    display: inline-block;
  }
}
</style>
