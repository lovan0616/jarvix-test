<template>
  <div class="management-info-page">
    <bread-crumb :name="flowName" />
    <div class="page-title-row">
      <div class="title">
        {{ $t('modelFlow.flowUpdateLogs') }}
      </div>
    </div>
    <spinner 
      v-if="isLoading"
      :title="$t('editing.loading')"
      class="spinner-container"
      size="50"
    />
    <empty-info-block
      v-else-if="flowUpdateLogs.length === 0"
      :msg="$t('editing.emptyPinboard')"
    />
    <template v-else>
      <el-table
        :data="flowUpdateLogs"
        class="sy-table"
        style="width: 100%">
        <el-table-column
          :label="$t('modelFlow.updatedTime')"
          prop="createdAt"
          width="180"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.createdAt | convertTimeStamp }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('modelFlow.triggerType')"
          prop="triggerType"
          width="180">
          <template slot-scope="scope">
            {{ triggerTypeLabel(scope.row.triggerType) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('modelFlow.updatedStatus')"
          prop="executionStatus"
        >
          <template slot-scope="scope">
            <span :class="scope.row.executionStatus === 'Fail' ? 'is-failed' : null">
              {{ logUpdateStatus(scope.row.executionStatus) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('modelFlow.updateMessage')"
          prop="errorMessage"
        >
          <template slot-scope="scope">
            {{ scope.row.errorMessage || '-' }}
          </template>
        </el-table-column>
      </el-table>
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
</template>

<script>
import { getModelFlowUpdateLogs, getModelFlowDetail } from '@/API/ModelFlow'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import BreadCrumb from './components/BreadCrumb.vue'
import { mapState } from 'vuex'

export default {
  name: 'Flowlogs',
  components: {
    EmptyInfoBlock,
    BreadCrumb
  },
  data: () => {
    return {
      isLoading: false,
      flowUpdateLogs: [],
      paginationInfo: {},
      flowInfo: {}
    }
  },
  computed: {
    ...mapState('modelFlowManagement', ['currentFlowInfo']),
    flowName () {
      return this.currentFlowInfo && this.currentFlowInfo.name || this.flowInfo.name
    },
    flowId () {
      return this.$route.params['flow_id']
    },
  },
  mounted () {
    this.fetchData()
    // 為了要顯示流程名稱，當 store 又沒有對應 flow 資訊時去取
    if (!this.currentFlowInfo) this.fetchModelFlowDetail()
  },
  methods: {
    fetchData (page = 0, size = 20) {
      this.isLoading = true
      getModelFlowUpdateLogs(this.flowId, page, size)
        .then(({ logs, pagination }) => {
          this.flowUpdateLogs = logs
          this.pagination = pagination
        })
        .catch(() => {})
        .finally(() => this.isLoading = false)
    },
    fetchModelFlowDetail () {
      getModelFlowDetail(this.flowId)
        .then(flowInfo => {
          this.flowInfo = flowInfo
          this.$store.commit('modelFlowManagement/updateCurrentFlowInfo', flowInfo)
        })
        .catch(() => {})
    },
    triggerTypeLabel (type) {
      switch (type) {
        case 'MANUAL':
        case 'AUTOMATIC':
          return this.$t(`modelFlow.triggerTypes.${type.toLowerCase()}`)
        default:
          return type
      }
    },
    logUpdateStatus (status) {
      switch (status) {
        case 'Complete':
        case 'Fail':
        case 'Process':
          return this.$t(`modelFlow.modelFlowLogStatus.${(status).toLowerCase()}`)
        default:
          return status
      }
    },
    changePage (page) {
      if (this.pagination.currentPage === page - 1) return
      this.fetchData(page - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.is-failed {
  color: $theme-color-danger;
}
</style>