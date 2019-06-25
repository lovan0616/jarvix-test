<template>
  <div class="page-preview-bookmark">
    <span v-show="bookmark">
      <h2>资料集介绍</h2>
      <container-card>
        <div class="preview-bookmark-card-inner">
          <sy-select class="preview-bookmark-select"
            :selected="bookmarkTableId"
            :items="bookmarkTables"
            placeholder="请选择bookmark"
            @update:selected="onBookmarkTableChange"
          ></sy-select>
          <sy-meta-table class="preview-bookmark-table"
            :rightText="metaTableRightText"
            :max-height="500"
            :dataset="bookmarkTableDataDataset"
          ></sy-meta-table>
        </div>
      </container-card>
    </span>
    <span v-show="!bookmark">bookmark no set yet</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SySelect from '../components/select/SySelect'
import SyMetaTable from '../components/table/SyMetaTable'

export default {
  name: 'PagePreviewBookmark',
  components: {
    SySelect,
    SyMetaTable
  },
  created () {
    this.$store.dispatch('previewBookmark/init')
      .catch(err => err)
  },
  computed: {
    ...mapGetters('bookmark', ['bookmark']),
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
  .preview-bookmark-select {
    margin-bottom: rem(20px);
  }

  .preview-bookmark-card-inner {
    padding: 6px 6px;

    @include response('sm') {
      padding: 10px 10px;
    }
  }
}
</style>
