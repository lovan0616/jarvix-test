<template>
  <div>
    <div class="etl-choose-column"
      v-show="!showEtlSetting"
    >
      <div class="section data-frame">
        <div class="data-frame-info">
          <div class="title">{{ $t('etl.currentDataFrame') }}：</div>
          <default-select
            size="mini"
            v-model="currentTableIndex"
            :option-list="tableOptionList"
            @change="chooseTable"
          ></default-select>
        </div>
        <!-- TODO 已選欄位數 -->
        <div class="data-content-info">
          <dl>
            <dt>{{ $t('etl.columnCount')}}：</dt>
            <dd>{{ formatComma(currentTableInfo.columns.length) }}</dd>
          </dl>
          <dl>
            <dt>{{ $t('etl.rowCount')}}：</dt>
            <dd>{{ formatComma(currentTableInfo.rowCount) }}</dd>
          </dl>
        </div>
      </div>
      <div
        class="section data-column"
        v-if="currentTableInfo && !isProcessing"
      >
        <pagination-table
          class="board-body-section"
          :dataset="currentTableInfo"
          :min-column-width="'270px'"
          :current-table-index="currentTableIndex"
          fixedIndex
        >
          <template #index-header>
            <div class="toggle-block">
              <label class="checkbox">
                <div class="checkbox-label"
                  :class="{'indeterminate': someColumnSelected && !allColumnSelected}"
                >
                  <input
                    type="checkbox"
                    :checked="allColumnSelected"
                    @change="toggleSelectAll"
                  >
                  <div class="checkbox-square"></div>
                </div>
              </label>
            </div>
          </template>
          <template #columns-header="{ column, index }">
            <div class="header-block">
              <div class="header">
                <span class="text" :class="{'has-changed': column[index].hasChanged}">
                  <el-tooltip
                    :enterable="false"
                    :visible-arrow="false"
                    placement="bottom-start"
                    slot="label"
                    :content="`${column[index].primaryAlias}`">
                    <span>{{ column[index].primaryAlias }}</span>
                  </el-tooltip>
                </span>
                <label class="checkbox">
                  <div class="checkbox-label">
                    <input
                      type="checkbox"
                      :name="'column' + index"
                      :checked="column[index].active"
                      @change="toggleColumn(index)"
                    >
                    <div class="checkbox-square"></div>
                  </div>
                  {{ $t('etl.selectColumn') }}
                </label>
              </div>
              <div class="header">
                <category-select
                  :column-info="getColumnInfo(index)"
                  @updateInfo="updateSetting"
                  :key="currentTableIndex + column[index].primaryAlias + index"
                />
                <a href="javascript:void(0)" class="link"
                  @click="chooseColumn(index)"
                >{{ $t('etl.advance') }}</a>
              </div>
              <div class="summary">
                <data-column-summary
                  v-if="currentTableInfo.columns[index].dataSummary"
                  :key="currentTableIndex + '-' + index + 'column-summary'"
                  :summary-data="currentTableInfo.columns[index].dataSummary"
                />
                <spinner class="spinner-conatiner"
                  v-else
                  :title="$t('etl.dataCalculate')"
                  size="30"
                ></spinner>
              </div>
            </div>
          </template>
        </pagination-table>
        <p class="data-column__reminder">
          *{{ $t('notification.columnSummarySampleNotification') }}
        </p>
      </div>
      <spinner class="processing-spinner-container"
        v-else
        :title="$t('editing.loading')"
        size="50"
      ></spinner>
    </div>
    <etl-column-setting
      v-if="showEtlSetting"
      @close="closeEtlColumnSetting"
    ></etl-column-setting>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import PaginationTable from '@/components/table/PaginationTable'
import DataColumnSummary from '@/pages/datasourceDashboard/components/DataColumnSummary'
import CategorySelect from './CategorySelect'
import EtlColumnSetting from './EtlColumnSetting'
import { getDataFrameSummary } from '@/API/File'

export default {
  name: 'EtlChooseColumn',
  components: {
    DefaultSelect,
    PaginationTable,
    DataColumnSummary,
    CategorySelect,
    EtlColumnSetting
  },
  data () {
    return {
      showEtlSetting: false,
      intervalFunction: null,
      isProcessing: true
    }
  },
  mounted () {
    this.getDataFrameSummary(this.etlTableList[this.currentTableIndex].tableId)
    window.setTimeout(() => {
      this.isProcessing = false
    }, 1000)
  },
  destroyed () {
    window.clearInterval(this.intervalFunction)
  },
  methods: {
    toggleSelectAll () {
      if (this.allColumnSelected) {
        this.etlTableList[this.currentTableIndex].columns.forEach(column => {
          column.active = false
        })
      } else {
        this.etlTableList[this.currentTableIndex].columns.forEach(column => {
          column.active = true
        })
      }
    },
    chooseTable () {
      this.$store.commit('dataManagement/changeCurrentTableIndex', this.currentTableIndex)
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
    allColumnSelected () {
      let selected = (column) => column.active
      return this.etlTableList[this.currentTableIndex].columns.every(selected)
    },
    someColumnSelected () {
      let selected = (column) => column.active
      return this.etlTableList[this.currentTableIndex].columns.some(selected)
    }
  }
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
      justify-content: space-between;
      padding-bottom: 10px;
      .data-frame-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        >>> .sy-select {
          border: 1px solid #2AD2E2;
          border-radius: 5px;
          .el-input {
            .el-input__inner {
              font-size: 14px;
            }
          }
        }
      }
      .data-content-info {
        font-size: 14px;
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
        color: $theme-color-warning;
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
