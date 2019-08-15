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
        <button class="btn btn-default"
          :disabled="isProcessing"
          @click="editJoinTable"
        >资料表关联</button>
        <button class="btn btn-outline"
          v-if="selectList.length > 0"
          :disabled="isProcessing"
          @click="confirmDelete()"
        >
          <svg-icon class="icon"
            :icon-class="isProcessing ? 'spinner' : 'delete'"
          ></svg-icon>删除
        </button>
        <!-- <button class="btn btn-default"
          @click="buildDataSource"
          :disabled="isProcessing"
        >建置资料源</button> -->
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
      @edit="editTableColumn"
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
    <edit-table-join-relation-dialog
      v-if="showJoinTableDialog"
      @cancel="toggleJoinTableDialog"
    ></edit-table-join-relation-dialog>
    <edit-column-dialog
      v-if="showEditColumnDialog"
      :table-info="currentEditTableInfo"
      @close="closeEditColumnDialog"
    ></edit-column-dialog>
  </div>
</template>
<script>
import DataTable from '@/components/table/DataTable'
import FileUploadDialog from './components/FileUploadDialog'
import ConfirmDeleteFileDialog from './components/ConfirmDeleteFileDialog'
import ConfirmChangeNameDialog from './components/ConfirmChangeNameDialog'
import EditTableJoinRelationDialog from './components/tableJoin/EditTableJoinRelationDialog'
import EditColumnDialog from './components/EditColumnDialog'
import { getBookmarkById, createBookmarkStorage, renameCSV } from '@/API/Bookmark'
import { deleteCSV, buildStorage } from '@/API/Storage'

export default {
  name: 'DataFileList',
  components: {
    DataTable,
    FileUploadDialog,
    ConfirmDeleteFileDialog,
    ConfirmChangeNameDialog,
    EditTableJoinRelationDialog,
    EditColumnDialog
  },
  data () {
    return {
      currentBookmarkId: parseInt(this.$route.params.id),
      showConfirmDeleteDialog: false,
      showConfirmRenameDialog: false,
      showJoinTableDialog: false,
      showEditColumnDialog: false,
      deleteId: null,
      renameDataSource: null,
      // 資料處理中
      isProcessing: false,
      dataList: [],
      tableList: [],
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
              name: '编辑栏位',
              value: 'edit'
            },
            {
              name: '重新命名',
              value: 'rename'
            }, {
              name: '删除',
              value: 'delete'
            }
          ]
        }
      ],
      // 目前正在編輯的資料表
      currentEditTableInfo: null
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
        this.tableList = this.objectToArray(response.config.tables)
        this.dataList = this.objectToArray(response.config.uploads)

        if (response.build_status) {
          this.isProcessing = true
        }

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
    },
    toggleJoinTableDialog () {
      this.showJoinTableDialog = !this.showJoinTableDialog
    },
    toggleEditColumnDialog () {
      this.showEditColumnDialog = !this.showEditColumnDialog
    },
    editJoinTable () {
      this.toggleJoinTableDialog()
    },
    editTableColumn (dataInfo) {
      // 利用 id 去 tableList 裡面找對應的 table 資訊
      this.currentEditTableInfo = this.tableList.find(element => element.id === dataInfo.id)
      this.toggleEditColumnDialog()
    },
    closeEditColumnDialog () {
      this.currentEditTableInfo = []
      this.toggleEditColumnDialog()
    },
    // 建置資料源
    buildDataSource () {
      createBookmarkStorage(this.currentBookmarkId, this.currentBookmarkInfo.type)
        .then(res => {
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
        })
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
    color: $theme-color-primary;
  }
  .divider {
    margin: 0 4px;
    color: #979797;
  }
}
</style>
