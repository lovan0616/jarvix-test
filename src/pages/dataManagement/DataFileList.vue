<template>
  <div class="data-management">
    <div 
      v-show="isProcessing"
      class="status-block"
    >
      <svg-icon 
        icon-class="spinner" 
        class="spinner-icon"/>{{ $t('editing.dataProcessing') }}
    </div>
    <div class="page-title-row">
      <h1 class="title">{{ $t('nav.dataManagement') }}</h1>
      <div class="bread-crumb">
        <router-link 
          :to="{name: 'DataSourceList'}" 
          class="title-link">{{ $t('editing.dataSource') }}</router-link>
        <span class="divider">/</span>{{ dataSourceName }}
      </div>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <button 
            :disabled="isProcessing || reachLimit"
            class="btn-m btn-default btn-has-icon"
            @click="createDataSource"
          >
            <svg-icon 
              icon-class="file-plus" 
              class="icon"/>{{ $t('editing.newTable') }}
          </button>
          <div 
            v-if="reachLimit"
            class="reach-limit"
          >{{ $t('notification.uploadLimitNotification') }}</div>
        </div>
        <div class="button-block dataframe-action">
          <button 
            :disabled="reachLimit || enableDataFrameCount === 0"
            class="btn-m btn-secondary btn-has-icon"
            @click="toggleEditFeatureDialog"
          >
            <svg-icon 
              icon-class="feature" 
              class="icon"/>{{ $t('button.featureManagement') }}
          </button>
          <button 
            :disabled="!canEditJoinTable()"
            class="btn-m btn-secondary btn-has-icon"
            @click="openEditJoinTableDialog"
          >
            <svg-icon 
              icon-class="correlation" 
              class="icon"/>{{ $t('editing.tableJoin') }}
          </button>
        </div>
        <div class="limit-notification">{{ $t('notification.uploadLimit', {count: fileCountLimit}) }}</div>
      </div>
      <data-table
        :headers="tableHeaders"
        :data-list.sync="dataList"
        :selection.sync="selectList"
        :is-processing="isProcessing"
        :loading="isLoading"
        :empty-message="$t('editing.clickToUploadTable')"
        @create="createDataSource"
        @delete="confirmDelete"
        @edit="editTableColumn"
        @dataFrameAlias="editDataFrameAlias"
        @valueAlias="editTableValueAlias"
        @columnSet="editColumnSet"
        @dateTime="editDateTime"
      />
    </div>
    <file-upload-dialog
      v-if="showCreateDataSourceDialog"
      @success="fetchData"
      @close="closeFileUploadDialog"
    />
    <confirm-delete-data-frame-dialog
      v-if="showConfirmDeleteDialog"
      :title="$t('editing.deleteTable')"
      :file-list="selectList"
      @confirm="deleteFile"
      @cancel="cancelDelete"
    />
    <edit-table-join-relation-dialog
      v-if="showJoinTableDialog"
      :reach-limit="reachLimit"
      :data-frame-list="dataList"
      @cancel="closeEditJoinTableDialog"
      @dataFrameUpdate="fetchData()"
    />
    <edit-column-dialog
      v-if="showEditColumnDialog"
      :table-info="currentEditDataFrameInfo"
      @close="closeEditColumnDialog"
    />
    <data-frame-alias-dialog
      v-if="showDataFrameAliasDialog"
      :data-frame-info="currentEditDataFrameInfo"
      @close="closeDataFrameAliasDialog"
    />
    <value-alias-dialog
      v-if="showValueAliasDialog"
      :data-frame-info="currentEditDataFrameInfo"
      @close="closeValueAliasDialog"
    />
    <edit-column-set-dialog
      v-if="showEditColumnSetDialog"
      :data-frame-info="currentEditDataFrameInfo"
      @close="closeEditClomnSetDialog"
    />
    <edit-date-time-dialog
      v-if="showEditDateTimeDialog"
      :data-frame-info="currentEditDataFrameInfo"
      @close="closeEditDateTimeDialog"
    />
    <feature-management-dialog
      v-if="showEditFeatureDialog"
      @close="toggleEditFeatureDialog"
    />
  </div>
