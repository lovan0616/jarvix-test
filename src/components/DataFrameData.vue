<template>
  <div class="data-frame-data">
    <spinner v-if="isLoading" />
    <empty-info-block
      v-else-if="!isLoading && hasError"
      :msg="$t('message.systemIsError')"
    />
    <div
      v-else
      class="board-body-section"
    >
      <div class="title">
        {{ $t('editing.dataFrameContent') }}
      </div>
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
          <button
            class="btn-m btn-default"
            @click="toggleShowSummaryInfo"
          >
            {{ showDataSummary ? $t('common.hide') : $t('common.show') }}{{ $t('button.columnSummaryInfo') }}
          </button>
        </div>
        <pagination-table
          v-if="dataSourceTableData && dataSourceTableData.columns.titles.length > 0"
          :is-processing="isProcessing"
          :dataset="dataSourceTableData"
          :pagination-info="pagination"
          :min-column-width="'270px'"
          :fixed-index="fixedIndex"
          @change-page="updatePage"
          @on-sort="handleTableSort"
        >
          <template #columns-header="{ column, index }">
            <div class="header-block">
              <div class="header">
                <div
                  class="header__title"
                  @click.stop
                >
                  <span
                    v-if="showColumnSummaryRow"
                    class="icon"
                  >
                    <el-tooltip
                      slot="label"
                      :enterable="false"
                      :visible-arrow="false"
                      :content="`${getStatesTypeName(index)}`"
                      class="icon"
                    >
                      <svg-icon :icon-class="getHeaderIcon(index)" />
                    </el-tooltip>
                  </span>
                  <span
                    class="text"
                    @click="copyTitle(column.titles[index])"
                  >
                    <el-tooltip
                      slot="label"
                      :visible-arrow="false"
                      :enterable="false"
                      :content="$t('etl.clickColumnHeaderToCopy', { title: column.titles[index] })"
                      placement="bottom-start"
                    >
                      <span>{{ column.titles[index] }}</span>
                    </el-tooltip>
                  </span>
                </div>
                <svg-icon
                  icon-class="sort-down"
                  class="arrow-icon"
                  :class="{ 'arrow-up': isSortASC(index), 'active': isSortActive(index) }"
                />
              </div>
              <div
                v-show="showDataSummary"
                class="summary"
                @click.stop
              >
                <data-column-summary
                  v-if="showColumnSummaryRow"
                  :summary-data="tableSummaryList[index]"
                />
                <spinner
                  v-else
                  :title="$t('etl.dataCalculate')"
                  class="spinner-conatiner"
                  size="30"
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
      v-if="showCorrelationMatrix && hasPermission('correlation_matrix')"
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import { getDataFrameColumnInfoById } from '@/API/DataSource'

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
      tableSummaryList: [],
      timeoutFunction: null,
      showDataSummary: true,
      fixedIndex: true,
      sortOrders: null,
      columnIdList: []
    }
  },
  computed: {
    ...mapGetters('dataFrameAdvanceSetting', ['askCondition']),
    ...mapGetters('userManagement', ['hasPermission']),
    ...mapState('dataSource', ['shouldDataFrameDataRefetchDataColumn'])
  },
  watch: {
    dataFrameId (value) {
      this.isLoading = true
      this.fetchDataFrameData(value, 0, true)
      this.setColumnIdList(value)
    },
    askCondition: {
      deep: true,
      handler (newValue, oldValue) {
        if (
          this.mode === 'popup' ||
          // 初次開啟設定時不觸發
          (oldValue.isInit === false && oldValue.columnList === null) ||
          // 切換 dataframe 清空設定時不觸發
          newValue.isInit === false
        ) return
        this.fetchDataFrameData(this.dataFrameId, 0, true)
      }
    },
    shouldDataFrameDataRefetchDataColumn (value) {
      if (value) {
        // 不是呈現在使用者面前的那張表就不用重拿資料
        if (value !== this.dataFrameId) return
        this.isLoading = true
        this.fetchDataFrameData(this.dataFrameId, 0, true, false)
      }
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchDataFrameData(this.dataFrameId, 0, true)
    this.setColumnIdList(this.dataFrameId)
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    ...mapMutations('chatBot', ['setCopiedColumnName']),
    isSortActive (index) {
      if (!this.sortOrders) return false
      return this.columnIdList[index] === this.sortOrders.dataColumnId
    },
    isSortASC (index) {
      if (!this.sortOrders) return false
      return this.sortOrders.sortType === 'ASC' && this.columnIdList[index] === this.sortOrders.dataColumnId
    },
    toggleShowSummaryInfo () {
      this.fixedIndex = false
      this.showDataSummary = !this.showDataSummary
      // 為了第一欄的 index 高度，只好先解除 fixed 再重新綁上去
      this.$nextTick(() => {
        this.fixedIndex = true
      })
    },
    fetchDataFrameData (id, page = 0, resetPagination = false, isOnlyFetchSummary = false, sortOrders = null) {
      if (resetPagination) {
        this.isLoading = true
        this.dataSourceTableData = null
      }

      // 避免換頁中，輪詢取得 summary 資訊，因此仍需看前一個 process 結束與否
      this.isProcessing = this.isProcessing || !isOnlyFetchSummary
      if (isOnlyFetchSummary || resetPagination) window.clearTimeout(this.timeoutFunction)

      // 依照條件取得部分或全部的資料表資訊
      this.$store.dispatch('dataSource/getDataFrameIntro', { id, page, mode: this.mode, isOnlyFetchSummary, sortOrders })
        .then(res => {
          const watingTime = 10000

          // 如果只輪詢 summary, res 陣列中只會帶有取的 summary 的結果
          let dataFrameData = isOnlyFetchSummary ? null : res[0]
          let dataColumnSummary = isOnlyFetchSummary ? res[0] : res[1]

          // 只輪詢 summary 資訊時
          if (isOnlyFetchSummary) {
            // summary 計算中或失敗時，回傳資料皆為空陣列
            this.showColumnSummaryRow = !dataColumnSummary.every(column => !column.dataSummary)
            // 如為空陣列，則輪詢取得最新的 summary 資訊
            if (!this.showColumnSummaryRow) {
              return this.timeoutFunction = window.setTimeout(() => {
                this.fetchDataFrameData(id, page, false, true)
              }, watingTime)
            } else {
              return this.tableSummaryList = dataColumnSummary.map(column => ({
                ...column.dataSummary,
                statsType: column.statsType,
                totalRows: this.pagination.totalItems
              }))
            }
          }

          // 若選擇重新取得資料表所有資料時
          if (resetPagination) {
            this.pagination = dataFrameData.pagination
            this.dataFrameOverviewData = {
              totalRows: dataFrameData.pagination.totalItems,
              totalColumns: dataFrameData.columns.length
            }
            this.showColumnSummaryRow = !dataColumnSummary.every(column => !column.dataSummary)

            if (!this.showColumnSummaryRow) {
              this.timeoutFunction = window.setTimeout(() => {
                this.fetchDataFrameData(id, page, false, true)
              }, watingTime)
            } else {
              this.tableSummaryList = dataColumnSummary.map(column => ({
                ...column.dataSummary,
                statsType: column.statsType,
                totalRows: dataFrameData.pagination.totalItems
              }))
            }
          }

          let numericIndex = []
          this.tableSummaryList.forEach((element, index) => {
            if (element.statsType === 'NUMERIC') {
              numericIndex.push(index)
            }
          })

          dataFrameData.data.forEach(data => {
            numericIndex.forEach(numeric => {
              data[numeric] = this.formatComma(data[numeric])
            })
          })

          this.dataSourceTableData = {
            columns: {
              titles: dataFrameData.columns
            },
            data: dataFrameData.data,
            index: [...Array(dataFrameData.data.length)].map((x, i) => i)
          }
          this.isLoading = false
          this.isProcessing = false
          this.$store.commit('dataSource/setShouldDataFrameDataRefetchDataColumn', null)
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
      this.pagination.currentPage = page - 1
      this.fetchDataFrameData(this.dataFrameId, this.pagination.currentPage, false, false, this.sortOrders)
    },
    fallbackCopyTextToClipboard (value) {
      const input = document.createElement('input')
      input.setAttribute('value', value)
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
    },
    copyTextToClipboard (value) {
      // 確認 Clipboard API 是否支援
      if (!navigator.clipboard) return this.fallbackCopyTextToClipboard(value)

      navigator.clipboard.writeText(value)
        .then(() => {
          // clipboard successfully set
          Message({
            message: this.$t('message.copiedToBoard'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        }, () => {
          // clipboard write failed
          Message({
            message: this.$t('message.copiedToBoardFailed'),
            type: 'error',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => this.fallbackCopyTextToClipboard(value))
    },
    copyTitle (value) {
      // 自動貼到問句搜尋功能：暫時關閉
      // this.setCopiedColumnName(value)
      // 純複製到剪貼簿功能
      this.copyTextToClipboard(value)
    },
    handleTableSort ({ dataColumnIndex, sortType }) {
      this.sortOrders = sortType ? { dataColumnId: this.columnIdList[dataColumnIndex], sortType } : null
      this.fetchDataFrameData(this.dataFrameId, this.pagination.currentPage, false, false, this.sortOrders)
    },
    async setColumnIdList (dataFrameId) {
      if (dataFrameId) {
        const response = await getDataFrameColumnInfoById(dataFrameId)
        this.columnIdList = response.map(column => column.id)
      }
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

  ::v-deep .el-table {
    td {
      padding: 4px 0;
    }
    .cell {
      font-size: 14px;
      line-height: 18px;
    }
  }

  .header-block {
    .header {
      border-bottom: 1px solid #515959;
      display: flex;
      align-items: center;

      .icon {
        width: 20px;
        margin-right: 5px;
        text-align: center;
      }

      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }

      &__title {
        flex: 1;
        padding: 10px;
      }

      .arrow-icon {
        fill: #BDBDBD;
        margin: 10px;
        &.arrow-up {
          transform: rotateX(180deg);
        }
        &.active {
          fill: $theme-color-primary;
        }
      }
    }
    .summary {
      padding: 10px;
      min-height: 200px; /* 避免 loading 消失後 table index 高度錯亂 */
    }

    .spinner-conatiner {
      margin: 50px;
    }
  }
}

.overview {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
