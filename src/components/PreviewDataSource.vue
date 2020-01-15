<template>
  <div class="page-preview-bookmark">
    <div class="result-board"
      v-show="dataSourceId"
    >
      <div class="board-header">
        <result-board-header
          :title="$t('resultDescription.dataSourceIntro')"
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
        <spinner
          v-if="isLoading"
        ></spinner>
        <empty-info-block
          v-else-if="hasError"
          :msg="$t('message.systemIsError')"
        ></empty-info-block>
        <sy-table
          v-else
          :dataset="bookmarkTableDataDataset"
        ></sy-table>
      </div>
    </div>
    <span v-show="!dataSourceId">bookmark no set yet</span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SySelect from '../components/select/SySelect'
import EmptyInfoBlock from './EmptyInfoBlock'

export default {
  name: 'PreviewDataSource',
  components: {
    SySelect,
    EmptyInfoBlock
  },
  data () {
    return {
      isLoading: false,
      hasError: false
    }
  },
  mounted () {
    this.isLoading = true
    this.$store.dispatch('previewBookmark/init')
      .then(() => {
        this.isLoading = false
      })
      .catch(() => {
        this.hasError = true
        this.isLoading = false
      })
  },
  destroyed () {
    this.$store.commit('previewBookmark/SET_BOOKMARK_TABLE', [])
  },
  computed: {
    ...mapGetters('previewBookmark', ['bookmarkTableId', 'bookmarkTables', 'bookmarkTableDataMeta', 'bookmarkTableDataDataset']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
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
      this.isLoading = true
      this.hasError = false
      this.$store.dispatch('previewBookmark/changeBookmarkTableById', id)
        .then(() => {
          this.isLoading = false
        })
        .catch(() => {
          this.hasError = true
          this.isLoading = false
        })
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
