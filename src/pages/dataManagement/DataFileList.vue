<template>
  <div class="data-management">
    <div class="status-block"
      v-show="isProcessing"
    >
      <svg-icon icon-class="spinner" class="spinner-icon"></svg-icon>{{ $t('editing.dataProcessing') }}
    </div>
    <div class="page-title-row">
      <h1 class="title">{{ $t('nav.dataManagement') }}</h1>
      <div class="bread-crumb">
        <router-link to="/data-management" class="title-link">{{ $t('editing.dataSource') }}</router-link>
        <span class="divider">/</span>{{ dataSourceName }}
      </div>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
            v-if="dataList.length === 0"
            :disabled="isProcessing || reachLimit"
            @click="createDataSource"
          >
            <svg-icon icon-class="file-plus" class="icon"></svg-icon>{{ $t('editing.newTable') }}
          </button>
          <!-- <button class="btn-m btn-default"
            v-if="dataList.length > 1"
            :disabled="isProcessing"
            @click="editJoinTable"
          >{{ $t('editing.foreignTable') }}</button> -->
          <button class="btn-m btn-outline btn-has-icon"
            v-if="selectList.length > 0"
            :disabled="isProcessing"
            @click="confirmDelete()"
          >
            <svg-icon class="icon"
              v-if="isProcessing"
              :icon-class="spinner"
            ></svg-icon>{{ $t('button.delete') }}
          </button>
          <div class="reach-limit"
            v-if="reachLimit"
          >{{ $t('notification.uploadLimitNotification') }}</div>
        </div>
        <div class="limit-notification">{{ $t('notification.uploadLimit', {count: fileCountLimit}) }}</div>
      </div>
      <data-table
        :headers="tableHeaders"
        :data-list.sync="dataList"
        :selection.sync="selectList"
        :is-processing="isProcessing"
        :empty-message="$t('editing.clickToUploadTable')"
        @create="createDataSource"
        @rename="confirmRename"
        @delete="confirmDelete"
        @edit="editTableColumn"
      >
      </data-table>
    </div>
    <file-upload-dialog
      v-if="showCreateDataSourceDialog"
      @success="fetchData"
      @close="closeFileUploadDialog"
    ></file-upload-dialog>
    <confirm-delete-file-dialog
      v-if="showConfirmDeleteDialog"
      :title="$t('editing.deleteTable')"
      :file-list="selectList"
      @confirm="deleteFile"
      @cancel="cancelDelete"
    ></confirm-delete-file-dialog>
    <confirm-change-name-dialog
      v-if="showConfirmRenameDialog"
      :title="$t('editing.renameTable')"
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
      :table-info="currentEditDataFrameInfo"
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
import { getDataFrameById, checkDataSourceStatusById } from '@/API/DataSource'

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
      currentDataSourceId: parseInt(this.$route.params.id),
      dataSourceName: null,
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
      // 目前正在編輯的資料表
      currentEditDataFrameInfo: null,
      intervalFunction: null
    }
  },
  mounted () {
    this.fetchData()
    this.checkDataSourceStatus()
  },
  beforeDestroy () {
    if (this.intervalFunction) {
      window.clearInterval(this.intervalFunction)
    }
  },
  watch: {
    fileUploadSuccess (value) {
      if (value) {
        this.fetchData()
        this.$store.commit('dataManagement/updateFileUploadSuccess', false)
      }
    },
    isProcessing (value) {
      if (value) {
        this.intervalFunction = window.setInterval(() => {
          this.checkDataSourceStatus()
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
      return getDataFrameById(this.currentDataSourceId).then(response => {
        this.dataList = response
      })
    },
    checkDataSourceStatus () {
      return checkDataSourceStatusById(this.currentDataSourceId).then(response => {
        this.isProcessing = response.state === 'PROCESSING'
        this.dataSourceName = response.name
      })
    },
    createDataSource () {
      // 為了資料表上傳
      this.$store.commit('dataManagement/updateCurrentUploadInfo', {
        dataSourceId: this.currentDataSourceId,
        name: this.dataSourceName
      })

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
      // this.showConfirmDeleteDialog = false
      // this.isProcessing = true
      // // 先去取得 stoarge id
      // createBookmarkStorage(this.currentDataSourceId, this.currentDataSourceInfo.type)
      //   .then(res => {
      //     let deleteList = []
      //     for (let i = 0; i < this.selectList.length; i++) {
      //       deleteList.push(deleteCSV(res.storage.id, this.selectList[i].id))
      //     }

      //     Promise.all(deleteList).then(() => {
      //       buildStorage(res.storage.id, this.currentDataSourceId, false)
      //         .then(() => {
      //           this.deleteFinish()
      //           this.$router.push('/data-management')
      //         })
      //         .catch(() => {
      //           this.deleteFinish()
      //         })
      //     }, () => {
      //       this.deleteFinish()
      //     })
      //   })
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
      // renameCSV(this.currentDataSourceId, this.renameDataSource.id, name)
      //   .then(() => {
      //     this.fetchData()
      //       .then(() => {
      //         this.cancelRename()
      //         resolve()
      //       })
      //   }).catch(() => {
      //     this.cancelRename()
      //   })
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
      this.currentEditDataFrameInfo = dataInfo
      this.toggleEditColumnDialog()
    },
    closeEditColumnDialog () {
      this.currentEditDataFrameInfo = null
      this.toggleEditColumnDialog()
    }
  },
  computed: {
    fileCountLimit () {
      return this.$store.state.dataManagement.fileCountLimit
    },
    reachLimit () {
      return this.dataList.length >= this.fileCountLimit
    },
    // 用來生成 data table
    tableHeaders () {
      return [
        {
          text: this.$t('editing.tableName'),
          value: 'primaryAlias',
          sort: true
        },
        {
          text: this.$t('editing.createDate'),
          value: 'createDate',
          sort: true,
          width: '200px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('editing.updateDate'),
          value: 'updateDate',
          sort: true,
          width: '200px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '240px',
          action: [
            {
              name: this.$t('button.editColumn'),
              value: 'edit'
            }
            // {
            //   name: this.$t('button.rename'),
            //   value: 'rename'
            // },
            // {
            //   name: this.$t('button.delete'),
            //   value: 'delete'
            // }
          ]
        }
      ]
    },
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
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
    text-decoration: underline;
  }
  .divider {
    margin: 0 8px;
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
