<template>
  <div class="empty-result">
    <div class="empty-result-title">沒有相關資料</div>
    <div class="empty-result-sub-title">您所輸入的問題，無法找到相關聯的數據進行分析，請重新輸入語句搜尋，或使用下列系統建議語句</div>
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
