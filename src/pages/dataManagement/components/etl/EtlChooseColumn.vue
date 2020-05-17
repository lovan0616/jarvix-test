<template>
  <div class="etl-choose-column">
    <div class="section data-frame">
      <div class="data-frame-info">
        <div class="title">目前顯示資料表</div>
        <default-select
          v-model="currentTableIndex"
          :option-list="tableOptionList"
          @change="chooseDataFrame"
        ></default-select>
      </div>
      <!-- TODO 已選欄位數、資料欄位總數、資料總筆數 -->
    </div>
    <div class="section data-column">
      <!-- TODO 更換為 PaginationTable -->
      <fake-pagination-table :currentTableIndex="currentTableIndex" >
        <template v-slot="{ column, index }">
          <div class="header-block">
            <div class="header">
              <span class="text">
                {{ column.originalName }}
              </span>
              <div class="checkbox">
                <div><!-- TODO 使用原本的 checkbox-label -->
                  <input
                    type="checkbox" :name="'column' + index"
                    :value="true"
                    v-model="column.active"
                    @change="chooseColumn(index)"
                  >{{ $t('etl.selectColumn') }}
                  <!-- <div class="checkbox-square"></div> -->
                </div>
              </div>
            </div>
            <div class="header">
              <span>
                {{ column.originalStatsType }}
              </span>
              <a href="javascript:void(0)" class="link"
                @click="$emit('advance')"
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
      currentTableIndex: 0
    }
  },
  methods: {
    chooseDataFrame (index) {
      this.currentTableIndex = index
    },
    chooseColumn (index) {
      this.$store.commit('dataManagement/chooseColumn', {
        dataFrameIndex: this.currentTableIndex,
        columnIndex: index
      })
    }
  },
  computed: {
    tableOptionList () {
      if (this.etlTableList.length === 0) return []
      return this.etlTableList.map((element, index) => {
        return {
          name: element.name,
          value: index
        }
      })
    },
    columnOptionList () {
      if (this.etlTableList.length === 0) return []
      return this.etlTableList[this.currentTableIndex].columns.map(element => {
        return {
          name: element.originalName,
          value: element.index
        }
      })
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
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
      .data-frame-info {
        display: flex;
        align-items: center;
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
    }
  }
}
</style>
