<template>
  <div class="column-info-block">
    <div class="single-column"
      v-for="(columnInfo, index) in cloumnInfoList"
      :key="index"
    >{{ columnInfo.name }}</div>
  </div>
</template>
<script>
import { getBookmarkColumn } from '@/API/Bookmark'

export default {
  name: 'ColumnInfo',
  data () {
    return {
      cloumnInfoList: []
    }
  },
  methods: {
    fetchData () {
      getBookmarkColumn(this.bookmarkId).then(response => {
        this.cloumnInfoList = response
      })
    }
  },
  computed: {
    bookmarkId () {
      return this.$store.state.bookmark.bookmarkId
    }
  },
  watch: {
    bookmarkId () {
      this.fetchData()
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