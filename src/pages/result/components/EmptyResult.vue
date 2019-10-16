<template>
  <div class="empty-result">
    <div class="empty-result-title">{{ title }}</div>
    <div class="empty-result-sub-title">{{ description }}</div>
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
    title: {
      type: String,
      default () {
        return this.$t('editing.emptyResult')
      }
    },
    description: {
      type: String,
      default () {
        return this.$t('editing.emptyResultDescription')
      }
    }
  },
  components: {
    QuickStarts
  },
  computed: {
    ...mapGetters('bookmark', ['quickstartWithoutDefaults'])
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
