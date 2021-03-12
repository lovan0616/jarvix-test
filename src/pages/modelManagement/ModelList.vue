<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">
        <div class="title-left">{{ $t('sideNav.modelList') }}</div>
      </h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="board-title-row__left">
          <div class="button-block">
            <button
              class="btn-m btn-default btn-has-icon"
              @click="createModel"
            >
              <svg-icon 
                icon-class="plus" 
                class="icon"/>{{ $t('model.newModel') }}
            </button>
          </div>
        </div>
      </div>
      <data-table
        :headers="tableHeaders"
        :data-list.sync="modelData"
        :loading="isLoading"
        :empty-message="$t('model.clickToUploadModel')"
        @create="createModel"
        @delete="confirmDelete"
      />
    </div>
    <upload-dialog
      v-if="showCreateModelDialog"
      @success="fetchData"
      @close="closeCreateModelDialog"
    />
    <decide-dialog
      v-if="isShowDeleteDialog"
      :content="$t('model.deleteConfirmText')"
      :type="'delete'"
      class="model-delete-dialog"
      @closeDialog="cancelDelete"
      @confirmBtn="deleteModel"
    />
  </div>
</template>
<script>
import DataTable from '@/components/table/DataTable'
import DecideDialog from '@/components/dialog/DecideDialog'
import UploadDialog from './scriptExecution/UploadDialog'
import ScriptExecutionFlow from './scriptExecution/ScriptExecutionFlow'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ModelList',
  components: {
    DataTable,
    DecideDialog,
    UploadDialog,
    ScriptExecutionFlow
  },
  data () {
    return {
      isLoading: false,
      isShowDeleteDialog: false,
      isShowCreateModelDialog: false,
      deleteModelId: null,
      modelData: [
      //   {
      //   createTime: "2021-02-26T08:03:34.961+0000",
      //   creator: "exist02593",
      //   id: 2015,
      //   name: "-v-",
      //   updateTime: "2021-03-02T06:42:53.382+0000",
      // }
      ],
      tableHeaders: [
        {
          text: this.$t('model.id'),
          value: 'id',
          width: '65px',
          sort: true,
        },
        {
          text: this.$t('model.modelName'),
          value: 'name',
          width: '130px'
        },
        {
          text: this.$t('model.creator'),
          value: 'creator',
          width: '100px'
        },
        {
          text: this.$t('model.createTime'),
          value: 'createTime',
          width: '165px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('model.updateTime'),
          value: 'updateTime',
          width: '165px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '140px',
          action: [
            {
              type: 'link',
              name: this.$t('model.managementSetting'),
              value: 'rename',
              link: {
                name: 'ModelDetail',
                paramName: 'model_id'
              }
            },
            {
              type: 'event',
              name: this.$t('button.delete'),
              value: 'delete'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState('modelManagement', ['showCreateModelDialog'])
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapMutations('modelManagement', ['updateShowCreateModelDialog']),
    fetchData () {
      // this.isLoading = true
      // return this.$store.dispatch('dataSource/getDataSourceList', {})
      //   .then(() => {
      //     this.isLoading = false
      //   }).catch(() => {
      //     this.isLoading = false
      //   })
    },
    confirmDelete ({id}) {
      this.deleteModelId = id
      this.isShowDeleteDialog = true
    },
    cancelDelete () {
      this.deleteModelId = null
      this.isShowDeleteDialog = false
    },
    createModel () {
      this.updateShowCreateModelDialog(true)
    },
    closeCreateModelDialog () {
      this.updateShowCreateModelDialog(false)
    },
    deleteModel () {
      console.log(this.deleteModelId)
      // deleteDataSourceById(this.deleteId)
      //   .then(response => {
      //     // 清除此資料源在建置中的資料表
      //     this.$store.commit('dataSource/updateProcessingDataFrameListAfterDeleteDataSource', this.deleteId)
      //     this.fetchData()
      //       .then(() => {
      //         Message({
      //           message: this.$t('message.deleteSuccess'),
      //           type: 'success',
      //           duration: 3 * 1000,
      //           showClose: true
      //         })
      //         this.cancelDelete()
      //         resolve()
      //       })
      //   }).catch(() => {
      //     resolve()
      //   })
    }
  }
}
</script>
<style lang="scss" scoped>
.model-delete-dialog {
  >>> .dialog-content-wrapper > .content {
    color: #FFF;
  }
}

</style>
