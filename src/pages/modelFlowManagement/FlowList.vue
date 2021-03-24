<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">
        <div class="title-left">{{ $t('sideNav.flowList') }}</div>
      </h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="board-title-row__left">
          <div class="button-block">
            <button
              class="btn-m btn-default btn-has-icon"
              @click="createModelFlow"
            >
              <svg-icon 
                icon-class="plus" 
                class="icon"/>{{ $t('modelFlow.newFlow') }}
            </button>
          </div>
        </div>
      </div>
      <template>
        <flow-card
          v-for="flow in modelFlowList"
          :key="flow.id"
          :flow-info="flow" />
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
import FlowCard from './components/FlowCard'
import { getModelFlowList } from '@/API/ModelFlow'
import { mapState, mapMutations } from 'vuex'
// import { Message } from 'element-ui'

export default {
  name: 'FlowList',
  components: {
    FlowCard
  },
  data () {
    return {
      isLoading: false,
      isShowDeleteDialog: false,
      isShowCreateFlowDialog: false,
      deleteFlowId: null,
      modelFlowList: [],
      paginationInfo: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 20
      }
    }
  },
  computed: {
    ...mapState('modelFlowManagement', ['showCreateFlowDialog']),
    groupId () {
      return this.$route.params.group_id
    }
  },
  mounted () {
    this.fetchData(true)
  },
  methods: {
    ...mapMutations('modelFlowManagement', ['updateShowCreateFlowDialog']),
    fetchData (init = true, page = 0) {
      if (this.isLoading || (!init && this.paginationInfo.currentPage === page)) return 
      this.isLoading = true
      this.modelFlowList = [
        {
          createdAt: "2021-03-23T09:58:05.426Z",
          createdBy: "BABABA",
          id: 123,
          name: "owo",
          targetDataFrame: "dfdf",
          targetDataSource: "dsds",
          targetDataframeStatusType: "Enable"
        },
        {
          createdAt: "2021-03-23T09:58:05.426Z",
          createdBy: "BABA",
          id: 13,
          name: "o-o",
          targetDataFrame: "df",
          targetDataSource: "ds",
          targetDataframeStatusType: "Enable"
        }
      ]
      // return getModelFlowList(this.groupId, page, size)
      //   .then(({getModelFlowList, pagination}) => {
      //     this.modelFlowList = getModelFlowList
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
    createModelFlow () {
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
.data-management {
  .table-board {
    padding: 0;
    background: transparent;
    box-shadow: unset;
  }
}

</style>