</template>
<script>
import DataTable from '@/components/table/DataTable'
import FileUploadDialog from './components/FileUploadDialog'
import ConfirmDeleteDataFrameDialog from './components/ConfirmDeleteDataFrameDialog'
import EditTableJoinRelationDialog from './components/tableJoin/EditTableJoinRelationDialog'
import EditColumnDialog from './components/EditColumnDialog'
import EditColumnSetDialog from './components/columnSet/EditColumnSetDialog'
import DataFrameAliasDialog from './components/alias/DataFrameAliasDialog'
import ValueAliasDialog from './components/alias/ValueAliasDialog'
import EditDateTimeDialog from './components/EditDateTimeDialog'
import { getDataFrameById, checkDataSourceStatusById, deleteDataFrameById } from '@/API/DataSource'
import FeatureManagementDialog from './components/feature/FeatureManagementDialog'
import { mapState } from 'vuex'

export default {
  name: 'DataFileList',
  components: {
    DataTable,
    FileUploadDialog,
    ConfirmDeleteDataFrameDialog,
    EditTableJoinRelationDialog,
    EditColumnDialog,
    EditColumnSetDialog,
    DataFrameAliasDialog,
    ValueAliasDialog,
    EditDateTimeDialog,
    FeatureManagementDialog
  },
  data () {
    return {
      currentDataSourceId: parseInt(this.$route.params.id),
      dataSourceName: null,
      showConfirmDeleteDialog: false,
      showJoinTableDialog: false,
      showEditColumnDialog: false,
      showEditDateTimeDialog: false,
      deleteId: null,
      renameDataSource: null,
      // 資料處理中
      isProcessing: false,
      dataList: [],
      tableList: [],
      // checkbox 所選擇的檔案列表
      selectList: [],
      // 目前正在編輯的資料表
      currentEditDataFrameInfo: {
        id: null,
        primaryAlias: null
      },
      showDataFrameAliasDialog: false,
      showValueAliasDialog: false,
      showEditColumnSetDialog: false,
      showEditFeatureDialog: false,
      intervalFunction: null,
      checkDataFrameIntervalFunction: null,
      isLoading: false,
      showJoinTable: localStorage.getItem('showJoinTable'),
      reachLicenseFileSizeLimit: false
    }
  },
  computed: {
    ...mapState('userManagement', ['license']),
    checkIfReachFileSizeLimit () {
      return this.license.currentDataStorageSize >= this.license.maxDataStorageSize
    },
    fileCountLimit () {
      return this.$store.state.dataManagement.fileCountLimit
    },
    reachLimit () {
      return this.reachFileLengthLimit || this.reachLicenseFileSizeLimit
    },
    reachFileLengthLimit () {
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
          text: this.$t('editing.createWay'),
          value: 'createMethod',
          width: '80px'
        },
        {
          text: this.$t('editing.createDate'),
          value: 'createDate',
          sort: true,
          width: '140px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('editing.updateDate'),
          value: 'updateDate',
          sort: true,
          width: '140px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('editing.status'),
          value: 'state',
          width: '80px'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '270px',
          action: [
            {
              name: this.$t('button.edit'),
              subAction: [
                {icon: '', title: 'button.editDataFrameAlias', dialogName: 'dataFrameAlias'},
                {icon: '', title: 'button.editColumn', dialogName: 'edit'},
                {icon: '', title: 'button.editDataValue', dialogName: 'valueAlias'},
                {icon: '', title: 'button.editColumnSet', dialogName: 'columnSet'}
              ]
            },
            {
              name: this.$t('button.dateTimeColumnSetting'),
              value: 'dateTime'
            },
            {
              name: this.$t('button.delete'),
              value: 'delete'
            }
          ]
        }
      ]
    },
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
    },
    fileUploadSuccess () {
      return this.$store.state.dataManagement.fileUploadSuccess
    },
    hasDataFrameProcessing () {
      if (!this.dataList.length) return false
      return this.dataList.some(element => element.type === 'PROCESS' || element.state === 'Process' || element.state === 'Pending')
    },
    enableDataFrameCount () {
      return this.dataList.reduce((acc, cur) => {
        return (cur.state === 'Enable') ? acc + 1 : acc
      }, 0)
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
        this.$store.dispatch('dataSource/getDataSourceList')
      }
    },
    hasDataFrameProcessing (value) {
      if (value) {
        this.checkDataFrameIntervalFunction = window.setInterval(() => {
          this.updateDataTable()
        }, 5000)
      } else {
        this.$store.dispatch('dataSource/getDataSourceList')
        window.clearInterval(this.checkDataFrameIntervalFunction)
      }
    }
  },
  mounted () {
    this.fetchData()
    this.checkDataSourceStatus()
    this.checkJoinTable()
    this.checkIfReachFileSizeLimit()
  },
  beforeDestroy () {
    if (this.intervalFunction) {
      window.clearInterval(this.intervalFunction)
    } else if (this.checkDataFrameIntervalFunction) {
      window.clearInterval(this.checkDataFrameIntervalFunction)
    }
  },
  methods: {
    checkJoinTable () {
      if (!this.showJoinTable) {
        localStorage.setItem('showJoinTable', false)
      }
    },
    fetchData () {
      this.isLoading = true
      return this.updateDataTable().finally(() => {
        this.isLoading = false
      })
    },
    updateDataTable () {
      return getDataFrameById(this.currentDataSourceId, true).then(response => {
        // 因為 ETL 會預建立 data frame，如果未執行預處理 data frame 會處於 pending 狀態，在這邊需要過濾掉
        this.dataList = response.filter(element => element.state !== 'Temp').map(element => {
          return {
            ...element,
            createMethod: element.joinCount > 1 ? this.$t('editing.tableJoin') : this.createMethod(element.originType)
          }
        })
      })
    },
    createMethod (value) {
      if (value === 'file') {
        return this.$t('editing.userUpload')
      } else {
        return this.$t('editing.connectDB')
      }
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
        name: this.dataSourceName,
        type: null
      })

      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', true)
    },
    closeFileUploadDialog () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    confirmDelete (dataObj) {
      if (dataObj) {
        this.selectList = [dataObj]
      }
      this.showConfirmDeleteDialog = true
    },
    deleteFile () {
      this.showConfirmDeleteDialog = false
      this.isLoading = true
      const dataframeId = this.selectList[0].id
      deleteDataFrameById(dataframeId)
        .then(res => {
          this.dataList = this.dataList.filter(dataframe => dataframe.id !== dataframeId)
          this.fetchData()
          this.deleteFinish()
        })
        .catch(() => {
          this.deleteFinish()
        })
    },
    deleteFinish () {
      this.selectList = []
      this.isLoading = false
    },
    cancelDelete () {
      this.selectList = []
      this.showConfirmDeleteDialog = false
    },
    canEditJoinTable () {
      const editableDataList = this.dataList.filter(dataFrame => dataFrame.state === 'Enable')
      // return editableDataList.length > 0
      // 暫時無開啟 self join 功能，因此至少需兩張 dataframe 才可編輯
      return editableDataList.length > 1
    },
    openEditJoinTableDialog () {
      if (!this.canEditJoinTable) return
      this.showJoinTableDialog = true
    },
    closeEditJoinTableDialog () {
      this.showJoinTableDialog = false
    },
    toggleEditColumnDialog () {
      this.showEditColumnDialog = !this.showEditColumnDialog
    },
    editTableColumn (dataInfo) {
      // 利用 id 去 tableList 裡面找對應的 table 資訊
      this.currentEditDataFrameInfo = dataInfo
      this.toggleEditColumnDialog()
    },
    closeEditColumnDialog () {
      this.currentEditDataFrameInfo = null
      this.toggleEditColumnDialog()
    },
    editDataFrameAlias (dataInfo) {
      this.currentEditDataFrameInfo = {
        id: dataInfo.id,
        primaryAlias: dataInfo.primaryAlias
      }
      this.showDataFrameAliasDialog = true
    },
    editTableValueAlias (dataInfo) {
      this.currentEditDataFrameInfo = {
        id: dataInfo.id,
        primaryAlias: dataInfo.primaryAlias
      }
      this.showValueAliasDialog = true
    },
    editColumnSet (dataInfo) {
      this.currentEditDataFrameInfo = {
        id: dataInfo.id,
        primaryAlias: dataInfo.primaryAlias
      }
      this.showEditColumnSetDialog = true
    },
    editDateTime (dataInfo) {
      this.currentEditDataFrameInfo = {
        id: dataInfo.id,
        primaryAlias: dataInfo.primaryAlias
      }
      this.showEditDateTimeDialog = true
    },
    closeDataFrameAliasDialog () {
      this.showDataFrameAliasDialog = false
      this.currentEditDataFrameInfo = null
    },
    closeValueAliasDialog () {
      this.showValueAliasDialog = false
    },
    closeEditClomnSetDialog () {
      this.showEditColumnSetDialog = false
    },
    closeEditDateTimeDialog () {
      this.showEditDateTimeDialog = false
    },
    toggleEditFeatureDialog () {
      this.showEditFeatureDialog = !this.showEditFeatureDialog
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

  .dataframe-action {
    flex: 1;
    justify-content: flex-end;
    margin-right: 12px;
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
