<template>
  <div class="page-preview-bookmark">
    <span v-show="bookmark">
      <quick-starts
        :items="quickstartWithoutDefaults"
        @clickItem="app_setAndEnterQuestion"
      >
      </quick-starts>
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
            :data="bookmarkTableDataDataset"
          ></sy-meta-table>
        </div>
      </container-card>
    </span>
    <span v-show="!bookmark">bookmark no set yet</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import appHandleQuestion from '../mixins/app-handle-question.js'
import QuickStarts from '../components/QuickStarts'
import SySelect from '../components/sy/SySelect'
import SyMetaTable from '../components/sy/SyMetaTable'

export default {
  name: 'PagePreviewBookmark',
  mixins: [
    appHandleQuestion
  ],
  components: {
    SySelect,
    QuickStarts,
    SyMetaTable
  },
  created () {
    this.$store.dispatch('previewBookmark/init')
      .catch(err => err)
  },
  computed: {
    ...mapGetters('bookmark', ['bookmark', 'quickstartWithoutDefaults']),
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
