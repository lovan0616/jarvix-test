<template>
  <div class="page-preview-bookmark">
    <div class="title">{{$t('resultDescription.dataSourceIntro')}}</div>
    <div class="result-board"
      v-show="dataSourceId"
    >
      <div
        v-if="dataSourceTables.length > 0"
        class="board-header"
      >
        <el-tabs
          :value="`${dataSourcetableId}`"
          type="card"
          @tab-click="onDataSourceTableChange"
        >
          <el-tab-pane
            v-for="(tab, index) in dataSourceTables"
            :key="index + tab.name"
            :label="tab.name"
            :name="`${tab.id}`"
          >
            <el-tooltip
              slot="label"
              :content="tab.name">
              <span>{{tab.name}}</span>
            </el-tooltip>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="board-body">
        <spinner
          v-if="isLoading"
        ></spinner>
        <empty-info-block
          v-else-if="hasError || dataSourceTables.length === 0"
          :msg="hasError ? $t('message.systemIsError') : $t('message.noData')"
        ></empty-info-block>
        <pagination-table
          v-else
          :is-processing="isProcessing"
          :dataset="dataSourceTableData"
          :pagination-info="pagination"
          @change-page="updatePage"
        ></pagination-table>
      </div>
    </div>
    <span v-show="!dataSourceId">{{ $t('message.emptyDataSource') }}</span>
  </div>
</template>
<script>
import SySelect from '../components/select/SySelect'
import EmptyInfoBlock from './EmptyInfoBlock'
import PaginationTable from '@/components/table/PaginationTable'

export default {
  name: 'PreviewDataSource',
  components: {
    SySelect,
    EmptyInfoBlock,
    PaginationTable
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      hasError: false,
      dataSourceTables: [],
      dataSourceTable: null,
      dataSourceTableData: null,
      pagination: {
        currentPage: 0,
        totalPage: 0
      }
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
          this.dataSourceTables = response.filter(element => {
            return element.state !== 'Process'
          }).map(element => {
            return {
              id: element.id,
              name: element.primaryAlias
            }
          })
          if (this.dataSourceTables.length) {
            this.dataSourceTable = response[0]
            this.fetchDataFrameData(this.dataSourceTable.id, 0, true)
          } else {
            this.isLoading = false
          }
        })
        .catch(() => {
          this.hasError = true
          this.isLoading = false
        })
    },
    setDataSourceTableById (id) {
      this.dataSourceTable = this.dataSourceTables.find(item => item.id === id)
    },
    onDataSourceTableChange (tab) {
      const id = parseInt(tab.name)
      if (this.dataSourceTable.id === id) { return }
      this.isLoading = true
      this.hasError = false
      this.setDataSourceTableById(id)
      this.fetchDataFrameData(id, 0, true)
    },
    fetchDataFrameData (id, page = 0, resetPagination = false) {
      this.isProcessing = true
      this.$store.dispatch('dataSource/getDataFrameData', {id, page})
        .then(response => {
          if (resetPagination) {
            this.pagination = response.pagination
          }
          this.dataSourceTableData = {
            columns: response.columns,
            data: response.data,
            index: [...Array(response.data.length)].map((x, i) => i)
          }
          this.isLoading = false
          this.isProcessing = false
        })
        .catch(() => {
          this.hasError = true
          this.isLoading = false
          this.isProcessing = false
        })
    },
    updatePage (page) {
      this.fetchDataFrameData(this.dataSourceTable.id, page - 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.page-preview-bookmark {
  .title {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 24px;
  }

  .dataset-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}

.result-board {
  .board-header {
    border-top: unset;
    padding-bottom: 0;
  }
}

/deep/ .el-tabs {
  width: 100%;
  &>.el-tabs__header {
    border: none;
    margin: 0;
    width: 100%;

    .el-tabs__nav {
      width: 100%;
      border: none;
      overflow-x: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .el-tabs__item {
      border: none;
      color:  #AAAAAA;
      border-bottom: 3px solid #324B4E;
      text-align: center;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: top;
      &.is-active {
        color: #fff;
        background: linear-gradient(360deg, #324B4E 0%, rgba(50, 75, 78, 0) 100%);
        border-bottom: 3px solid $theme-color-primary;
      }
    }
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
