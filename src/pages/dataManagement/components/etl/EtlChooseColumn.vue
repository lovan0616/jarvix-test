<template>
  <div class="etl-choose-column">
    <div class="section data-frame">
      <div class="data-frame-info">
        <div class="title">{{ $t('etl.currentDataFrame') }}</div>
        <default-select
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
    <div class="section data-column">
      <!-- TODO 更換為 PaginationTable -->
      <fake-pagination-table :current-table-index="currentTableIndex" >
        <template v-slot="{ column, index }">
          <div class="header-block">
            <div class="header">
              <span class="text">
                {{ column.originalName }}
              </span>
              <div class="checkbox">
                <label class="checkbox-label">
                  <input
                    type="checkbox" :name="'column' + index"
                    v-model="column.active"
                    @change="toggleColumn(index)"
                  >
                  <div class="checkbox-square"></div>
                </label>
                <span class="checkbox-text">{{ $t('etl.selectColumn') }}</span>
              </div>
            </div>
            <div class="header">
              <span>
                {{ column.statsType }}
              </span>
              <a href="javascript:void(0)" class="link"
                @click="chooseColumn(index)"
              >{{ $t('etl.advance') }}</a>
            </div>
          </div>
        </template>
      </fake-pagination-table>
    </div>
  </div>
</template>
<script>
import FakePaginationTable from './FakePaginationTable'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'EtlChooseColumn',
  components: {
    FakePaginationTable,
    DefaultSelect
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
      return this.etlTableList[this.currentTableIndex]
    }
  }
}
</script>
<style lang="scss" scoped>
.etl-choose-column {
  .section {
    &.data-frame {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .data-frame-info {
        display: flex;
        align-items: center;
      }
      .data-content-info {
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
  height: 210px;

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
  }
}
</style>
