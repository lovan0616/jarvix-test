<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">
        <router-link to="/data-management" class="title-link">资料源</router-link>
        <span class="divider">/</span>{{ currentBookmarkInfo ? currentBookmarkInfo.name : '' }}
      </h1>
      <a class="link link-with-icon"
        href="javascript:void(0)"
        @click="createDataSource"
      >
        <svg-icon icon-class="file-plus" class="icon"></svg-icon>新增资料表
      </a>
    </div>
    <data-table
      :headers="tableHeaders"
      :data-list.sync="dataList"
      empty-message="点击上传您的资料表"
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
      title="删除资料表"
      content="您确认要删除此资料表吗?"
      @confirm="deleteBookmark"
      @cancel="cancelDelete"
    ></confirm-delete-dialog>
    <confirm-change-name-dialog
      v-if="showConfirmRenameDialog"
      title="重新命名资料表"
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
import { getBookmarkById, deleteBookmark, renameBookmark } from '@/API/Bookmark'

export default {
  name: 'DataFileList',
  components: {
    DataTable,
    FileUploadDialog,
    ConfirmDeleteDialog,
    ConfirmChangeNameDialog
  },
  data () {
    return {
      currentBookmarkId: this.$route.params.id,
      showConfirmDeleteDialog: false,
      showConfirmRenameDialog: false,
      deleteId: null,
      renameDataSource: null,
      dataList: [],
      // 用來生成 data table
      tableHeaders: [
        {
          text: '资料表名称',
          value: 'name',
          sort: true,
          width: '19.57%',
          link: {
            name: 'PageDataFileList'
          }
        },
        {text: '资料来源', value: 'type'},
        {
          text: '建立日期',
          value: 'create_date',
          sort: true,
          width: '25.54%',
          time: 'YYYY-MM-DD'
        },
        {
          text: '修改日期',
          value: 'update_date',
          sort: true,
          width: '25.54%',
          time: 'YYYY-MM-DD'
        },
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
      return getBookmarkById(this.currentBookmarkId).then(response => {
        this.$store.commit('dataManagement/updateCurrentBookmarkInfo', response)
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
          if (response) {
            this.fetchData()
              .then(() => {
                this.cancelDelete()
                resolve()
              })
          } else {
            resolve()
          }
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
          if (response) {
            this.fetchData()
              .then(() => {
                this.cancelRename()
                resolve()
              })
          } else {
            resolve()
          }
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
    },
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.data-management {
  .title-link {
    color: #43BAC3;
  }
  .divider {
    margin: 0 4px;
    color: #979797;
  }
}
</style>