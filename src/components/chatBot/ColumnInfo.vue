<template>
  <div class="column-info-block">
    <div class="single-column"
      v-for="(columnInfo, index) in bookmarkCloumnInfoList"
      :key="index"
    >{{ columnInfo.name }}</div>
  </div>
</template>
<script>
export default {
  name: 'ColumnInfo',
  computed: {
    bookmarkCloumnInfoList () {
      return this.$store.state.bookmark.bookmarkCloumnInfoList
    }
  }
}
</script>
<style lang="scss" scoped>
.column-info-block {
  .single-column {
    font-size: 14px;
    line-height: 32px;
    padding: 4px 16px;

    &:nth-child(odd) {
      background-color: rgba(50, 75, 78, 0.6);
    }
  }
}
</style>
