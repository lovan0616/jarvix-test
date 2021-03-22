<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">
        <div class="title-left">{{ $t('sideNav.FlowList') }}</div>
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
                class="icon"/>{{ $t('flow.newModel') }}
            </button>
          </div>
        </div>
      </div>
      <template>
        List
      </template>
    </div>
    <!-- <upload-dialog
      v-if="showCreateModelDialog"
      @close="closeCreateModelDialog"
    />
    <decide-dialog
      v-if="isShowDeleteDialog"
      :content="$t('flow.deleteConfirmText')"
      :type="'delete'"
      class="flow-delete-dialog"
      @closeDialog="cancelDelete"
      @confirmBtn="deleteModel"
    /> -->
  </div>
</template>
<script>
// import { getModelList } from '@/API/Model'
import { mapState, mapMutations } from 'vuex'
// import { Message } from 'element-ui'

export default {
  name: 'FlowList',
  components: {
  },
  data () {
    return {
      isLoading: false,
      isShowDeleteDialog: false,
      isShowCreateFlowDialog: false,
      deleteFlowId: null,
      flowList: [],
      paginationInfo: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 20
      }
    }
  },
  computed: {
    ...mapState('flowManagement', ['showCreateFlowDialog']),
    groupId () {
      return this.$route.params.group_id
    }
  },
  watch: {
    modelUploadSuccess (value) {
      if (value) {
        this.fetchData(true)
        this.updateModelUploadSuccess(false)
      }
    }
  },
  mounted () {
    this.fetchData(true)
  },
  methods: {
    ...mapMutations('modelManagement', ['updateShowCreateFlowDialog', 'updateModelUploadSuccess']),
    fetchData (init = true, page = 0, offset = 20) {
      if (this.isLoading || (!init && this.paginationInfo.currentPage === page)) return 
      // this.isLoading = true
      // return getModelList(this.groupId, page, offset)
      //   .then(({models, pagination}) => {
      //     this.modelList = models
      //     this.paginationInfo = pagination
      //   }).finally(() => {
      //     this.isLoading = false
      //   })
    },
    changePage (page) {
      this.fetchData(false, page - 1)
    },
    confirmDelete ({id}) {
      this.deleteFlowId = id
      this.isShowDeleteDialog = true
    },
    cancelDelete () {
      this.deleteFlowId = null
      this.isShowDeleteDialog = false
    },
    createModel () {
      this.updateShowCreateFlowDialog(true)
    },
    closeCreateFlowDialog () {
      this.updateShowCreateFlowDialog(false)
    },
    deleteFlow () {
      // deleteFlowById(this.deleteFlowId)
      //   .then(() => {
      //     this.fetchData()
      //       .then(() => {
      //         Message({
      //           message: this.$t('message.deleteSuccess'),
      //           type: 'success',
      //           duration: 3 * 1000,
      //           showClose: true
      //         })
      //       })
      //   }).finally(() => {
      //     this.cancelDelete()
      //   })
    }
  }
}
</script>
<style lang="scss" scoped>
.flow-delete-dialog {
  >>> .dialog-content-wrapper > .content {
    color: #FFF;
  }
}
</style>
