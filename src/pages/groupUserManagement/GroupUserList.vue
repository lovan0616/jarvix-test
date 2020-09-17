<template>
  <div class="group-management">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.groupUserList') }}</h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <router-link
            v-if="showCreateButton()"
            :to="{ name: 'GroupCreateUser' }"
            class="btn-m btn-default btn-has-icon"
          >
            <svg-icon
              icon-class="user-plus"
              class="icon"/>{{ $t('button.addNewMember') }}
          </router-link>
        </div>
      </div>
      <crud-table
        :headers="tableHeaders"
        :data-list.sync="userList"
        :empty-message="this.$t('message.noMember')"
        :loading="isLoading"
      >
        <template v-slot:roleZhName>
          <role-desc-pop
            manage-type="group" />
        </template>
        <template v-slot:action="{ data }">
          <a
            :disabled="!hasChangeRolePermission(data)"
            href="javascript:void(0)"
            class="link action-link"
            @click="showChangeRole(data)">{{ $t('userManagement.updateRole') }}</a>
          <a
            :disabled="!hasDeletePermission"
            href="javascript:void(0)"
            class="link action-link"
            @click="confirmDelete(data, hasDeletePermission)">{{ $t('button.remove') }}</a>
        </template>
      </crud-table>
      <writing-dialog
        v-if="isShowChangeRole"
        :title="$t('userManagement.updateRole')"
        :button="$t('button.change')"
        :is-loading="isProcessing"
        :show-both="true"
        @closeDialog="closeChangeRole"
        @confirmBtn="changeRole"
      >
        <div class="dialog-select-input-box">
          <div class="label">
            {{ $t('editing.groupRolePermission') }}
            <span class="tooltip-container">
              <svg-icon 
                icon-class="information-circle" 
                class="icon" />
              <div class="tooltip">
                <role-desc-pop
                  manage-type="group" />
              </div>
            </span>
          </div>
          <default-select 
            v-model="currentUserRoleId"
            :option-list="roleOptions"
            class="input"
          />
        </div>
      </writing-dialog>
      <decide-dialog
        v-if="showConfirmDeleteDialog"
        :title="this.$t('editing.confirmDeleteProjectUserText')"
        :type="'delete'"
        @closeDialog="closeDelete"
        @confirmBtn="deleteGroupUser"
      />
    </div>
  </div>
</template>
<script>
import CrudTable from '@/components/table/CrudTable'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import DefaultSelect from '@/components/select/DefaultSelect'
import RoleDescPop from '@/pages/userManagement/components/RoleDescPop'
import { getGroupUserList, getGroupRoles, updateGroupRole, deleteGroupUser } from '@/API/Group'
import { Message } from 'element-ui'
import { mapState, mapGetters } from 'vuex'
import i18n from '@/lang/index.js'

