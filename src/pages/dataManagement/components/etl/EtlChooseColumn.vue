<template>
  <div>
    <div 
      v-show="!showEtlSetting"
      class="etl-choose-column"
    >
      <div class="section data-frame">
        <div class="data-frame__name">
          <div class="title">{{ $t('etl.currentDataFrame') }}：</div>
          <default-select
            v-model="currentTableIndex"
            :option-list="tableOptionList"
            size="mini"
            @change="chooseTable"
          />
        </div>
        <div class="data-frame__info">
          <dl>
            <dt>{{ $t('etl.columnCount') }}：</dt>
            <dd>{{ formatComma(currentTableInfo.columns.length) }}</dd>
          </dl>
          <dl>
            <dt>{{ $t('etl.rowCount') }}：</dt>
            <dd>{{ formatComma(currentTableInfo.rowCount) }}</dd>
          </dl>
        </div>
        <div class="data-frame__select">
          <div class="title">{{ $t('etl.columnSelected') }}：</div>
          <column-select
            :current-table-info="currentTableInfo"
            @toggleColumn="toggleColumn"
          />
        </div>
      </div>
      <div
        v-if="currentTableInfo && !isProcessing"
        class="section data-column"
      >
        <pagination-table
          :dataset="currentTableInfo"
          :min-column-width="'270px'"
          :current-table-index="currentTableIndex"
          :is-processing="isProcessing"
          fixed-index
        >
          <template #index-header>
            <div class="toggle-block">
              <label class="checkbox">
                <div 
                  :class="{'indeterminate': someColumnSelected && !allColumnSelected}"
                  class="checkbox-label"
                >
                  <input
                    v-model="allColumnSelected"
                    type="checkbox"
                  >
                  <div class="checkbox-square"/>
                </div>
              </label>
            </div>
          </template>
          <template #columns-header="{ column, index }">
            <div class="header-block">
              <div class="header">
                <span 
                  :class="{'has-changed': column[index].hasChanged}" 
                  class="text">
                  <el-tooltip
                    slot="label"
                    :enterable="false"
                    :visible-arrow="false"
                    :content="`${column[index].primaryAlias}`"
                    placement="bottom-start">
                    <span>{{ column[index].primaryAlias }}</span>
                  </el-tooltip>
                </span>
                <label class="checkbox">
                  <div class="checkbox-label">
                    <input
                      :name="'column' + index"
                      :checked="column[index].active"
                      type="checkbox"
                      @change="toggleColumn(index)"
                    >
                    <div class="checkbox-square"/>
                  </div>
                  {{ $t('etl.selectColumn') }}
                </label>
              </div>
              <div class="header">
                <category-select
                  :column-info="getColumnInfo(index)"
                  :key="currentTableIndex + column[index].primaryAlias + index"
                  @updateInfo="updateSetting"
                />
                <a 
                  href="javascript:void(0)" 
                  class="link"
                  @click="chooseColumn(index)"
                >{{ $t('etl.advance') }}</a>
              </div>
              <div class="summary">
                <data-column-summary
                  v-if="currentTableInfo.columns[index].dataSummary"
                  :key="currentTableIndex + '-' + index + 'column-summary'"
                  :summary-data="currentTableInfo.columns[index].dataSummary"
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
        <p class="data-column__reminder">
          *{{ $t('notification.columnSummarySampleNotification') }}
        </p>
      </div>
      <spinner 
        v-else
        :title="$t('editing.loading')"
        class="processing-spinner-container"
        size="50"
      />
    </div>
    <etl-column-setting
      v-if="showEtlSetting"
      @close="closeEtlColumnSetting"
    />
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import PaginationTable from '@/components/table/PaginationTable'
import DataColumnSummary from '@/pages/datasourceDashboard/components/DataColumnSummary'
import CategorySelect from './CategorySelect'
import ColumnSelect from './ColumnSelect'
import EtlColumnSetting from './EtlColumnSetting'
import { getDataFrameSummary } from '@/API/File'

