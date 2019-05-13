<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">資料源</h1>
      <button type="button" class="btn btn-create"
        @click="createDataSource"
      >
        <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增資料源
      </button>
    </div>
    <div class="data-table data-source-list-table">
      <div class="data-table-row table-head">
        <div class="data-table-cell name">資料源名稱
          <a href="" class="control-block">^</a>
        </div>
        <div class="data-table-cell type">資料類型</div>
        <div class="data-table-cell user">上傳者</div>
        <div class="data-table-cell date-create">建立日期</div>
        <div class="data-table-cell date-modify">修改日期</div>
        <div class="data-table-cell count">資料表數</div>
        <div class="data-table-cell action">操作</div>
      </div>
      <!-- <upload-block
        v-if="dataList.length > 0"
        class="empty-status"
        bottom-message="點擊建立您的資料源"
        @create="createDataSource"
      ></upload-block> -->
      <div class="data-table-body">
        <div class="data-table-row">
          <div class="data-table-cell name">
            <a href="" class="name-link">名稱123</a>
          </div>
          <div class="data-table-cell type">CSV</div>
          <div class="data-table-cell user">username</div>
          <div class="data-table-cell date-create">2018-04-16 12:00</div>
          <div class="data-table-cell date-modify">-</div>
          <div class="data-table-cell count">10</div>
          <div class="data-table-cell action">
            <a href="" class="action-link">重新命名</a>
            <a href="" class="action-link">刪除</a>
          </div>
        </div>
      </div>
    </div>
    <file-upload-dialog
      v-if="showCreateDataSourceDialog"
      @close="closeFileUploadDialog"
    ></file-upload-dialog>
    <confirm-delete-dialog
      v-if="showConfirmDeleteDialog"
      title="刪除資料源"
      content="您確認要刪除此資料表?"
    ></confirm-delete-dialog>
    <confirm-change-name-dialog
      v-if="showConfirmNameChangeDialog"
      title="重新命名資料源"
    ></confirm-change-name-dialog>
  </div>
</template>
<script>
import UploadBlock from './components/UploadBlock'
import FileUploadDialog from './components/FileUploadDialog'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'
import ConfirmChangeNameDialog from './components/ConfirmChangeNameDialog'

export default {
  name: 'DataSourceList',
  components: {
    UploadBlock,
    FileUploadDialog,
    ConfirmDeleteDialog,
    ConfirmChangeNameDialog
  },
  data () {
    return {
      dataList: [],
      showConfirmDeleteDialog: false,
      showConfirmNameChangeDialog: false
    }
  },
  methods: {
    createDataSource () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', true)
    },
    closeFileUploadDialog () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  },
  computed: {
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-list-table {
  .empty-status {
    padding-top: 50px;
  }

  .data-table-cell {
    &.name {
      position: relative;
      width: 16.3%;

      &:hover {
        .hidden-name {
          display: block;
        }
      }
    }
    &.type {
      flex: 1;
    }
    &.user {
      width: 13.04%;
    }
    &.date-create {
      width: 15.22%;
    }
    &.date-modify {
      width: 15.22%;
    }
    &.count {
      width: 6.53%;
      text-align: right;
    }
    &.action {
      width: 14.13%;
      display: flex;
    }
  }
  .name-link {
    display: inline-block;
    width: 100%;
    color: #42A5B3;
  }
  .hidden-name {
    display: none;
    transition: all 0.3s;
  }
}
</style>
