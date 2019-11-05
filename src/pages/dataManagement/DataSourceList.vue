<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">{{ $t('nav.dataManagement') }}</h1>
      <div class="bread-crumb">
        {{ $t('editing.dataSource') }}
      </div>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
            :disabled="reachUploadLimit"
            @click="createDataSource"
          >
            <svg-icon icon-class="folder-plus" class="icon"></svg-icon>{{ $t('editing.newDataSource') }}
          </button>
          <div class="reach-limit"
            v-if="reachUploadLimit"
          >{{ $t('notification.uploadLimitNotification') }}</div>
        </div>
        <div class="limit-notification">{{ $t('notification.uploadLimit', {count: dataSourceLimitCount}) }}</div>
      </div>
      <data-table
        :headers="tableHeaders"
        :data-list.sync="dataList"
        :empty-message="$t('editing.clickToCreateDataSource')"
        @create="createDataSource"
        @rename="confirmRename"
        @delete="confirmDelete"
      >
      </data-table>
    </div>
    <file-upload-dialog
      v-if="showCreateDataSourceDialog"
      @success="fetchData"
      @close="closeFileUploadDialog"
    ></file-upload-dialog>
    <confirm-delete-dialog
      v-if="showConfirmDeleteDialog"
      :title="$t('editing.deleteDataSource')"
      :content="$t('editing.confirmDeleteDataSourceOrNot')"
      @confirm="deleteBookmark"
      @cancel="cancelDelete"
    ></confirm-delete-dialog>
    <confirm-change-name-dialog
      v-if="showConfirmRenameDialog"
      :title="$t('editing.renameDataSource')"
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
      dataSourceLimitCount: 20
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    isDataSourceBuilding (value, oldValue) {
      if (!value && oldValue) {
        this.fetchData()
      }
    },
    dataSourceList: {
      handler () {
        /**
         * 注意！這邊要重新 assign 是因為頁面上有排序功能，不希望排序時影響到 bookmark select 的順序
         */
        this.dataList = this.dataSourceList.map(dataInfo => {
          // 注意！這邊只會做資料表數計算，時間的顯示在 DataTable 處理，主要是為了時間排序的準確
          dataInfo.dataFrameCount = dataInfo.dataFrameCount || 0
          return dataInfo
        })
      },
      immediate: true
    }
  },
  methods: {
    fetchData () {
      return this.$store.dispatch('dataSource/getDataSourceList')
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
    reachUploadLimit () {
      return this.dataList.length >= this.dataSourceLimitCount
    },
    tableHeaders () {
      return [
        {
          text: this.$t('editing.dataSourceName'),
          value: 'name',
          sort: true,
          link: {
            name: 'PageDataFileList'
          }
        },
        {text: this.$t('editing.uploadUser'), value: 'creator', width: '9.96%'},
        {
          text: this.$t('editing.createDate'),
          value: 'createDate',
          sort: true,
          width: '90px',
          time: 'YYYY-MM-DD'
        },
        {
          text: this.$t('editing.updateDate'),
          value: 'updateDate',
          sort: true,
          width: '90px',
          time: 'YYYY-MM-DD'
        },
        {text: this.$t('editing.status'), value: 'state', width: '7.26%'},
        {text: this.$t('editing.countOfTable'), value: 'dataFrameCount', width: '65px'},
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '140px',
          action: [
            {
              name: this.$t('button.rename'),
              value: 'rename'
            }, {
              name: this.$t('button.delete'),
              value: 'delete'
            }
          ]
        }
      ]
    },
    dataSourceList () {
      return this.$store.state.dataSource.dataSourceList
    },
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog
    },
    isDataSourceBuilding () {
      return this.$store.getters['dataSource/isDataSourceBuilding']
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-list-table {
}
</style>
