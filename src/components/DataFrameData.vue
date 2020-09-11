<template>
  <div class="data-frame-data">
    <spinner v-if="isLoading"/>
    <empty-info-block
      v-else-if="!isLoading && hasError"
      :msg="$t('message.systemIsError')"
    />
    <div 
      v-else
      class="board-body-section"
    >
      <div class="title">{{ $t('editing.dataFrameContent') }}</div>
      <template v-if="dataSourceTableData && dataSourceTableData.columns.titles.length > 0">
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
          v-if="dataSourceTableData && dataSourceTableData.columns.titles.length > 0"
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
                <span 
                  v-if="showColumnSummaryRow"
                  class="icon"
                >
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
      </template>
      <empty-info-block
        v-else
        :msg="$t('message.noData')"
      />
    </div>
    <!--欄位關聯概況-->
    <column-correlation-overview
      v-if="showCorrelationMatrix"
      :data-frame-id="dataFrameId"
      :mode="mode"
      class="board-body-section"
    />
  </div>
</template>
<script>
import ColumnCorrelationOverview from '@/pages/datasourceDashboard/components/ColumnCorrelationOverview'
import PaginationTable from '@/components/table/PaginationTable'
import DataColumnSummary from '@/pages/datasourceDashboard/components/DataColumnSummary'
import EmptyInfoBlock from './EmptyInfoBlock'
import { mapGetters } from 'vuex'

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
    },
    mode: {
      type: String,
      required: true
    },
    showCorrelationMatrix: {
      type: Boolean,
      default: true
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
  computed: {
    ...mapGetters('dataFrameAdvanceSetting', ['askCondition']),
  },
  watch: {
    dataFrameId (value) {
      this.isLoading = true
      this.fetchDataFrameData(value, 0, true)
    },
    askCondition: {
      deep: true,
      handler (newValue, oldValue) {
        if (
          this.mode === 'popup' 
          // 初次開啟設定時不觸發
          || (oldValue.isInit === false && oldValue.columnList === null) 
          // 切換 dataframe 清空設定時不觸發
          || newValue.isInit === false
        ) return
        this.fetchDataFrameData(this.dataFrameId, 0, true)
      }
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchDataFrameData(this.dataFrameId, 0, true)
  },
  methods: {
    fetchDataFrameData (id, page = 0, resetPagination = false) {
      this.isProcessing = true
      if (resetPagination) {
        this.dataSourceTableData = null
        this.isLoading = true
      }
      this.$store.dispatch('dataSource/getDataFrameIntro', { id, page, mode: this.mode })
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
        .catch(error => {
          if (error.message === 'cancel') return
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
.data-frame-data {
  .empty-info-block {
    margin-bottom: 2rem;
  }

  .board-body-section {
    .title {
      position: relative;
      margin-bottom: 16px;
      margin-left: 16px;
      font-size: 20px;
      font-weight: 600;
      &::before {
        position: absolute;
        top: 50%;
        left: -12px;
        transform: translateY(-50%);
        content: '';
        display: inline-block;
        width: 6.44px;
        height: 6px;
        background: #2AD2E2;
      }
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

.overview {
  margin-bottom: 17px;
  font-size: 14px;
  color: #CCCCCC;

  &__data {
    display: flex;
  }

  &__item {
    margin-right: 45px;
  }
}
</style>
