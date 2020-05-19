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
        <template v-else>
          <!--TODO: 上版前需設定 :min-column-width="'270px'"-->
          <pagination-table
            class="board-body-section"
            :is-processing="isProcessing"
            :dataset="dataSourceTableData"
            :pagination-info="pagination"
            @change-page="updatePage"
          >
            <!--TODO: 上版前需把註解移除-->
            <!-- <template v-slot="{ column, index }">
              <div class="header-block">
                <div class="header">
                  <span class="tooltip-container icon">
                    <svg-icon :icon-class="getHeaderIcon(index)" />
                    <div class="tooltip">{{ getDataTypeName(index)}}</div>
                  </span>
                  <span class="text">
                    {{column.titles[index]}}
                  </span>
                </div>
                <div class="summary">
                  <data-column-summary
                    :summary-data="dataSourceTableData.columns.summary[index]"
                  />
                </div>
              </div>
            </template> -->
          </pagination-table>
          <!--欄位關聯概況-->
          <!-- <column-correlation-overview
            class="board-body-section"
            :data-frame-id="dataSourceTable.id"
          /> -->
        </template>
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
import ColumnCorrelationOverview from '@/pages/datasourceDashboard/components/ColumnCorrelationOverview'

const dummySummaryData = [
  {
    dataType: 'boolean',
    data: [
      {
        diagram: 'list',
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
    ]
  },
  {
    dataType: 'boolean',
    data: [
      {
        diagram: 'list',
        data: [
          {
            name: 'true',
            value: '40%'
          }
        ]
      }
    ]
  },
  {
    dataType: 'numeric',
    data: [
      {
        diagram: 'chart',
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
      },
      {
        diagram: 'list',
        data: [
          {
            name: 'true',
            value: '40%'
          },
          {
            name: 'false',
            value: '60%'
          }
        ]
      }
    ]
  },
  {
    dataType: 'numeric',
    data: [
      {
        diagram: 'message',
        message: '資料量太大無法統計'
      }
    ]
  }
]

export default {
  name: 'PreviewDataSource',
  components: {
    SySelect,
    EmptyInfoBlock,
    PaginationTable,
    DataColumnSummary,
    ColumnCorrelationOverview
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
      this.$store.dispatch('dataSource/getDataFrameIntro', {id, page})
        .then(([dataFrameData, dataColumnSummary]) => {
          if (resetPagination) {
            this.pagination = dataFrameData.pagination
          }
          this.dataSourceTableData = {
            columns: {
              titles: dataFrameData.columns,
              summary: dataColumnSummary || dummySummaryData
            },
            data: dataFrameData.data,
            index: [...Array(dataFrameData.data.length)].map((x, i) => i)
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
    },
    getHeaderIcon (index) {
      if (!this.dataSourceTableData.columns.summary[index]) return 'check-circle'
      // const dataType = this.dataSourceTableData.columns.summary[index].dataType
      // TODO: 根據資料型態回覆正確的 icon
      return 'check-circle'
    },
    getDataTypeName (index) {
      if (!this.dataSourceTableData.columns.summary[index]) return ''
      const dataType = this.dataSourceTableData.columns.summary[index].dataType
      switch (dataType) {
        case 'category':
          return `${this.$t('dataType.category')}${this.$t('askHelper.column')}`
        case 'numeric':
          return `${this.$t('dataType.numeric')}${this.$t('askHelper.column')}`
        case 'boolean':
          return `${this.$t('dataType.boolean')}${this.$t('askHelper.column')}`
        case 'datetime':
          return `${this.$t('dataType.datetime')}${this.$t('askHelper.column')}`
        default:
          return `${this.$t('dataType.others')}${this.$t('askHelper.column')}`
      }
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

  .board-body-section {
    &:not(:last-child) {
      margin-bottom: 1.3rem;
    }
  }

  .header-block {
    height: 210px;

    .header {
      padding: 10px;
      border-bottom: 1px solid #515959;
      display: flex;

      .icon {
        width: 20px;
        margin-right: 5px;
        text-align: center;
      }

      .text {
        width: calc(100% - 25px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .summary {
      padding: 10px;
      overflow: auto;
      height: calc(100% - 44px);
    }
  }
}

.result-board {
  .board-header {
    border-top: unset;
    padding-bottom: 0;
  }
  .board-body {
    padding: 16px 24px;
  }
}

/deep/ .el-tabs {
  width: 100%;
  &>.el-tabs__header {
    border: none;
    margin: 0;
    width: 100%;

    .el-tabs__nav {
      position: relative;
      width: 100%;
      border: none;
      overflow-x: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 3px;
        background: #324B4E;
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
