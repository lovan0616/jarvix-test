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
            :selected="dataSourcetableId"
            :items="dataSourceTables"
            :placeholder="$t('editing.choiceDataSource')"
            @update:selected="onDataSourceTableChange"
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
          :dataset="dataSourceTableData"
        ></sy-table>
      </div>
    </div>
    <span v-show="!dataSourceId">{{ $t('message.emptyDataSource') }}</span>
  </div>
</template>
<script>
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
      hasError: false,
      dataSourceTables: [],
      dataSourceTable: null,
      dataSourceTableData: null
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchDataSourceTable()
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataSourcetableId () {
      return this.dataSourceTable ? this.dataSourceTable.id : null
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
    fetchDataSourceTable () {
      this.$store.dispatch('dataSource/getDataSourceTables')
        .then(response => {
          this.dataSourceTables = response.map(element => {
            return {
              id: element.id,
              name: element.primaryAlias
            }
          })
          this.dataSourceTable = response[0]
          this.fetchDataFrameData(this.dataSourceTable.id)
        })
        .catch(() => {
          this.hasError = true
          this.isLoading = false
        })
    },
    setDataSourceTableById (id) {
      this.dataSourceTable = this.dataSourceTables.find(item => item.id === id)
    },
    onDataSourceTableChange (id) {
      this.isLoading = true
      this.hasError = false
      this.setDataSourceTableById(id)
      this.fetchDataFrameData(id)
    },
    fetchDataFrameData (id) {
      this.$store.dispatch('dataSource/getDataFrameData', id)
        .then(response => {
          this.dataSourceTableData = {
            ...response,
            index: [...Array(response.data.length)].map((x, i) => i)
          }
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
