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
              v-if="isLinkedWithDataSource(scope.row.datasourceId)" 
              href="javascript:void(0);"
              class="link"
              @click="$router.push({ name: 'ScheduleProject', params: { 'account_id': getCurrentAccountId, 'group_id': getCurrentGroupId, 'schedule_project_id': scope.row.id }})"
            >{{ scope.row.name }}</a>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('editing.dataSourceName')"
          prop="datasourceName">
          <template slot-scope="scope">
            <a
              v-if="isLinkedWithDataSource(scope.row.datasourceId)" 
              href="javascript:void(0);"
              class="link"
              target="blank"
              @click="openDataSourcePage(scope.row.datasourceId)"
            >{{ scope.row.datasourceName }}</a>
            <span v-else>{{ scope.row.datasourceName }}</span>
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
              class="action-link link">{{ $t('schedule.project.relationManagement') }}</a>
            <a 
              href="javascript:void(0);"
              class="action-link link">{{ $t('button.rename') }}</a>
            <a 
              href="javascript:void(0);"
              class="action-link link">{{ $t('button.delete') }}</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchProjectList } from '@/schedule/API/Project'
import { mapGetters } from 'vuex'

export default {
  name: 'ScheduleProjectList',
  data: () => {
    return {
      isLoading: false,
      projectList: []
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
  },
  created () {
    this.isLoading = true
    fetchProjectList(this.getCurrentGroupId)
      .then(list => this.projectList = list)
      .finally(() => this.isLoading = false)
  },
  methods: {
    isLinkedWithDataSource (data) {
      return data !== 0
    },
    openDataSourcePage (dataSourceId) {
      window.open(`/account/${this.getCurrentAccountId}/group/${this.getCurrentGroupId}/datasource/${dataSourceId}/`, '_blank')
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