export default {
  name: 'EtlChooseColumn',
  components: {
    DefaultSelect,
    PaginationTable,
    DataColumnSummary,
    CategorySelect,
    EtlColumnSetting,
    ColumnSelect
  },
  data () {
    return {
      showEtlSetting: false,
      intervalFunction: null,
      isProcessing: true
    }
  },
  computed: {
    tableOptionList () {
      if (this.etlTableList.length === 0) return []
      return this.etlTableList.map((element, index) => {
        return {
          name: element.primaryAlias,
          value: index
        }
      })
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    },
    currentTableIndex: {
      get () {
        return this.$store.state.dataManagement.currentTableIndex
      },
      set (currentTableIndex) {
        this.$store.commit('dataManagement/changeCurrentTableIndex', currentTableIndex)
        window.clearInterval(this.intervalFunction)
        this.getDataFrameSummary(this.etlTableList[currentTableIndex].tableId)
      }
    },
    currentTableInfo () {
      const tableInfo = this.etlTableList[this.currentTableIndex]
      if (tableInfo.rowData) {
        tableInfo.data = tableInfo.rowData
        delete tableInfo.rowData
      }
      tableInfo.index = [...Array(tableInfo.data.length)].map((x, i) => i)
      return tableInfo
    },
    allColumnSelected: {
      get () {
        let selected = (column) => column.active
        return this.etlTableList[this.currentTableIndex].columns.every(selected)
      },
      set (selected) {
        this.etlTableList[this.currentTableIndex].columns.forEach(column => {
          column.active = selected
        })
      }
    },
    someColumnSelected () {
      let selected = (column) => column.active
      return this.etlTableList[this.currentTableIndex].columns.some(selected)
    }
  },
  mounted () {
    this.getDataFrameSummary(this.etlTableList[this.currentTableIndex].tableId)
    this.isProcessing = false
  },
  destroyed () {
    window.clearInterval(this.intervalFunction)
  },
  methods: {
    chooseTable () {
      this.isProcessing = true
      this.$store.commit('dataManagement/changeCurrentTableIndex', this.currentTableIndex)
      this.$nextTick(() => {
        this.isProcessing = false
      })
    },
    chooseColumn (columnIndex) {
      this.$store.commit('dataManagement/changeCurrentColumnIndex', columnIndex)
      this.showEtlSetting = true
    },
    toggleColumn (columnIndex) {
      this.$store.commit('dataManagement/chooseColumn', {
        dataFrameIndex: this.currentTableIndex,
        columnIndex
      })
    },
    getColumnInfo (columnIndex) {
      return this.currentTableInfo.columns[columnIndex]
    },
    updateSetting (info) {
      this.$store.commit('dataManagement/updateReplaceValue', {
        tableIndex: this.currentTableIndex,
        columnIndex: info.index,
        info
      })
    },
    closeEtlColumnSetting () {
      this.showEtlSetting = false
    },
    getDataFrameSummary (id) {
      getDataFrameSummary(id).then(response => {
        response.columns.forEach(element => {
          let columnIndex = this.currentTableInfo.columns.findIndex(column => column.importColumnId === element.importColumnId)
          if (element.dataSummary && !this.currentTableInfo.columns[columnIndex].dataSummary) {
            this.$store.commit('dataManagement/updateSummaryInfo', {
              tableIndex: this.currentTableIndex,
              columnIndex,
              dataSummary: {...element.dataSummary, statsType: element.statsType}
            })
          }
        })

        window.clearInterval(this.intervalFunction)
        if (response.columns.some(element => !element.dataSummary)) {
          this.intervalFunction = window.setInterval(() => {
            this.getDataFrameSummary(id)
          }, 3000)
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.etl-choose-column {
  background: rgba(50, 58, 58, 0.95);
  padding: 20px;
  border-radius: 5px;
  .section {
    &.data-frame {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding-bottom: 10px;
      .data-frame__name {
        flex-basis: 100%;
        margin-bottom: 8px;
        >>> .sy-select {
          border: 1px solid #2AD2E2;
        }
      }
      .data-frame__name,
      .data-frame__select {
        display: flex;
        align-items: center;
        font-size: 14px;
        >>> .sy-select {
          border-radius: 5px;
          background-color: #252C2C;
          .el-input {
            .el-input__inner {
              font-size: 14px;
            }
          }
        }
      }
      .data-frame__info {
        font-size: 14px;
        margin-right:16px;
        dl:not(:last-child) {
          margin-right: 20px;
        }
        dl, dt, dd {
          display: inline-block;
          margin: 0;
        }
      }
    }
    &.data-column {
      .data-column__reminder {
        font-size: 14px;
        text-align: right;
        margin: 0;
      }
    }
  }

  .data-frame-name {
    margin-right: 4px;
  }

  .title {

    &.has-icon {
      position: relative;

      .icon {
        position: absolute;
        top: 4px;
        left: -20px;
        color: #999;
      }
    }

    .data-frame-name {
      max-width: 455px;
    }
  }

  .data-frame-list {
    height: 400px;
    overflow: auto;

    .single-data-frame {
      background-color: rgba(67, 76, 76, 0.95);
      border-radius: 5px;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      cursor: pointer;

      &:not(:last-child) {
        margin-bottom: 12px;
      }

      &.active {
        background-color: #2AD2E2;
      }
    }
  }

  .data-column-list {
    .single-column {
      .checkbox {
        margin-right: 8px;
      }
    }
  }
}
.toggle-block {
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #515959;
}
.header-block {
  .header {
    padding: 10px;
    border-bottom: 1px solid #515959;
    display: flex;
    justify-content: space-between;
    position: relative;
    .text {
      &.has-changed {
        padding-left: 4px;
        &::before {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          top: 8px;
          left: 8px;
          background-color: $theme-color-warning;
        }
      }
    }

    .checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;

      .checkbox-text {
        display: block;
        word-break: no-break;
        line-height: 1;
        padding-left: 10px;
      }
    }

    .checkbox-label {
      margin-right: 8px;
    }

    .text {
      width: calc(100% - 52px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .link {
      line-height: 40px;
    }

    /deep/ .el-select {
      background: #252C2C;
      border-radius: 5px;
      width: 190px;
    }
  }

  .spinner-conatiner {
    height: 100%;
  }

  .summary {
    padding: 10px;
  }
}
</style>
<style lang="scss">
// TODO 等 confirmPopup 改寫法，就可以把這邊拿掉
.etl-choose-column {
  .header-block {
    min-height: 224px;
  }
}
</style>
