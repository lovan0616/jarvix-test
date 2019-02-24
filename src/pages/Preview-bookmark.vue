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
            :data="bookmarkTableData && bookmarkTableData.dataset"
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
import QuickStarts from '../components/Quick-starts'
import SySelect from '../components/sy/Sy-select'
import SyMetaTable from '../components/sy/Sy-meta-table'

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
    ...mapGetters('previewBookmark', ['bookmarkTableId', 'bookmarkTables', 'bookmarkTableData']),
    metaTableRightText () {
      if (!this.bookmarkTableData || !this.bookmarkTableData.meta) return ''
      const rowNum = this.bookmarkTableData.meta.rows_num || '' + ''
      const colNum = this.bookmarkTableData.meta.columns_num || '' + ''
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
