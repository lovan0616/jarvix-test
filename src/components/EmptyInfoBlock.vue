<template>
  <div class="empty-info-block">
    {{ msg }}
  </div>
</template>
<script>
import i18n from '@/lang/index.js'
export default {
  name: 'EmptyInfoBlock',
  props: {
    msg: {
      type: String,
      default: i18n.t('resultDescription.noData')
    }
  }
}
</script>
<style lang="scss" scoped>
.empty-info-block {
  padding: 24px 0;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.55);
  text-align: center;
  color: #CCCCCC;
}
</style>
