<template>
  <div class="general-management-page general-management-page--project-list">
    <div class="page-title-row">
      <h1 class="title">
        <div class="title-left">{{ $t('schedule.project.projectManagement') }}</div>
      </h1>
      <div class="bread-crumb">
        {{ $t('schedule.project.projectManagement') }}
      </div>
    </div>
    <spinner
      v-if="isLoading" 
      :title="$t('editing.loading')"
      size="50"/>
    <div 
      v-else 
      class="table-board">
      <div class="board-title-row">
        <div class="board-title-row__left">
          <default-button @click="$router.push({ name: 'ScheduleProjectCreator' })">
            <i class="el-icon-plus"/>
            {{ $t('schedule.project.createProject') }}
          </default-button>
        </div>
      </div>
      <el-table
        :data="projectList"
        class="ss-table project-table"
        style="width: 100%">
        <el-table-column
          :label="$t('schedule.project.projectName')"
          prop="name">
          <template slot-scope="scope">
            <a
              v-if="scope.row.datasourceStatus === 'Bound'"
              href="javascript:void(0);"
              class="link"
              @click="$router.push({ name: 'ScheduleProject', params: { 'account_id': getCurrentAccountId, 'group_id': getCurrentGroupId, 'schedule_project_id': scope.row.id }})"
            >{{ scope.row.name }}</a>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('editing.dataSourceName')"
          prop="datasourceStatus"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.datasourceStatus === 'Bound'"
              href="javascript:void(0);"
              class="link"
              @click="openDataSourcePage(scope.row.datasourceId)"
            >{{ scope.row.datasourceName }}</a>
            <span v-else>{{ $t('schedule.project.notYetBindingWithDataSource') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('editing.creator')"
          prop="creatorName"/>
        <el-table-column
          :label="$t('editing.createDate')"
          prop="createDate"
          sortable
          width="120">
          <template slot-scope="scope">
            <span>{{ timeToDate(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('editing.updateDate')"
          prop="updateDate"
          sortable
          width="120">
          <template slot-scope="scope">
            <span>{{ timeToDate(scope.row.updateDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('editing.action')"
          width="220">
          <template slot-scope="scope">
            <a
              href="javascript:void(0);"
              class="action-link link"
              @click="openDialog('Relation', scope.row)">
              {{ scope.row.datasourceStatus === 'Bound'
                ? $t('schedule.project.dataManagement')
                : $t('schedule.project.relationManagement')
              }}
            </a>
            <a 
              href="javascript:void(0);"
              class="action-link link"
              @click="openDialog('Rename', scope.row)">
              {{ $t('button.rename') }}
            </a>
            <a 
              href="javascript:void(0);"
              class="action-link link"
              @click="openDialog('Delete', scope.row)">
              {{ $t('button.delete') }}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <schedule-project-relation-dialog
      v-if="isShowRelationDialog"
      :project-info="projectInfo"
      @close="closeDialog('Relation', $event)"
    />
    <schedule-project-rename-dialog
      v-if="isShowRenameDialog"
      :project-info="projectInfo"
      @close="closeDialog('Rename', $event)"
    />
    <schedule-project-confirm-delete-dialog
      v-if="isShowDeleteDialog"
      :project-info="projectInfo"
      @close="closeDialog('Delete', $event)"
    />
  </div>
</template>

<script>
import { fetchProjectList } from '@/schedule/API/Project'
import { mapGetters } from 'vuex'
import ScheduleProjectRenameDialog from './dialog/ScheduleProjectRenameDialog'
import ScheduleProjectConfirmDeleteDialog from './dialog/ScheduleProjectConfirmDeleteDialog'
import ScheduleProjectRelationDialog from './dialog/ScheduleProjectRelationDialog'

export default {
  name: 'ScheduleProjectList',
  components: {
    ScheduleProjectRenameDialog,
    ScheduleProjectConfirmDeleteDialog,
    ScheduleProjectRelationDialog
  },
  data: () => {
    return {
      isLoading: false,
      projectList: [],
      isShowRenameDialog: false,
      isShowDeleteDialog: false,
      isShowRelationDialog: false,
      projectInfo: { id: null, name: null }
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      fetchProjectList(this.getCurrentGroupId)
        .then(list => this.projectList = list)
        .finally(() => this.isLoading = false)
    },
    openDataSourcePage (dataSourceId) {
      window.open(`/account/${this.getCurrentAccountId}/group/${this.getCurrentGroupId}/datasource/${dataSourceId}/`, '_blank')
    },
    openDialog (action, projectInfo) {
      this[`isShow${action}Dialog`] = true
      this.projectInfo = projectInfo
    },
    closeDialog (action, reload = true) {
      this[`isShow${action}Dialog`] = false
      this.projectInfo = null
      if (reload) this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.general-management-page {
  &--project-list {
    padding: 24px;

    .project-table {
      .action-link {
        &:not(:last-child) {
          margin-right: 8px;
          padding-right: 8px;
          border-right: 1px solid #FFFF;
        }
      }
    }
  }
}
</style>