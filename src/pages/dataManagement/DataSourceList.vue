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
import { deleteBookmark, renameBookmark } from '@/API/Bookmark'

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
      // 資料處理中
      isProcessing: false,
      // 用來生成 data table
      tableHeaders: [
        {
          text: '资料源名称',
          value: 'name',
          sort: true,
          width: '11.71%',
          link: {
            name: 'PageDataFileList',
            disabled: {
              name: 'type',
              value: ['SQLITE']
            }
          }
        },
        {text: '资料来源', value: 'type', width: '8.82%'},
        {text: '上传者', value: 'create_user', width: '12.96%'},
        {
          text: '建立日期',
          value: 'create_date',
          sort: true,
          width: '14.53%',
          time: 'YYYY-MM-DD'
        },
        {
          text: '修改日期',
          value: 'update_date',
          sort: true,
          width: '14.53%',
          time: 'YYYY-MM-DD'
        },
        {text: '状态', value: 'build_status', width: '7.26%'},
        {text: '资料表数', value: 'count', align: 'right', width: '6.53%'},
        {
          text: '操作',
          value: 'action',
          action: [
            {
              name: '重新命名',
              value: 'rename'
            }, {
              name: '删除',
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
    isBookmarkBuilding (value, oldValue) {
      if (!value && oldValue) {
        this.fetchData()
      }
    },
    bookmarkList: {
      handler () {
        /**
         * 注意！這邊要重新 assign 是因為頁面上有排序功能，不希望排序時影響到 bookmark select 的順序
         */
        this.dataList = this.bookmarkList.map(dataInfo => {
          // 注意！這邊只會做資料表數計算，時間的顯示在 DataTable 處理，主要是為了時間排序的準確
          dataInfo.count = dataInfo.config ? Object.keys(dataInfo.config.uploads).length : 0
          return dataInfo
        })
      },
      immediate: true
    }
  },
  methods: {
    fetchData () {
      return this.$store.dispatch('bookmark/getBookmarkList')
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
    bookmarkList () {
      return this.$store.state.bookmark.bookmarkList
    },
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
    },
    isBookmarkBuilding () {
      return this.$store.getters['bookmark/isBookmarkBuilding']
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-list-table {
}
</style>
