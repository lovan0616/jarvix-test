<template>
  <div class="bookmark-select-block">
    <svg-icon icon-class="folder" class="bookmark-select-icon"></svg-icon>
    <sy-select class="bookmark-select"
      :selected="bookmarkId"
      :items="buildBookmarkList"
      placeholder="请选择bookmark"
      @update:selected="onBookmarkChange"
    ></sy-select>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SySelect from '@/components/select/SySelect'
export default {
  name: 'BookmarkSelect',
  components: {
    SySelect
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks']),
    // 過濾掉正在 build 的 bookmark
    buildBookmarkList () {
      return this.bookmarks.filter(bookmark => {
        return !bookmark.build_status
      })
    }
  },
  methods: {
    onBookmarkChange (bookmarkId) {
      this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId)
    }
  }
}
</script>
<style lang="scss" scoped>
.bookmark-select-block {
  width: 25%;
  position: relative;

  .bookmark-select-icon {
    position: absolute;
    top: 12px;
    left: 0px;
  }

  .bookmark-select {
    width: 100%;
  }
}
</style>
<style lang="scss">
.bookmark-select.sy-select.theme-default {
  .el-input__inner {
    padding-left: 30px;
  }
}
</style>
