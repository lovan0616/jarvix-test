<template>
  <div class="edit-column-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.editTableColumn') }}
         <a href="javascript:void(0)" class="close-btn"
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
                <input type="text" class="input"
                  v-else
                  v-model="tempRowInfo.alias"
                >
              </div>
              <div class="data-table-cell tag">
                <span
                  v-if="currentEditColumn !== column.name"
                >{{ column.tag }}</span>
                <default-select
                  v-else
                  v-model="column.tag"
                  :option-list=""
                ></default-select>
              </div>
              <div class="data-table-cell action">
                <a class="action-link" href="javascript:void(0)"
                  v-if="currentEditColumn !== column.name"
                  @click="edit(column)"
                >{{ $t('button.edit') }}</a>
                <a class="action-link" href="javascript:void(0)"
                  :disabled="isProcessing"
                  v-if="currentEditColumn === column.name"
                  @click="save"
                >{{ $t('button.save') }}</a>
                <a class="action-link" href="javascript:void(0)"
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
      isProcessing: false
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
    closeDialog () {
      this.$emit('close')
    },
    edit (columnInfo) {
      this.currentEditColumn = columnInfo.name
      this.tempRowInfo.alias = JSON.parse(JSON.stringify(columnInfo.alias))
    },
    save () {
      if (this.isProcessing) return
      this.isProcessing = true
      this.getStorageId().then(() => {
        updateCSVColumnSetting(this.storageId, this.tableId, this.currentEditColumn, this.tempRowInfo).then(() => {
          buildStorage(this.storageId, this.currentBookmarkInfo.id, false).then(() => {
            this.$router.push('/data-management')
          }).catch(() => {
            this.cancel()
          })
        })
      })
    },
    cancel () {
      if (this.isProcessing) return
      this.currentEditColumn = null
      this.tempRowInfo.alias = null
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
  .close-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    color: #fff;
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
}
</style>
