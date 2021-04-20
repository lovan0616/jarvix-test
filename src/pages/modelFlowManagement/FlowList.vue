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
      <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="spinner-container"
        size="50"
      />
      <empty-info-block
        v-else-if="modelFlowList.length === 0"
        :msg="$t('editing.emptyPinboard')"
      />
      <template v-else>
        <flow-card
          v-for="flow in modelFlowList"
          :key="flow.id"
          :flow-info="flow"
          @action="onClickFlowCardAction($event, flow)"
        />
        <el-pagination 
          v-if="paginationInfo.totalPages > 1"
          :total="paginationInfo.totalItems"
          :page-size="paginationInfo.itemPerPage"
          :current-page="paginationInfo.currentPage + 1"
          class="table-pagination"
          layout="prev, pager, next"
          @current-change="changePage"
          @prev-click="changePage"
          @next-click="changePage"
        />
      </template>
    </div>
    <upload-dialog
      v-if="showCreateFlowDialog"
      @close="closeCreateFlowDialog"
    />
    <decide-dialog
      v-if="isShowDeleteDialog"
      :title="$t('modelFlow.deleteConfirmText')"
      :is-processing="isDeleting"
      type="delete"
      class="flow-delete-dialog"
      @closeDialog="closeDeleteDialog"
      @confirmBtn="deleteModelFlow"
    />
  </div>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import UploadDialog from './flowExecution/UploadDialog'
import DecideDialog from '@/components/dialog/DecideDialog'
import FlowCard from './components/FlowCard'
import { getModelFlowList } from '@/API/ModelFlow'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FlowList',
  components: {
    EmptyInfoBlock,
    UploadDialog,
    FlowCard,
    DecideDialog
  },
  data () {
    return {
      isLoading: false,
      isShowDeleteDialog: false,
      isShowCreateFlowDialog: false,
      deleteFlowId: null,
      modelFlowList: [],
      intervalFunction: null,
      paginationInfo: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 10
      },
      isDeleting: false
    }
  },
  computed: {
    ...mapState('modelFlowManagement', ['showCreateFlowDialog', 'flowUploadSuccess']),
    groupId () {
      return this.$route.params.group_id
    }
  },
    watch: {
    flowUploadSuccess (value) {
      if (value) {
        this.clearPolling()
        this.startPolling()
        this.updateFlowUploadSuccess(false)
      }
    }
  },
  mounted () {
    this.startPolling()
  },
  destroyed () {
    this.clearPolling()
  },
  methods: {
    ...mapMutations('modelFlowManagement', ['updateShowCreateFlowDialog', 'updateFlowUploadSuccess']),
    fetchData (showSpinner = true, page = 0, size = 10) {
      if (showSpinner) this.isLoading = true
      return getModelFlowList(this.groupId, page, size)
        .then(({modelFlows, pagination}) => {
          this.paginationInfo = pagination

          // 0筆資料
          if (pagination.totalItems === 0) {
            this.clearPolling()
            this.modelFlowList = []
            return
          }

          // 若索取不存在的頁數，就回頭拿第一頁
          if (pagination.currentPage >= pagination.totalPages) {
            this.clearPolling()
            this.startPolling(true, 0)
            return
          } 
          this.modelFlowList = modelFlows
        }).finally(() => {
          if (showSpinner) this.isLoading = false
        })
    },
    changePage (page) {
      if (this.paginationInfo.currentPage === page - 1) return
      this.clearPolling()
      this.startPolling(true, page - 1)
    },
    closeDeleteDialog () {
      this.deleteFlowId = null
      this.isShowDeleteDialog = false
    },
    createModelFlow () {
      this.updateShowCreateFlowDialog(true)
    },
    closeCreateFlowDialog () {
      this.updateShowCreateFlowDialog(false)
    },
    onClickFlowCardAction (actionName, { id }) {
      switch (actionName) {
        case 'manulUpdate':
          this.updateModelFlow(id)
          return
        case 'deleteModelFlow':
          this.deleteFlowId = id
          this.isShowDeleteDialog = true
          return
      }
    },
    async updateModelFlow (id) {
      await this.$store.dispatch('modelFlowManagement/updateModelFlow', id)
      this.clearPolling()
      this.startPolling(false, this.paginationInfo.currentPage)
    },
    deleteModelFlow () {
      this.isDeleting = true
      this.$store.dispatch('modelFlowManagement/deleteModelFlow', this.deleteFlowId)
        .then(() => {
          this.clearPolling()
          this.startPolling()
        })
        .finally(() => {
          this.isDeleting = false
          this.closeDeleteDialog()
        })
    },
    startPolling (showSpinner, page) {
      this.fetchData(showSpinner, page)
      this.intervalFunction = window.setInterval(() => {
        this.fetchData(false, page)
      }, 5000)
    },
    clearPolling () {
      if (this.intervalFunction) window.clearInterval(this.intervalFunction)
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
