<template>
  <div class="data-management">
    <div class="status-block"
      v-show="isProcessing"
    >
      <svg-icon icon-class="spinner" class="spinner-icon"></svg-icon>资料处理中
    </div>
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
          v-if="dataList.length > 1"
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
      currentEditTableInfo: null,
      intervalFunction: null
    }
  },
  mounted () {
    this.fetchData()
  },
  beforeDestroy () {
    if (this.intervalFunction) {
      window.clearInterval(this.intervalFunction)
    }
  },
  destroyed () {
    this.$store.commit('dataManagement/updateCurrentBookmarkInfo', null)
  },
  watch: {
    isBookmarkBuilding (value, oldValue) {
      if (!value && oldValue) {
        this.fetchData()
        this.isProcessing = false
      } else if (value) {
        this.isProcessing = true
      }
    },
    fileUploadSuccess (value) {
      if (value) {
        this.fetchData()
        this.$store.commit('dataManagement/updateFileUploadSuccess', false)
      }
    },
    isProcessing (value) {
      if (value) {
        this.intervalFunction = window.setInterval(() => {
          this.fetchData()
        }, 5000)
      }
      // 建置完成
      if (!value) {
        window.clearInterval(this.intervalFunction)
      }
    }
  },
  methods: {
    fetchData () {
      return getBookmarkById(this.currentBookmarkId).then(response => {
        this.tableList = this.objectToArray(response.edit_config.tables)
        // 檔案名稱在 config 裡面
        this.dataList = this.objectToArray(response.edit_config.uploads).map(element => {
          element.filename = response.config.uploads[element.id] ? response.config.uploads[element.id].filename : element.filename
          return element
        })

        this.isProcessing = response.build_status

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
            buildStorage(res.storage.id, this.currentBookmarkId, false)
              .then(() => {
                this.deleteFinish()
                this.$router.push('/data-management')
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
    }
  },
  computed: {
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
    },
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    },
    isBookmarkBuilding () {
      return this.$store.getters['bookmark/isBookmarkBuilding']
    },
    fileUploadSuccess () {
      return this.$store.state.dataManagement.fileUploadSuccess
    }
  }
}
</script>
<style lang="scss" scoped>
.data-management {
  position: relative;

  .title-link {
    color: $theme-color-primary;
  }
  .divider {
    margin: 0 4px;
    color: #979797;
  }

  .status-block {
    width: 140px;
    position: absolute;
    top: 60px;
    right: 0;
    left: 0;
    margin: auto;
    padding: 6px 0;
    border-radius: 8px;
    background-color: $theme-bg-darker-color;
    box-shadow:  0px 4px 24px rgba(26, 56, 62, 0.5);
    text-align: center;

    .spinner-icon {
      margin-right: 8px;
    }
  }
}
</style>
