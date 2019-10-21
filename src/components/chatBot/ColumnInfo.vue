<template>
  <div class="column-info-block">
    <div class="category-title">{{ $t('askHelper.columnTitle') }}</div>
    <div class="column-table">
      <div class="column-list">
        <div class="single-column column-title">{{ $t('askHelper.categoryTitle') }}</div>
        <div class="single-column"
          v-for="(columnInfo, index) in bookmarkCloumnInfoList.category"
          :key="'category' + index"
        >{{ columnInfo.name }}</div>
      </div>
      <div class="column-list">
        <div class="single-column column-title">{{ $t('askHelper.numericTitle') }}</div>
        <div class="single-column"
          v-for="(columnInfo, index) in bookmarkCloumnInfoList.numeric"
          :key="'numeric' + index"
        >{{ columnInfo.name }}</div>
      </div>
    </div>
    <div class="category-title">{{ $t('askHelper.datavalueTitle') }}</div>
    <div class="category-list">
      <div class="single-column"
        v-for="(columnInfo, index) in bookmarkCloumnInfoList.datavalue"
        :key="'datavalue' + index"
      >{{ columnInfo.name }}</div>
    </div>
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
  .category-title {
    margin-bottom: 8px;
  }

  .column-table {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .column-title {
      font-weight: bold;
    }

    .column-list {
      width: 46%;
    }
  }
  .category-list {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
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