export default {
  name: 'GroupUserList',
  components: {
    CrudTable,
    DecideDialog,
    WritingDialog,
    DefaultSelect,
    RoleDescPop
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      roleOptions: [],
      userList: [],
      editData: {},
      selectedUser: {},
      showConfirmDeleteDialog: false,
      isShowChangeRole: false,
      currentGroupId: '',
      currentUserRoleId: null,
      canEditList: false
    }
  },
  computed: {
    ...mapState('userManagement', ['userId']),
    ...mapGetters('userManagement', ['hasPermission', 'getCurrentGroupId']),
    tableHeaders () {
      return [
        {
          text: this.$t('editing.userAccount'),
          value: 'email',
          sort: true
        },
        {
          text: this.$t('userManagement.userName'),
          value: 'name',
          width: '200px'
        },
        {
          text: this.$t('editing.groupRolePermission'),
          value: 'roleZhName',
          tooltip: {
            width: '212px'
          }
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '30%'
          // action: [
          //   {
          //     type: 'event',
          //     name: this.$t('button.remove'),
          //     value: 'delete',
          //     permission: ['account_delete_group_user', 'group_delete_user']
          //   }
          // ]
        }
      ]
    }
  },
  mounted () {
    this.currentGroupId = this.$route.params.group_id
    this.fetchData(this.currentGroupId)
  },
  methods: {
    fetchData (currentGroupId) {
      this.isLoading = true
      getGroupUserList(currentGroupId)
        .then(userList => {
          this.userList = userList.map(user => {
            return {
              ...user,
              roleZhName: this.getAccountRoleLocaleName(user.role)
            }
          })

          this.canEditList = true
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
          this.canEditList = false
        })
      getGroupRoles(currentGroupId)
        .then(response => {
          this.roleOptions = []
          this.roleOptions = response
            .map(role => {
              const groupRole = role.name
              return {
                value: role.id,
                key: groupRole,
                name: this.getAccountRoleLocaleName(groupRole)
              }
            })
        })
        .catch(() => {})
    },
    confirmDelete (dataObj, hasPermission) {
      if (!hasPermission) return

      this.selectedUser = dataObj
      this.showConfirmDeleteDialog = true
    },
    closeDelete () {
      this.selectedUser = {}
      this.showConfirmDeleteDialog = false
    },
    deleteGroupUser (data) {
      this.isLoading = true
      deleteGroupUser(this.selectedUser.id, this.currentGroupId)
        .then(() => this.$store.dispatch('userManagement/updateUserGroupList', this.currentGroupId))
        .then(() => {
          setTimeout(() => {
            // 無法透過 this 使用 i18n: 如果更新後無群組或被切換群組，此 component 會被 destroyed 掉
            Message({
              message: i18n.t('message.memberDeleteSuccess'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
          }, 0)

          // 處理將自己從當前 group 刪除的情況: 無群組
          if (!this.getCurrentGroupId) {
            this.$router.push({ name: 'PageGrouplessGuidance' })
            return Message({
              message: this.$t('message.youAreGroupless'),
              type: 'warning',
              duration: 3 * 1000,
              showClose: true
            })
          }
          
          // 處理將自己從當前 group 刪除的情況: 切換群組
          if (Number(this.currentGroupId) !== Number(this.getCurrentGroupId)) {
            this.$router.push({ name: 'PageIndex', params: { 'group_id': this.getCurrentGroupId } })
            // 若因刪除群組而造成使用者 default 群組變動，給予提示訊息
            const currentGroupName = this.$store.getters['userManagement/getCurrentGroupName']
            return Message({
              message: this.$t('message.switchToGroupBySys', { groupName: currentGroupName }),
              type: 'info',
              duration: 3 * 1000,
              showClose: true
            })
          }
          
          this.fetchData(this.currentGroupId)
          this.closeDelete()
        })
        .catch(() => { this.isLoading = false })
    },
    showCreateButton () {
      const permissionList = ['account_create_group_user', 'group_create_user']
      return this.canEditList ? this.hasPermission(permissionList) : false
    },
    hasDeletePermission () {
      const permissionList = ['account_delete_group_user', 'group_delete_user']
      return this.canEditList ? this.hasPermission(permissionList) : false
    },
    hasChangeRolePermission (data) {
      const hasOneMoreOwner = this.userList.filter(user => user.role === 'group_owner').length > 1
      const isOnlyOwner = data.role === 'group_owner' && !hasOneMoreOwner
      const isGroupViewer = this.userList.find(user => user.id === this.userId).role === 'group_viewer'
      return this.canEditList && !isOnlyOwner && !isGroupViewer
    },
    showChangeRole (user) {
      if (!this.hasChangeRolePermission(user)) return

      this.selectedUser = user
      const option = this.roleOptions.find(option => option.name === this.getAccountRoleLocaleName(user.role))
      this.currentUserRoleId = option.value
      this.isShowChangeRole = true
    },
    closeChangeRole () {
      this.selectedUser = {}
      this.isShowChangeRole = false
    },
    changeRole () {
      this.isProcessing = true
      updateGroupRole({
        groupId: this.currentGroupId,
        newRole: this.currentUserRoleId,
        userId: this.selectedUser.id
      })
        .then(response => {
          this.closeChangeRole()
          this.fetchData(this.currentGroupId)
          Message({
            message: this.$t('message.changeStatusSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(error => {
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
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

    .bread-crumb {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 1px;
    }

    .title-link {
      color: $theme-color-primary;
      text-decoration: underline;
    }

    .divider {
      margin: 0 .5rem;
    }
  }

  .tooltip-container {
    margin: 0 3px;
    .tooltip {
      width: 212px;
      white-space: normal;
      padding: 12px;
      line-height: 14px;
      z-index: 2010;
    }

    .icon {
      color: $theme-color-warning;
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
