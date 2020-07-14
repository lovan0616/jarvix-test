<template>
  <div class="group-management">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.accountGroupManagement') }}</h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <router-link
            v-if="showCreateButton()"
            :to="{ name: 'CreateAccountGroup' }"
            :class="{ disabled: isLoading }"
            class="btn-m btn-default btn-has-icon"
          >
            <svg-icon
              icon-class="plus"
              class="icon"/>{{ $t('button.createGroup') }}
          </router-link>
        </div>
      </div>
      <crud-table
        :headers="tableHeaders"
        :data-list.sync="groupList"
        :loading="isLoading"
        :empty-message="$t('editing.notYetCreateGroup')"
      >
        <template v-slot:action="{ data }">
          <a
            :disabled="!hasPermission('account_delete_group')" 
            href="javascript:void(0);"
            class="link action-link"
            @click="confirmDelete(data)">{{ $t('button.delete') }}</a>
          <a
            :disabled="!hasPermission('account_update_group')" 
            href="javascript:void(0);"
            class="link action-link"
            @click="editGroup(data)">{{ $t('editing.editingName') }}</a>
          <a
            v-if="license.maxUser > 1"
            :disabled="!hasGroupReadUserPermission(data)" 
            href="javascript:void(0);"
            class="link action-link"
            @click="confirmEnterGroup(data)">{{ $t('editing.memberManagement') }}</a>
        </template>
      </crud-table>
      <decide-dialog
        v-if="showConfirmDeleteDialog"
        :title="$t('editing.confirmDeleteBelowGroupOrNot')"
        :content="selectedGroup.groupName"
        :type="'delete'"
        @closeDialog="cancelDelete"
        @confirmBtn="deleteGroup"
      />
      <decide-dialog
        v-if="showConfirmEnterGroupDialog"
        :title="$t('editing.confirmEnterGroupUserManagement')"
        :content="selectedGroup.groupName"
        :type="'confirm'"
        :btn-text="$t('button.moveForward')"
        @closeDialog="cancelEnterGroup"
        @confirmBtn="enterGroup"
      />
    </div>
  </div>
</template>

<script>
import { getAccountGroupList, deleteGroup } from '@/API/User'
import CrudTable from '@/components/table/CrudTable'
import DecideDialog from '@/components/dialog/DecideDialog'
import { Message } from 'element-ui'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'AccountGroupList',
  components: {
    CrudTable,
    DecideDialog
  },
  data () {
    return {
      isLoading: false,
      groupList: [],
      selectedGroup: {},
      showConfirmDeleteDialog: false,
      showConfirmEnterGroupDialog: false
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission', 'getCurrentGroupId']),
    ...mapState('userManagement', ['license']),
    tableHeaders () {
      return [
        {
          text: this.$t('editing.groupName'),
          value: 'groupName',
          sort: true,
        },
        {
          text: this.$t('editing.groupOwner'),
          value: 'owner',
          sort: true,
          width: '25%'
        },
        {
          text: this.$t('editing.groupMemberAmount'),
          value: 'memberCount',
          sort: true,
          width: '150px'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '220px'
        }
      ]
    },
    userGroupList() {
      return this.$store.state.userManagement.groupList
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions('userManagement', ['switchGroupById']),
    fetchData () {
      this.isLoading = true
      getAccountGroupList()
        .then(groupList => { this.groupList = groupList })
        .finally(() => { this.isLoading = false })
    },
    confirmDelete (dataObj) {
      if (!this.hasPermission('account_delete_group')) return
      this.selectedGroup = dataObj
      this.showConfirmDeleteDialog = true
    },
    cancelDelete () {
      this.selectedGroup = {}
      this.showConfirmDeleteDialog = false
    },
    deleteGroup (data) {
      // 如果刪掉使用者當前 account 的 default group 則需要切換至新的 group
      const isDeleteCurrentGroup = this.getCurrentGroupId === this.selectedGroup.groupId
      deleteGroup(this.selectedGroup.groupId)
        .then(() => this.$store.dispatch('userManagement/updateUserGroupList', !isDeleteCurrentGroup && this.getCurrentGroupId))
        .then(() => {
          this.fetchData()
          this.showConfirmDeleteDialog = false
          Message({
            message: this.$t('message.groupDeleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
    },
    showCreateButton () {
      return this.hasPermission('account_create_group')
    },
    hasGroupReadUserPermission (data) {
      const currentGroupData = this.userGroupList.find(group => group.groupId === data.groupId)
      return currentGroupData && currentGroupData.groupPermissionList.includes('group_read_user')
    },
    confirmEnterGroup (dataObj) {
      if (!this.hasGroupReadUserPermission(dataObj)) return
      this.selectedGroup = dataObj
      if (this.getCurrentGroupId === this.selectedGroup.groupId) return this.enterGroup()
      // 如果欲前往的群組與當前的不同，會切換群組，因此需要先提醒使用者
      this.showConfirmEnterGroupDialog = true
    },
    cancelEnterGroup () {
      this.selectedGroup = {}
      this.showConfirmEnterGroupDialog = false
    },
    enterGroup () {
      const selectedGroupId = this.selectedGroup.groupId
      if (this.getCurrentGroupId === selectedGroupId) {
        return this.$router.push({ name: 'GroupUserList', params: { group_id: selectedGroupId } })
      }

      // 如果欲前往的群組與當前的不同，須先切換群組再導頁
      this.switchGroupById({
        accountId: this.$route.params.account_id,
        groupId: selectedGroupId
      })
        .then(() => this.$router.push({ name: 'GroupUserList', params: { group_id: selectedGroupId } }))
    },
    editGroup (data) {
      if (!this.hasPermission('account_update_group')) return
      this.$router.push({ name: 'EditAccountGroup', params: { id: data.groupId } })
    }
  }
}
</script>

<style lang="scss" scoped>
.group-management {
  .page-title-row {
    margin-bottom: 16px;
    .title {
      margin-top: 0;
      font-size: 24px;
      line-height: 32px;
    }
  }
}

.table-board {
  background: var(--color-bg-5);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 24px;

  .button-block {
    display: flex;
    align-items: center;

    .btn-m:not(:last-child) {
      margin-right: 16px;
    }

    .icon {
      font-size: 18px;
    }
  }

  .board-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  & >>> .empty-info-block {
    background: rgba(35, 61, 64, 0.6);
  }
}
</style>
