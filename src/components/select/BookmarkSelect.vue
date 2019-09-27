<template>
  <div class="bookmark-select-block">
    <svg-icon icon-class="folder" class="bookmark-select-icon"></svg-icon>
    <sy-select class="bookmark-select"
      :selected="bookmarkId"
      :items="buildBookmarkList"
      :placeholder="$t('editing.choiceDataSource')"
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
        .then(() => {
          this.$router.push('/')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.bookmark-select-block {
  display: inline-block;
  position: relative;
  background-color: $theme-bg-lighter-color;
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
