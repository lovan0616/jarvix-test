<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">资料源</h1>
      <div class="button-block">
        <button class="btn btn-default"
          @click="createDataSource"
        >
          <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增资料源
        </button>
      </div>
    </div>
    <data-table
      :headers="tableHeaders"
      :data-list.sync="dataList"
      empty-message="点击建立您的资料源"
      @create="createDataSource"
      @rename="confirmRename"
      @delete="confirmDelete"
    >
    </data-table>
    <file-upload-dialog
      v-if="showCreateDataSourceDialog"
      @success="fetchData"
      @close="closeFileUploadDialog"
    ></file-upload-dialog>
    <confirm-delete-dialog
      v-if="showConfirmDeleteDialog"
      title="删除资料源"
      content="您确认要删除此资料源吗?"
      @confirm="deleteBookmark"
      @cancel="cancelDelete"
    ></confirm-delete-dialog>
    <confirm-change-name-dialog
      v-if="showConfirmRenameDialog"
      title="重新命名资料源"
      :source="renameDataSource.name"
      @confirm="renameBookmark"
      @cancel="cancelRename"
    ></confirm-change-name-dialog>
  </div>
</template>
<script>
import DataTable from '@/components/table/DataTable'
import FileUploadDialog from './components/FileUploadDialog'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'
import ConfirmChangeNameDialog from './components/ConfirmChangeNameDialog'
import { getBookmarks, deleteBookmark, renameBookmark } from '@/API/Bookmark'

export default {
  name: 'DataSourceList',
  components: {
    DataTable,
    FileUploadDialog,
    ConfirmDeleteDialog,
    ConfirmChangeNameDialog
  },
  data () {
    return {
      showConfirmDeleteDialog: false,
      showConfirmRenameDialog: false,
      deleteId: null,
      renameDataSource: null,
      dataList: [],
      // 用來生成 data table
      tableHeaders: [
        {
          text: '资料源名称',
          value: 'name',
          sort: true,
          width: '16.3%',
          link: {
            name: 'PageDataFileList'
          }
        },
        {text: '资料来源', value: 'type'},
        {text: '上传者', value: 'create_user', width: '13.04%'},
        {
          text: '建立日期',
          value: 'create_date',
          sort: true,
          width: '15.22%',
          time: 'YYYY-MM-DD'
        },
        {
          text: '修改日期',
          value: 'update_date',
          sort: true,
          width: '15.22%',
          time: 'YYYY-MM-DD'
        },
        {text: '资料表数', value: 'count', align: 'right', width: '6.53%'},
        {
          text: '操作',
          value: 'action',
          width: '15.13%',
          action: [
            {
              name: '重新命名',
              value: 'rename'
            }, {
              name: '刪除',
              value: 'delete'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    fileLoaded (value) {
      if (value) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () {
      return getBookmarks().then(response => {
        this.dataList = response.map(dataInfo => {
          // 注意！這邊只會做資料表數計算，時間的顯示在 DataTable 處理，主要是為了時間排序的準確
          dataInfo.count = dataInfo.config ? Object.keys(dataInfo.config.uploads).length : 0
          return dataInfo
        })
      })
    },
    createDataSource () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', true)
    },
    closeFileUploadDialog () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    confirmRename (dataInfo) {
      this.renameDataSource = dataInfo
      this.showConfirmRenameDialog = true
    },
    confirmDelete (dataObj) {
      this.deleteId = dataObj.id
      this.showConfirmDeleteDialog = true
    },
    deleteBookmark (resolve) {
      deleteBookmark(this.deleteId)
        .then(response => {
          this.fetchData()
            .then(() => {
              this.cancelDelete()
              resolve()
            })
        }).catch(() => {
          resolve()
        })
    },
    cancelDelete () {
      this.deleteId = null
      this.showConfirmDeleteDialog = false
    },
    renameBookmark ({resolve, name}) {
      renameBookmark(this.renameDataSource.id, name)
        .then(response => {
          this.fetchData()
            .then(() => {
              this.cancelRename()
              resolve()
            })
        }).catch(() => {
          resolve()
        })
    },
    cancelRename () {
      this.renameDataSource = null
      this.showConfirmRenameDialog = false
    }
  },
  computed: {
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
    },
    fileLoaded () {
      return this.$store.state.dataManagement.fileLoaded
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-list-table {
}
</style>
