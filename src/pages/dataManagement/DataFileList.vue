<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">
        <router-link to="/data-management" class="title-link">资料源</router-link>
        <span class="divider">/</span>{{ currentBookmarkInfo ? currentBookmarkInfo.name : '' }}
      </h1>
      <div class="button-block">
        <button class="btn btn-default"
          :disabled="isProcessing"
          @click="createDataSource"
        >
          <svg-icon icon-class="file-plus" class="icon"></svg-icon>新增资料表
        </button>
        <button class="btn btn-outline"
          v-if="selectList.length > 0"
          :disabled="isProcessing"
          @click="confirmDelete()"
        >
          <svg-icon class="icon"
            :icon-class="isProcessing ? 'spinner' : 'delete'"
          ></svg-icon>刪除
        </button>
      </div>
    </div>
    <data-table
      hasCheckbox
      :headers="tableHeaders"
      :data-list.sync="dataList"
      :selection.sync="selectList"
      :is-processing="isProcessing"
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
    <confirm-delete-file-dialog
      v-if="showConfirmDeleteDialog"
      title="删除资料表"
      :file-list="selectList"
      @confirm="deleteFile"
      @cancel="cancelDelete"
    ></confirm-delete-file-dialog>
    <confirm-change-name-dialog
      v-if="showConfirmRenameDialog"
      title="重新命名资料表"
      :source="renameDataSource.filename"
      @confirm="renameCSV"
      @cancel="cancelRename"
    ></confirm-change-name-dialog>
  </div>
</template>
<script>
import DataTable from '@/components/table/DataTable'
import FileUploadDialog from './components/FileUploadDialog'
import ConfirmDeleteFileDialog from './components/ConfirmDeleteFileDialog'
import ConfirmChangeNameDialog from './components/ConfirmChangeNameDialog'
import { getBookmarkById, createBookmarkStorage, renameCSV } from '@/API/Bookmark'
import { deleteCSV, buildStorage } from '@/API/Upload'

export default {
  name: 'DataFileList',
  components: {
    DataTable,
    FileUploadDialog,
    ConfirmDeleteFileDialog,
    ConfirmChangeNameDialog
  },
  data () {
    return {
      currentBookmarkId: parseInt(this.$route.params.id),
      showConfirmDeleteDialog: false,
      showConfirmRenameDialog: false,
      deleteId: null,
      renameDataSource: null,
      // 資料處理中
      isProcessing: false,
      dataList: [],
      // checkbox 所選擇的檔案列表
      selectList: [],
      // 用來生成 data table
      tableHeaders: [
        {
          text: '资料表名称',
          value: 'filename',
          sort: true,
          width: '19.57%'
        },
        {
          text: '建立日期',
          value: 'create_date',
          sort: true,
          width: '25.54%',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: '修改日期',
          value: 'update_date',
          sort: true,
          width: '25.54%',
          time: 'YYYY-MM-DD HH:mm'
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
  destroyed () {
    this.$store.commit('dataManagement/updateCurrentBookmarkInfo', null)
  },
  methods: {
    fetchData () {
      return getBookmarkById(this.currentBookmarkId).then(response => {
        let uploadInfo = response.config.uploads
        let newDataList = []

        Object.keys(response.config.uploads).forEach(element => {
          uploadInfo[element].id = element
          newDataList.push(uploadInfo[element])
        })
        this.dataList = newDataList
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
      if (dataObj) {
        this.selectList = [dataObj]
      }
      this.showConfirmDeleteDialog = true
    },
    deleteFile () {
      this.showConfirmDeleteDialog = false
      this.isProcessing = true
      // 先去取得 stoarge id
      createBookmarkStorage(this.currentBookmarkId, this.currentBookmarkInfo.type)
        .then(res => {
          let deleteList = []
          for (let i = 0; i < this.selectList.length; i++) {
            deleteList.push(deleteCSV(res.storage.id, this.selectList[i].id))
          }

          Promise.all(deleteList).then(() => {
            buildStorage(res.storage.id, this.currentBookmarkId)
              .then(() => {
                this.fetchData()
                  .then(() => {
                    this.deleteFinish()
                  })
              })
              .catch(() => {
                this.deleteFinish()
              })
          }, () => {
            this.deleteFinish()
          })
        })
    },
    deleteFinish () {
      this.selectList = []
      this.isProcessing = false
    },
    cancelDelete () {
      this.selectList = []
      this.showConfirmDeleteDialog = false
    },
    renameCSV ({resolve, name}) {
      renameCSV(this.currentBookmarkId, this.renameDataSource.id, name)
        .then(() => {
          this.fetchData()
            .then(() => {
              this.cancelRename()
              resolve()
            })
        }).catch(() => {
          this.cancelRename()
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
