<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">資料源</h1>
      <button type="button" class="btn btn-create"
        @click="createDataSource"
      >
        <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增資料源
      </button>
    </div>
    <div class="data-table data-source-list-table">
      <div class="data-table-row table-head">
        <div class="data-table-cell name" >資料源名稱
          <button class="control-block" @click="ranking(status[0].name, status[0].type, 0)">{{ status[0].value }}</button>
        </div>
        <div class="data-table-cell type">資料類型</div>
        <div class="data-table-cell user">上傳者</div>
        <div class="data-table-cell date-create">建立日期
          <button class="control-block" @click="ranking(status[1].name, status[1].type, 1)">{{ status[1].value }}</button>
        </div>
        <div class="data-table-cell date-modify">修改日期
          <button class="control-block" @click="ranking(status[2].name, status[2].type, 2)">{{ status[2].value }}</button>
        </div>
        <div class="data-table-cell count">資料表數</div>
        <div class="data-table-cell action">操作</div>
      </div>
      <!-- <upload-block
        v-if="dataList.length > 0"
        class="empty-status"
        bottom-message="點擊建立您的資料源"
        @create="createDataSource"
      ></upload-block> -->
      <div class="data-table-body">
        <div
          class="data-table-row"
          v-for="(data, index) in dataList"
          :key="index"
        >
          <div class="data-table-cell name">
            <a href="" class="name-link">{{ data.name }}</a>
          </div>
          <div class="data-table-cell type">{{ data.type }}</div>
          <div class="data-table-cell user">{{ data.user }}</div>
          <div class="data-table-cell date-create">{{ data.date }}</div>
          <div class="data-table-cell date-modify">{{ data.modifyDate }}</div>
          <div class="data-table-cell count">{{ data.count }}</div>
          <div class="data-table-cell action">
            <a href="" class="action-link">重新命名</a>
            <a href="" class="action-link">刪除</a>
          </div>
        </div>

      </div>
    </div>
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
import UploadBlock from './components/UploadBlock'
import FileUploadDialog from './components/FileUploadDialog'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'
import ConfirmChangeNameDialog from './components/ConfirmChangeNameDialog'

import { orderBy } from 'lodash'
export default {
  name: 'DataSourceList',
  components: {
    UploadBlock,
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
          name: 123,
          type: 'CSV',
          user: 'christan',
          date: '2018-04-16',
          modifyDate: '2018-05-06',
          count: 4
        },
        {
          name: 124,
          type: 'CSV',
          user: 'frank',
          date: '2018-05-01',
          modifyDate: '2018-05-02',
          count: 6
        },
        {
          name: 125,
          type: 'CSV',
          user: 'mina',
          date: '2018-05-01',
          modifyDate: '2018-05-02',
          count: 6
        },
        {
          name: 126,
          type: 'CSV',
          user: 'chi-wei',
          date: '2018-01-03',
          modifyDate: '2018-04-02',
          count: 6
        },
        {
          name: 127,
          type: 'CSV',
          user: 'amy',
          date: '2018-05-01',
          modifyDate: '2018-05-02',
          count: 6
        },
        {
          name: 128,
          type: 'CSV',
          user: 'jerry',
          date: '2018-05-01',
          modifyDate: '2018-05-02',
          count: 6
        },
        {
          name: 129,
          type: 'CSV',
          user: 'lily',
          date: '2018-02-01',
          modifyDate: '2018-03-02',
          count: 6
        },
        {
          name: 130,
          type: 'CSV',
          user: 'ryan',
          date: '2018-01-01',
          modifyDate: '2018-02-02',
          count: 6
        },
        {
          name: 131,
          type: 'CSV',
          user: 'antoine',
          date: '2018-01-03',
          modifyDate: '2018-04-02',
          count: 6
        },
        {
          name: 132,
          type: 'CSV',
          user: 'jin',
          date: '2018-01-03',
          modifyDate: '2018-04-02',
          count: 6
        },
        {
          name: 133,
          type: 'CSV',
          user: 'karl',
          date: '2018-01-03',
          modifyDate: '2018-04-02',
          count: 6
        },
        {
          name: 134,
          type: 'CSV',
          user: 'ning',
          date: '2018-01-03',
          modifyDate: '2018-04-02',
          count: 6
        },
        {
          name: 135,
          type: 'CSV',
          user: 'kyle',
          date: '2018-01-03',
          modifyDate: '2018-04-02',
          count: 6
        },
        {
          name: 136,
          type: 'CSV',
          user: 'verlina',
          date: '2018-01-03',
          modifyDate: '2018-04-02',
          count: 6
        }
      ],
      status: [
        {name: 'name', type: 'asc', value: '^'},
        {name: 'date', type: 'asc', value: '^'},
        {name: 'modifyDate', type: 'asc', value: '^'}
      ]
    }
  },
  methods: {
    createDataSource () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', true)
    },
    closeFileUploadDialog () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  },
  computed: {
    showCreateDataSourceDialog () {
      return this.$store.state.dataManagement.showCreateDataSourceDialog

    },
    ranking (name, value, active) {
      this.dataList = orderBy(this.dataList, [name], [value])
      if (this.status[active].type === 'desc') {
        this.status[active].type = 'asc'
        this.status[active].value = '^'
      } else {
        this.status[active].type = 'desc'
        this.status[active].value = 'v'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-list-table {
  .empty-status {
    padding-top: 50px;
  }

  .data-table-body {
    height: 660px;
  }
  .scroll {
    overflow: auto;
  }

  .data-table-cell {
    .control-block {
      background-color: white;
      border: none;
    }
    &.name {
      position: relative;
      width: 16.3%;

      &:hover {
        .hidden-name {
          display: block;
        }
      }
    }
    &.type {
      flex: 1;
    }
    &.user {
      width: 13.04%;
    }
    &.date-create {
      width: 15.22%;
    }
    &.date-modify {
      width: 15.22%;
    }
    &.count {
      width: 6.53%;
      text-align: right;
    }
    &.action {
      // width: 14.13%;
      width: 15.13%;
      display: flex;
    }
  }
  .name-link {
    display: inline-block;
    width: 100%;
    color: #42A5B3;
  }
  .hidden-name {
    display: none;
    transition: all 0.3s;
  }
}
</style>
