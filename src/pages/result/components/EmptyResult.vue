<template>
  <div class="empty-result">
    <div class="empty-result-title">{{ displayTitle }}</div>
    <div class="empty-result-sub-title">{{ displayDescription }}</div>
    <quick-starts
      :items="quickstartWithoutDefaults"
    ></quick-starts>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import QuickStarts from '@/components/QuickStarts'
export default {
  name: 'EmptyResult',
  props: {
    title: {type: String, default: ''},
    description: {type: String, default: ''}
  },
  components: {
    QuickStarts
  },
  computed: {
    ...mapGetters('bookmark', ['quickstartWithoutDefaults']),
    displayTitle () {
      if (!this.title) {
        return this.$t('editing.emptyResult')
      }
      return this.title
    },
    displayDescription () {
      if (!this.description) {
        return this.$t('editing.emptyResultDescription')
      }
      return this.description
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
    margin-bottom: 64px;
  }
}
</style>
