<template>
  <div class="etl-choose-column">
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
          <dd>{{ currentTableInfo.columns.length }}</dd>
        </dl>
        <dl>
          <dt>{{ $t('etl.rowCount')}}：</dt>
          <dd>{{ currentTableInfo.rowCount }}</dd>
        </dl>
      </div>
    </div>
    <div
      class="section data-column"
      v-if="currentTableInfo"
    >
      <pagination-table
        class="board-body-section"
        :dataset="currentTableInfo"
        :min-column-width="'270px'"
        :current-table-index="currentTableIndex"
      >
        <!--TODO: 上版前需把註解移除-->
        <template v-slot="{ column, index }">
          <div class="header-block">
            <div class="header">
              <span class="text">
                {{ column[index].primaryAlias }}
              </span>

              <div class="checkbox">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    :name="'column' + index"
                    :checked="column[index].active"
                    @change="toggleColumn(index)"
                  >
                  <div class="checkbox-square"></div>
                </label>
                {{ $t('etl.selectColumn') }}
              </div>

            </div>
            <div class="header">
              <category-select
                :column-info="getColumnInfo(index)"
                @updateInfo="updateSetting"
              />
              <a href="javascript:void(0)" class="link"
                @click="chooseColumn(index)"
              >{{ $t('etl.advance') }}</a>
            </div>
            <div class="summary">
              <data-column-summary
                :summary-data="currentTableSummary[index]"
              />
            </div>
          </div>
        </template>
      </pagination-table>
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import PaginationTable from '@/components/table/PaginationTable'
import DataColumnSummary from '@/pages/datasourceDashboard/components/DataColumnSummary'
import CategorySelect from './CategorySelect'

export default {
  name: 'EtlChooseColumn',
  components: {
    DefaultSelect,
    PaginationTable,
    DataColumnSummary,
    CategorySelect
  },
  data () {
    return {
    }
  },
  methods: {
    chooseTable () {
      this.$store.commit('dataManagement/changeCurrentTableIndex', this.currentTableIndex)
    },
    chooseColumn (columnIndex) {
      this.$emit('advance')
      this.$store.commit('dataManagement/changeCurrentColumnIndex', columnIndex)
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
      }
    },
    currentColumnIndex () {
      return this.$store.state.dataManagement.currentColumnIndex
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
    currentTableSummary () {
      return this.currentTableInfo.columns.map(column => column.dataSummary)
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

.header-block {
  height: 255px;

  .header {
    padding: 10px;
    border-bottom: 1px solid #515959;
    display: flex;
    justify-content: space-between;

    .checkbox {
      display: flex;
      align-items: center;
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
  }

  .summary {
    padding: 10px;
    overflow: auto;
    height: calc(100% - 105px);
  }
}
</style>
