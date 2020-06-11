<template>
  <div class="data-frame-data">
    <spinner
      v-if="isLoading"
    />
    <empty-info-block
      v-else-if="!isLoading && hasError"
      :msg="hasError ? $t('message.systemIsError') : $t('message.noData')"
    />
    <div 
      v-else
      class="board-body-section"
    >
      <div class="title">{{ $t('editing.dataFrameContent') }}</div>
      <div class="overview">
        <div class="overview__data">
          <div class="overview__item">
            {{ $t('resultDescription.totalDataRows') + ': ' + formatComma(dataFrameOverviewData.totalRows) }}
          </div>
          <div class="overview__item">
            {{ $t('resultDescription.totalDataColumns') + ': ' + formatComma(dataFrameOverviewData.totalColumns) }}
          </div>
        </div>
      </div>
      <pagination-table
        v-if="dataSourceTableData"
        :is-processing="isProcessing"
        :dataset="dataSourceTableData"
        :pagination-info="pagination"
        :min-column-width="'270px'"
        fixed-index
        @change-page="updatePage"
      >
        <template #columns-header="{ column, index }">
          <div class="header-block">
            <div class="header">
              <span class="icon">
                <el-tooltip
                  slot="label"
                  :enterable="false"
                  :visible-arrow="false"
                  :content="`${getStatesTypeName(index)}`"
                  class="icon">
                  <svg-icon :icon-class="getHeaderIcon(index)" />
                </el-tooltip>
              </span>
              <span class="text">
                <el-tooltip
                  slot="label"
                  :visible-arrow="false"
                  :enterable="false"
                  :content="`${column.titles[index]}`"
                  placement="bottom-start">
                  <span>{{ column.titles[index] }}</span>
                </el-tooltip>
              </span>
            </div>
            <div
              v-if="showColumnSummaryRow"
              class="summary"
            >
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
      :data-frame-id="dataFrameId"
      class="board-body-section"
    />
  </div>
</template>
<script>
import ColumnCorrelationOverview from '@/pages/datasourceDashboard/components/ColumnCorrelationOverview'
import PaginationTable from '@/components/table/PaginationTable'
import DataColumnSummary from '@/pages/datasourceDashboard/components/DataColumnSummary'
import EmptyInfoBlock from './EmptyInfoBlock'

export default {
  name: 'DataFrameData',
  components: {
    ColumnCorrelationOverview,
    PaginationTable,
    DataColumnSummary,
    EmptyInfoBlock
  },
  props: {
    dataFrameId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      hasError: false,
      dataSourceTableData: null,
      pagination: {
        currentPage: 0,
        totalPage: 0
      },
      dataFrameOverviewData: {
        totalRows: '-',
        totalColumns: '-'
      },
      showColumnSummaryRow: true,
      tableSummaryList: []
    }
  },
  watch: {
    dataFrameId (value) {
      this.isLoading = true
      this.fetchDataFrameData(value, 0, true)
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchDataFrameData(this.dataFrameId, 0, true)
  },
  methods: {
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
            this.showColumnSummaryRow = !dataColumnSummary.every(column => !column.dataSummary)
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
    updatePage (page) {
      this.fetchDataFrameData(this.dataFrameId, page - 1)
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
</style>
