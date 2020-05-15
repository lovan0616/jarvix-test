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
            :placeholder="$t('editing.chooseDataFrame')"
            @update:selected="onDataSourceTableChange"
          ></sy-select>
          <div class="data-count">{{ metaTableRightText }}</div>
        </div>
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
          :columnWidth="'250px'"
          @change-page="updatePage"
        >
          <template v-slot="{ column, index }">
            <div class="header-block">
              <div class="header">
                <!--TODO: 根據資料類型顯示相對應 icon-->
                <svg-icon class="icon"
                  icon-class="check-circle"
                ></svg-icon>
                {{column.titles[index]}}
              </div>
              <div class="summary">
                <data-column-summary
                  :summary-data="dataSourceTableData.columns.summary[index]"
                />
              </div>
            </div>
          </template>
        </pagination-table>
      </div>
    </div>
    <span v-show="!dataSourceId">{{ $t('message.emptyDataSource') }}</span>
  </div>
</template>
<script>
import SySelect from '../components/select/SySelect'
import EmptyInfoBlock from './EmptyInfoBlock'
import PaginationTable from '@/components/table/PaginationTable'
import DataColumnSummary from '@/pages/datasourceDashboard/components/DataColumnSummary'

const dummySummaryData = [
  {
    diagram: 'list',
    data: {
      dataType: 'Boolean',
      data: [
        {
          name: 'true',
          value: '39%'
        },
        {
          name: 'false',
          value: '39%'
        },
        {
          name: 'null',
          value: '22%'
        }
      ]
    }
  },
  {
    diagram: 'list',
    data: {
      dataType: 'Boolean',
      data: [
        {
          name: 'true',
          value: '40%'
        }
      ]
    }
  },
  {
    diagram: 'chart',
    data: {
      chartType: 'histogram',
      dataset: {
        data: [333, 5827, 3394, 2080, 1382, 589, 317, 299, 342, 335],
        range: [12, 343]
      },
      title: {
        xAxis: {
          name: 'age'
        },
        yAxis: {
          name: 'revenue'
        }
      }
    }
  }
]

export default {
  name: 'PreviewDataSource',
  components: {
    SySelect,
    EmptyInfoBlock,
    PaginationTable,
    DataColumnSummary
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
    onDataSourceTableChange (id) {
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
            columns: {
              titles: response.columns,
              summary: dummySummaryData
            },
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
  .dataset-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .header-block {
    height: 190px;

    .header {
      padding: 10px;
      border-bottom: 1px solid #515959;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .icon {
        margin-right: 6px;
      }
    }
    .summary {
      padding: 10px;
      overflow: auto;
      height: calc(100% - 44px);
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
