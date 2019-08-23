<template>
  <div class="empty-result">
    <div class="empty-result-title">没有相关资料</div>
    <div class="empty-result-sub-title">您所输入的问题，无法找到相关联的数据进行分析，请重新输入语句搜寻，或使用系统建议语句</div>
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
