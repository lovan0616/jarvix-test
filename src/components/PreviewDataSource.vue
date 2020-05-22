<template>
  <div class="page-preview-bookmark">
    <template v-if="dataSourceId">
      <div class="bookmark-header">{{$t('resultDescription.dataSourceIntro')}}</div>
      <div class="result-board">
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
            v-else-if="!isLoading && (hasError || dataSourceTables.length === 0)"
            :msg="hasError ? $t('message.systemIsError') : $t('message.noData')"
          ></empty-info-block>
          <template v-else>
            <div class="board-body-section">
              <div class="title">{{ $t('editing.dataFrameContent') }}</div>
              <div class="overview">
                <div class="overview__data">
                  <div class="overview__item">
                    {{ $t('resultDescription.totalDataRows') + ': ' + dataFrameOverviewData.totalRows }}
                  </div>
                  <div class="overview__item">
                    {{ $t('resultDescription.totalDataColumns') + ': ' + dataFrameOverviewData.totalColumns }}
                  </div>
                </div>
              </div>
              <pagination-table
                :is-processing="isProcessing"
                :dataset="dataSourceTableData"
                :pagination-info="pagination"
                :min-column-width="'270px'"
                @change-page="updatePage"
              >
                <template v-slot="{ column, index }">
                  <div class="header-block">
                    <div class="header">
                      <span class="tooltip-container icon">
                        <svg-icon :icon-class="getHeaderIcon(index)" />
                        <div class="tooltip">{{ getStatesTypeName(index)}}</div>
                      </span>
                      <span class="text">
                        <el-tooltip
                          :enterable="false"
                          slot="label"
                          :content="`${column.titles[index]}`">
                          <span>{{column.titles[index]}}</span>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="summary">
                      <data-column-summary
                        :summary-data="tableSummaryList[index]"
                      />
                    </div>
                  </div>
                </template>
              </pagination-table>
            </div>
            <!--欄位關聯概況-->
            <column-correlation-overview
              class="board-body-section"
              :data-frame-id="dataSourceTable.id"
            />
          </template>
        </div>
      </div>
    </template>
    <span v-else>{{ $t('message.emptyDataSource') }}</span>
  </div>
</template>
<script>
import SySelect from '../components/select/SySelect'
import EmptyInfoBlock from './EmptyInfoBlock'
import PaginationTable from '@/components/table/PaginationTable'
import DataColumnSummary from '@/pages/datasourceDashboard/components/DataColumnSummary'
import ColumnCorrelationOverview from '@/pages/datasourceDashboard/components/ColumnCorrelationOverview'

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
      dataSourceTableData: {},
      pagination: {
        currentPage: 0,
        totalPage: 0
      },
      dataFrameOverviewData: {
        totalRows: '-',
        totalColumns: '-'
      },
      tableSummaryList: []
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
            this.dataFrameOverviewData = {
              totalRows: dataFrameData.pagination.totalItems,
              totalColumns: dataFrameData.columns.length
            }
            this.tableSummaryList = dataColumnSummary.map(column => ({
              ...column.dataSummary,
              statsType: column.statsType,
              totalRows: dataFrameData.pagination.totalItems
            }))
          }
          this.dataSourceTableData = {
            columns: {
              titles: dataFrameData.columns
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
      if (!this.tableSummaryList[index]) return 'check-circle'
      const statesType = this.tableSummaryList[index].statsType
      switch (statesType) {
        case 'CATEGORY':
          return 'character-a'
        case 'NUMERIC':
          return 'numeric'
        case 'BOOLEAN':
          return 'checked'
        case 'DATETIME':
          return 'calendar'
        default:
          return 'check-circle'
      }
    },
    getStatesTypeName (index) {
      if (!this.tableSummaryList[index]) return ''
      const statesType = this.tableSummaryList[index].statsType
      switch (statesType) {
        case 'CATEGORY':
          return `${this.$t('dataType.category')}${this.$t('askHelper.column')}`
        case 'NUMERIC':
          return `${this.$t('dataType.numeric')}${this.$t('askHelper.column')}`
        case 'BOOLEAN':
          return `${this.$t('dataType.boolean')}${this.$t('askHelper.column')}`
        case 'DATETIME':
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
  .bookmark-header {
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
    .title {
      margin-bottom: 13px;
      font-size: 20px;
      font-weight: 600;
    }

    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }

  .header-block {
    height: 325px;

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

  .overview {
    margin-bottom: 10px;
    font-size: 14px;

    &__data {
      display: flex;
    }

    &__item {
      margin-right: 45px;
    }
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
