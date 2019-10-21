<template>
  <div class="edit-column-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.editTableColumn') }}
         <button class="btn btn-default btn-m build-btn"
          v-if="isSaved"
          :disabled="isProcessing"
          @click="buildBookmark"
        >{{ $t('button.build') }}</button>
        <a href="javascript:void(0)" class="close-btn"
          v-else
          @click="closeDialog"
         ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="edit-table-block">
        <div class="data-table">
          <div class="data-table-head is-scrolling">
            <div class="data-table-row table-head">
              <div class="data-table-cell name">{{ $t('editing.columnName') }}</div>
              <div class="data-table-cell alias">{{ $t('editing.columnAlias') }}</div>
              <div class="data-table-cell tag">{{ $t('editing.columnTag') }}</div>
              <div class="data-table-cell action">{{ $t('editing.action') }}</div>
            </div>
          </div>
          <div class="data-table-body" ref="dataTableBody">
            <div class="data-table-row"
              v-for="(column, index) in columnList"
              :key="index"
            >
              <div class="data-table-cell name">{{ column.name }}</div>
              <div class="data-table-cell alias">
                <span
                  v-if="currentEditColumn !== column.name"
                >{{ column.alias }}</span>
                <input type="text" class="input alias-input"
                  v-else
                  v-model="tempRowInfo.alias"
                >
              </div>
              <div class="data-table-cell tag">
                <span
                  v-if="currentEditColumn !== column.name"
                >{{ column.tag }}</span>
                <default-select class="tag-select input"
                  v-else
                  v-model="tempRowInfo.tag"
                  :option-list="tagOption(column.type)"
                ></default-select>
              </div>
              <div class="data-table-cell action">
                <a class="link action-link" href="javascript:void(0)"
                  v-if="currentEditColumn !== column.name"
                  @click="edit(column)"
                >{{ $t('button.edit') }}</a>
                <a class="link action-link" href="javascript:void(0)"
                  :disabled="isProcessing"
                  v-if="currentEditColumn === column.name"
                  @click="save"
                >{{ $t('button.save') }}</a>
                <a class="link action-link" href="javascript:void(0)"
                  :disabled="isProcessing"
                  v-if="currentEditColumn === column.name"
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
import { getBookmarkStorage, buildStorage, updateCSVColumnSetting } from '@/API/Storage'
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
      columnList: Object.values(this.tableInfo.columns).map(element => element),
      tableId: this.tableInfo.id,
      // 目前編輯的欄位
      currentEditColumn: null,
      // 目前編輯的欄位資訊
      tempRowInfo: {
        alias: null,
        tag: null,
        enable: null
      },
      storageId: null,
      isProcessing: false,
      // 是否已經進行過儲存
      isSaved: false
    }
  },
  methods: {
    getStorageId () {
      // 先去取得 stoarge id
      return getBookmarkStorage(parseInt(this.$route.params.id), this.currentBookmarkInfo.type)
        .then(res => {
          this.storageId = res.storage.id
        })
    },
    // 依據 type 決定選單選項
    tagOption (typeName) {
      switch (typeName) {
        case 'int':
        case 'float':
          return [
            {
              name: 'category',
              value: 'category'
            },
            {
              name: 'numeric',
              value: 'numeric'
            },
            {
              name: 'id',
              value: 'id'
            }
          ]
        case 'object':
          return [
            {
              name: 'category',
              value: 'category'
            },
            {
              name: 'id',
              value: 'id'
            }
          ]
        case 'datetime':
          return [
            {
              name: 'category',
              value: 'category'
            },
            {
              name: 'datetime',
              value: 'datetime'
            }
          ]
        case 'timedelta':
          return [
            {
              name: 'category',
              value: 'category'
            },
            {
              name: 'timedelta',
              value: 'timedelta'
            }
          ]
        default:
          return [
            {
              name: 'id',
              value: 'id'
            },
            {
              name: 'numeric',
              value: 'numeric'
            },
            {
              name: 'category',
              value: 'category'
            }
          ]
      }
    },
    closeDialog () {
      this.$emit('close')
    },
    edit (columnInfo) {
      this.currentEditColumn = columnInfo.name
      this.tempRowInfo.alias = JSON.parse(JSON.stringify(columnInfo.alias))
      this.tempRowInfo.tag = JSON.parse(JSON.stringify(columnInfo.tag))
      this.tempRowInfo.type = JSON.parse(JSON.stringify(columnInfo.type))
    },
    buildBookmark () {
      this.isProcessing = true

      buildStorage(this.storageId, this.currentBookmarkInfo.id, false).then(() => {
        this.$router.push('/data-management')
      }).catch(() => {
        this.cancel()
      })
    },
    save () {
      if (this.isProcessing) return
      this.isProcessing = true

      this.getStorageId().then(() => {
        updateCSVColumnSetting(this.storageId, this.tableId, this.currentEditColumn, this.tempRowInfo).then(() => {
          // 儲存成功不重新取，將 temp 資料塞回去就好
          let currentColumn = this.columnList.find(element => {
            return element.name === this.currentEditColumn
          })
          currentColumn.alias = this.tempRowInfo.alias
          currentColumn.tag = this.tempRowInfo.tag
          // 如果有儲存過，就變更狀態
          this.isSaved = true

          this.cancel()
        }).catch(() => {
          this.cancel()
        })
      })
    },
    cancel () {
      this.currentEditColumn = null
      this.tempRowInfo = {
        alias: null,
        tag: null,
        type: null,
        enable: null
      }
      this.isProcessing = false
    }
  },
  computed: {
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    },
    test (value) {
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-column-dialog {
  .dialog-title {
    position: relative;
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
  .build-btn {
    position: absolute;
    top: 4px;
    right: 0;
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
    line-height: 24px;
  }
}
</style>
<style lang="scss">
.tag-select.el-select {
  .el-input__inner {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
  }
  .el-input__icon {
    line-height: 24px;
  }
}
</style>
