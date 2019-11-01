<template>
  <div class="page-preview-bookmark">
    <div class="result-board"
      v-show="bookmarkId"
    >
      <div class="board-header">
        <result-board-header
          :question="$t('resultDescription.dataSourceIntro')"
        ></result-board-header>
      </div>
      <div class="board-body">
        <div class="dataset-info">
          <sy-select class="preview-bookmark-select"
            :selected="bookmarkTableId"
            :items="bookmarkTables"
            :placeholder="$t('editing.choiceDataSource')"
            @update:selected="onBookmarkTableChange"
          ></sy-select>
          <div class="data-count">{{ metaTableRightText }}</div>
        </div>
        <sy-table
          :dataset="bookmarkTableDataDataset"
        ></sy-table>
      </div>
    </div>
    <span v-show="!bookmarkId">bookmark no set yet</span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SySelect from '../components/select/SySelect'

export default {
  name: 'PagePreviewBookmark',
  components: {
    SySelect
  },
  created () {
    this.$store.dispatch('previewBookmark/init')
      .catch(err => err)
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId']),
    ...mapGetters('previewBookmark', ['bookmarkTableId', 'bookmarkTables', 'bookmarkTableDataMeta', 'bookmarkTableDataDataset']),
    metaTableRightText () {
      if (!this.bookmarkTableDataMeta) return ''
      const rowNum = this.bookmarkTableDataMeta.rows_num || '' + ''
      const colNum = this.bookmarkTableDataMeta.columns_num || '' + ''
      let result = ''
      if (rowNum && colNum) result = `${rowNum} rows x ${colNum} columns`
      else {
        if (rowNum) result = `${rowNum} rows`
        if (colNum) result = `${colNum} columns`
      }
      return result
    }
  },
  methods: {
    onBookmarkTableChange (id) {
      this.$store.dispatch('previewBookmark/changeBookmarkTableById', id)
        .catch(err => err)
    }
  }
}
</script>
<style lang="scss" scoped>
.page-preview-bookmark {
  .dataset-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}
</style>
<style lang="scss">
.preview-bookmark-select.sy-select.theme-default {
  border-bottom: 1px solid #fff;

  .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
}
</style>