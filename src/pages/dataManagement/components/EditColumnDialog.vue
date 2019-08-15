<template>
  <div class="edit-column-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">编辑资料表栏位
         <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
         ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="edit-table-block">
        <div class="data-table">
          <div class="data-table-head is-scrolling">
            <div class="data-table-row table-head">
              <div class="data-table-cell name">栏位名称</div>
              <div class="data-table-cell alias">别名</div>
              <div class="data-table-cell tag">标签</div>
              <div class="data-table-cell action">操作</div>
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
              <div class="data-table-cell tag">{{ column.tag }}</div>
              <div class="data-table-cell action">
                <a class="action-link" href="javascript:void(0)"
                  v-if="currentEditColumn !== column.name"
                  @click="edit(column)"
                >编辑</a>
                <a class="action-link" href="javascript:void(0)"
                  v-if="currentEditColumn === column.name"
                  @click="save"
                >储存</a>
                <a class="action-link" href="javascript:void(0)"
                  v-if="currentEditColumn === column.name"
                  @click="cancel"
                >取消</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createBookmarkStorage } from '@/API/Bookmark'
import { updateCSVColumnSetting } from '@/API/Storage'
import { Message } from 'element-ui'

export default {
  name: 'EditColumnDialog',
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
        domain: null,
        enable: null
      },
      storageId: null
    }
  },
  mounted () {
    this.getStorageId()
  },
  methods: {
    getStorageId () {
      // 先去取得 stoarge id
      createBookmarkStorage(parseInt(this.$route.params.id), this.currentBookmarkInfo.type)
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
      updateCSVColumnSetting(this.storageId, this.tableId, this.currentEditColumn, this.tempRowInfo).then(() => {
        Message({
          message: '变更成功，需要重新建置资料源变更才会生效',
          type: 'success',
          duration: 3 * 1000
        })
        this.cancel()
      })
    },
    cancel () {
      this.currentEditColumn = null
      this.tempRowInfo.alias = null
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
