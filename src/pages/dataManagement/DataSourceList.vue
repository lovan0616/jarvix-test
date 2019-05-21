<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">資料源</h1>
      <a class="link link-with-icon"
        href="javascript:void(0)"
        @click="createDataSource"
      >
        <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增資料源
      </a>
    </div>
    <data-table
      :headers="tableHeaders"
      :data-list.sync="dataList"
      empty-message="點擊建立您的資料源"
      @create="createDataSource"
      @rename="confirmRename"
      @delete="confirmDelete"
    >
    </data-table>
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
import DataTable from '@/components/table/DataTable'
import FileUploadDialog from './components/FileUploadDialog'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'
import ConfirmChangeNameDialog from './components/ConfirmChangeNameDialog'

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
      showConfirmNameChangeDialog: false,
      dataList: [
        {
          id: 1,
          name: '123',
          type: 'CSV',
          user: 'christan',
          createDate: '2018-04-16',
          modifyDate: '2018-05-06',
          count: 4
        },
        {
          id: 2,
          name: '124',
          type: 'CSV',
          user: 'frank',
          createDate: '2018-05-01',
          modifyDate: '2018-05-02',
          count: 6
        },
        {
          id: 3,
          name: 'test',
          type: 'CSV',
          user: 'Karl',
          createDate: '2018-05-05',
          modifyDate: '2018-05-15',
          count: 10
        },
        {
          id: 4,
          name: 'test1',
          type: 'CSV',
          user: 'Karl1',
          createDate: '2018-05-15',
          modifyDate: '2018-05-15',
          count: 10
        },
        {
          id: 5,
          name: 'test3',
          type: 'CSV',
          user: 'Karl3',
          createDate: '2018-05-25',
          modifyDate: '2018-06-15',
          count: 10
        },
        {
          id: 6,
          name: 'test4',
          type: 'CSV',
          user: 'Karl',
          createDate: '2018-05-05',
          modifyDate: '2018-05-15',
          count: 10
        },
        {
          id: 7,
          name: 'test5',
          type: 'CSV',
          user: 'Karl',
          createDate: '2018-05-05',
          modifyDate: '2018-05-15',
          count: 10
        }
      ],
      tableHeaders: [
        {
          text: '資料源名稱',
          value: 'name',
          sort: true,
          width: '16.3%',
          link: {
            name: 'DataFileList'
          }
        },
        {text: '資料來源', value: 'type'},
        {text: '上傳者', value: 'user', width: '13.04%'},
        {text: '建立日期', value: 'createDate', sort: true, width: '15.22%'},
        {text: '修改日期', value: 'modifyDate', sort: true, width: '15.22%'},
        {text: '資料表數', value: 'count', align: 'right', width: '6.53%'},
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
  },
  methods: {
    createDataSource () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', true)
    },
    closeFileUploadDialog () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    confirmRename (id) {
      console.log(id)
    },
    confirmDelete (id) {
      console.log(id)
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
}
</style>
