<template>
  <div class="page-preview-bookmark">
    <template v-if="dataSourceId">
      <div class="bookmark-header">{{$t('resultDescription.dataSourceIntro')}}</div>
      <div class="result-board">
        <spinner
          v-if="isLoading"
          :title="$t('editing.loading')"
          size="50"
        ></spinner>
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
                placement="bottom-start"
                :visible-arrow="false"
                :content="tab.name">
                <span>{{tab.name}}</span>
              </el-tooltip>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div
          class="board-body"
          :class="{'is-loading': isLoading}"
        >
          <data-frame-data
            v-if="currentDataFrameId"
            :key="currentDataFrameId"
            :data-frame-id="currentDataFrameId"
          ></data-frame-data>
        </div>
        <div class="scroll-test">
          <InfiniteScroll />
        </div>
      </div>
    </template>
    <span v-else>{{ $t('message.emptyDataSource') }}</span>
  </div>
</template>
<script>
import SySelect from '../components/select/SySelect'
import EmptyInfoBlock from './EmptyInfoBlock'
import DataFrameData from './DataFrameData'
import InfiniteScroll from './InfiniteScroll'

export default {
  name: 'PreviewDataSource',
  components: {
    SySelect,
    EmptyInfoBlock,
    DataFrameData,
    InfiniteScroll
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
      tableSummaryList: [],
      showColumnSummaryRow: true,
      currentDataFrameId: null
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
            this.currentDataFrameId = this.dataSourceTable.id
          }
          this.isLoading = false
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
      this.hasError = false
      this.dataSourceTable.id = id
      this.currentDataFrameId = id
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

    &.is-loading {
      padding: 0 24px;
    }
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

.scroll-test {
  height: 100px;
  border: 1px solid green;
  overflow: auto;
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
