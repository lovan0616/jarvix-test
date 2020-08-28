<template>
  <div class="empty-result">
    <div class="empty-result-title">{{ resultInfo && resultInfo.title ? resultInfo.title : this.$t('editing.emptyResult') }}</div>
    <div class="empty-result-sub-title">{{ resultInfo && resultInfo.description ? resultInfo.description : this.$t('editing.emptyResultDescription') }}</div>
    <div 
      v-if="resultInfo && resultInfo.unknown && resultInfo.unknown.length > 0"
      class="empty-result-unknown-detail"
    >{{ $t('editing.systemUnknownDescription') }}
      <span
        v-for="(unknownText, index) in resultInfo.unknown"
        :key="index"
      >{{ unknownText }}<span v-show="index !== resultInfo.unknown.length - 1">、</span></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EmptyResult',
  props: {
    resultInfo: {
      type: Object,
      default: () => {
        return { 
          title: null,
          description: null,
          unknown: null
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.empty-result {
  text-align: center;
  margin-top: 128px;

  .empty-result-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  .empty-result-sub-title {
    margin-bottom: 16px;
  }
}
</style>
