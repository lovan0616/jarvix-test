<template>
  <div class="bookmark-select-block">
    <svg-icon icon-class="folder" class="bookmark-select-icon"></svg-icon>
    <sy-select class="bookmark-select"
      :selected="bookmarkId"
      :items="buildBookmarkList"
      placeholder="请选择bookmark"
      @update:selected="onBookmarkChange"
    >
    </sy-select>
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
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarkList']),
    // 過濾掉正在 build 的 bookmark
    buildBookmarkList () {
      return this.bookmarkList.filter(bookmark => {
        return bookmark.enable
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
  display: inline-block;
  position: relative;
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-radius: 4px;

  .bookmark-select-icon {
    position: absolute;
    top: 12px;
    left: 8px;
  }
}
</style>
<style lang="scss">
.bookmark-select.sy-select.theme-default {
  .el-input__inner {
    padding-left: 36px;
  }
}
</style>
