<template>
  <div class="edit-column-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.dataColumn') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
         ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="dialog-header-block">
        <div class="data-frame-name">{{ $t('editing.dataFrame') }}：{{ tableInfo.primaryAlias }}</div>
        <button class="btn-m btn-default"
          v-if="userEditInfo.userEditedColumnInputList.length > 0"
          :disabled="isProcessing"
          @click="updateDataSource"
        >{{ $t('button.buildData') }}</button>
      </div>
      <div class="edit-table-block">
        <div class="data-table">
          <div class="data-table-head is-scrolling">
            <div class="data-table-row table-head">
              <div class="data-table-cell name">{{ $t('editing.columnName') }}</div>
              <div class="data-table-cell alias">{{ $t('editing.alias') }}</div>
              <div class="data-table-cell tag">{{ $t('editing.columnTag') }}</div>
              <div class="data-table-cell action">{{ $t('editing.action') }}</div>
            </div>
          </div>
          <div class="data-table-body" ref="dataTableBody">
            <div class="data-table-row"
              v-for="column in columnList"
              :key="column.id"
            >
              <div class="data-table-cell name">{{ column.name }}</div>
              <div class="data-table-cell alias">
                <span
                  v-if="tempRowInfo.dataColumnId !== column.id"
                >{{ column.primaryAlias }}</span>
                <div class="edit-block"
                  v-else
                >
                  <div class="edit-alias-input-block">
                    <input type="text" class="input alias-input"
                      v-model="tempRowInfo.alias"
                    >
                    <!-- <a href="javascript:void(0);" class="link">{{ $t('button.remove') }}</a> -->
                  </div>
                  <!-- <button class="btn-m btn-secondary btn-add">
                    <svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.add') }}
                  </button> -->
                </div>
              </div>
              <!-- <div class="data-table-cell tag">{{ column.statsType }}</div> -->
              <div class="data-table-cell tag">
                <span
                  v-if="tempRowInfo.dataColumnId !== column.id"
                >{{ column.statsType }}</span>
                <default-select class="tag-select input"
                  v-else
                  v-model="tempRowInfo.columnStatsType"
                  :option-list="typeOptionList(column.statsTypeOptionList)"
                ></default-select>
              </div>
              <div class="data-table-cell action">
                <a class="link action-link" href="javascript:void(0)"
                  v-if="tempRowInfo.dataColumnId !== column.id"
                  @click="edit(column)"
                >{{ $t('button.edit') }}</a>
                <a class="link action-link" href="javascript:void(0)"
                  :disabled="isProcessing"
                  v-if="tempRowInfo.dataColumnId === column.id"
                  @click="save"
                >{{ $t('button.save') }}</a>
                <a class="link action-link" href="javascript:void(0)"
                  :disabled="isProcessing"
                  v-if="tempRowInfo.dataColumnId === column.id"
                  @click="cancel"
                >{{ $t('button.cancel') }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataFrameColumnInfoById, updateDataFrameAlias } from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'EditColumnDialog',
  components: {
    DefaultSelect
  },
  props: {
    tableInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      columnList: [],
      tableId: this.tableInfo.id,
      // 目前編輯的欄位
      currentEditColumn: null,
      // 目前編輯的欄位資訊
      tempRowInfo: {
        dataColumnId: null,
        alias: null,
        columnStatsType: null
      },
      userEditInfo: {
        dataFrameId: this.tableInfo.id,
        dataSourceId: this.tableInfo.dataSourceId,
        userEditedColumnInputList: []
      },
      isProcessing: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getDataFrameColumnInfoById(this.tableId).then(response => {
        this.columnList = response
      })
    },
    // 依據 type 決定選單選項
    typeOptionList (optionList) {
      return optionList.map(option => {
        return {
          name: option,
          value: option
        }
      })
    },
    closeDialog () {
      this.$emit('close')
    },
    edit (columnInfo) {
      this.tempRowInfo.dataColumnId = columnInfo.id
      this.tempRowInfo.alias = JSON.parse(JSON.stringify(columnInfo.primaryAlias))
      this.tempRowInfo.columnStatsType = JSON.parse(JSON.stringify(columnInfo.statsType))
    },
    updateDataSource () {
      this.isProcessing = true

      updateDataFrameAlias(this.userEditInfo).then(() => {
        // 更新問句說明資訊
        this.$store.dispatch('dataSource/getDataSourceColumnInfo')
        this.closeDialog()
      }).catch(() => {
        this.cancel()
      })
    },
    save () {
      if (this.isProcessing) return

      let currentColumn = this.columnList.find(element => {
        return element.id === this.tempRowInfo.dataColumnId
      })
      // 將 temp 資料塞回去
      currentColumn.primaryAlias = this.tempRowInfo.alias
      currentColumn.statsType = this.tempRowInfo.columnStatsType
      // 目前的 id 是否已經存在
      let hasId = false
      this.userEditInfo.userEditedColumnInputList.forEach(element => {
        if (element.dataColumnId === this.tempRowInfo.dataColumnId) {
          element.alias = this.tempRowInfo.alias
          element.columnStatsType = this.tempRowInfo.columnStatsType
          hasId = true
        }
      })
      if (!hasId) {
        this.userEditInfo.userEditedColumnInputList.push(this.tempRowInfo)
      }

      this.cancel()
    },
    cancel () {
      this.tempRowInfo = {
        dataColumnId: null,
        alias: null,
        columnStatsType: null
      }
      this.isProcessing = false
    }
  },
  computed: {
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-column-dialog {
  .dialog {
    &-title {
      position: relative;
    }
    &-header-block {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      line-height: 30px;
    }
  }
  .edit-table-block {
    margin-bottom: 32px;
  }
  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #fff;
    font-size: 14px;
  }
  .name {
    width: 30%;
  }
  .alias {
    width: 30%;
  }
  .tag {
    width: 15%;
  }
  .action {
    width: 20%;
  }

  .alias-input {
    width: 105px;
    line-height: 24px;
    margin-right: 12px;
  }
  .edit-alias-input-block {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
  .btn-add {
    .icon {
      margin-right: 5px;
    }
  }
}
</style>
<style lang="scss">
.tag-select.el-select {
  .el-input__inner {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    padding-left: 0;
    letter-spacing: 0.5px;
  }
  .el-input__icon {
    line-height: 24px;
  }
}
</style>
