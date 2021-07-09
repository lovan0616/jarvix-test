<template>
  <div class="user-management">
    <div class="page-title-row">
      <h1 class="title">
        {{ $t('userManagement.accountUserList') }}
      </h1>
    </div>
    <div class="table-board">
      <div class="button-block">
        <button
          :disabled="isLoading || isProcessing || reachUserLimit"
          class="btn-m btn-default btn-has-icon"
          @click="showInviteUser"
        >
          <svg-icon
            icon-class="user-invite"
            class="icon"
          />
          {{ $t('userManagement.inviteUser') }}
        </button>
        <button
          :disabled="isLoading || isProcessing || reachUserLimit"
          class="btn-m btn-default btn-has-icon"
          @click="showCreateUser"
        >
          <svg-icon
            icon-class="user-plus"
            class="icon"
          />
          {{ $t('userManagement.createUser') }}
        </button>
        <div
          v-if="reachUserLimit"
          class="reach-limit"
        >
          {{ $t('notification.userLimitNotification') }}
        </div>
      </div>
      <crud-table
        :headers="tableHeaders"
        :data-list.sync="userData"
        :loading="isLoading"
        :empty-message="$t('editing.notYetCreateGroup')"
      >
        <template #roleZhName>
          <role-desc-pop />
        </template>
        <template #action="{ data }">
          <a
            :disabled="hasChangePwdPermission"
            class="link action-link"
            @click="showResetPasswordDialog(data, !hasChangePwdPermission)"
          >{{ $t('editing.changePassword') }}</a>
          <a
            :disabled="btnDisabled(data)"
            class="link action-link"
            @click="showChangeRole(data, !btnDisabled(data))"
          >{{ $t('userManagement.updateRole') }}</a>
          <a
            :disabled="btnDisabled(data)"
            class="link action-link"
            @click="showDeleteUserDialog(data, !btnDisabled(data))"
          >{{ $t('button.remove') }}</a>
        </template>
      </crud-table>
    </div>
    <writing-dialog
      v-if="isShowRestPasswordDialog"
      :title="$t('editing.changePassword')"
      :button="$t('button.change')"
      :is-loading="isProcessing"
      :show-both="true"
      @closeDialog="closeRestPasswordDialog"
      @confirmBtn="changePassword"
    >
      <div class="dialog-select-input-box">
        <input-verify
          v-validate="'required|min:8|requireOneNumeric'"
          ref="confirmPassword"
          v-model="passwordInfo.password"
          :placeholder="$t('editing.newPassword')"
          type="password"
          name="verifyNewPassword"
        />
        <input-verify
          v-validate="'required|min:8|requireOneNumeric|confirmed:confirmPassword'"
          v-model="passwordInfo.verifyPassword"
          :placeholder="$t('editing.confirmNewPassword')"
          type="password"
          name="verifyPasswordCheck"
        />
      </div>
    </writing-dialog>
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
          {{ $t('userManagement.userRoleAuthority') }}
          <span class="tooltip-container">
            <svg-icon
              icon-class="information-circle"
              class="icon"
            />
            <div class="tooltip">
              <role-desc-pop />
            </div>
          </span>
        </div>
        <default-select
          v-model="currentUser.roleId"
          :option-list="roleOptions"
          class="input account-role-select"
        />
      </div>
    </writing-dialog>

    <decide-dialog
      v-if="isShowDeleteUserDialog"
      :title="$t('userManagement.confirmDeleteAccountUserText')"
      :type="'delete'"
      :btn-text="$t('button.remove')"
      :is-processing="isProcessing"
      @closeDialog="closeDeleteUserDialog"
      @confirmBtn="deleteUser"
    />
    <create-user-dialog
      v-if="isShowCreateUser"
      :is-processing="isProcessing"
      :role-options="roleOptions"
      :account-viewer-role-id="accountViewerRoleId"
      class="fill-dialog"
      @closeDialog="closeCreateUser"
      @confirmBtn="createUsers"
    />
    <invite-user-dialog
      v-if="isShowInviteUser"
      :is-processing="isProcessing"
      :role-options="roleOptions"
      :account-viewer-role-id="accountViewerRoleId"
      class="fill-dialog"
      @closeDialog="closeInviteUser"
      @confirmBtn="createUsers"
    />
  </div>
</template>
<script>
import { getAccountUsers, deleteAccountUser, inviteUser, batchInviteUser, getAccountRoles, updateRole, getSelfInfo, updateUser } from '@/API/User'
import { getAccountInfo } from '@/API/Account'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'UserManagement',
  components: {
    CreateUserDialog: () => import('./components/CreateUserDialog'),
    InviteUserDialog: () => import('./components/InviteUserDialog'),
    DecideDialog: () => import('@/components/dialog/DecideDialog'),
    WritingDialog: () => import('@/components/dialog/WritingDialog'),
    InputVerify: () => import('@/components/InputVerify'),
    DefaultSelect: () => import('@/components/select/DefaultSelect'),
    RoleDescPop: () => import('@/pages/userManagement/components/RoleDescPop'),
    CrudTable: () => import('@/components/table/CrudTable')
  },
  data () {
    return {
      isShowCreateUser: false,
      isShowInviteUser: false,
      roleOptions: [],
      inviteeList: [],
      userData: [],
      isShowChangeRole: false,
      isShowDeleteUserDialog: false,
      confirmDeleteText: this.$t('editing.confirmDelete'),
      closeText: this.$t('editing.close'),
      unableLoginText: this.$t('editing.unableLogin'),
      confirmText: this.$t('editing.confirmActive'),
      accountText: this.$t('editing.username'),
      accountViewerRoleId: null,
      isLoading: false,
      isProcessing: false,
      reachUserLimit: false,
      tableHeaders: [
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
          text: this.$t('userManagement.userRoleAuthority'),
          value: 'roleZhName',
          tooltip: {
            width: '212px'
          }
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '300px'
        }
      ],
      currentUser: {
        id: null,
        active: null,
        username: '',
        role: '',
        roleId: null
      },
      passwordInfo: {
        password: null,
        verifyPassword: null
      },
      selfInfo: null,
      isShowRestPasswordDialog: false
    }
  },
  computed: {
    hasRepetitiveInvitee () {
      return this.inviteeList
        .map(invitee => invitee.email)
        .some((email, index, array) => array.indexOf(email) !== index)
    },
    currentAccountId () {
      return this.$store.getters['userManagement/getCurrentAccountId']
    },
    roleList () {
      return [
        {
          value: true,
          name: this.$t('editing.admin')
        },
        {
          value: false,
          name: this.$t('editing.general')
        }
      ]
    },
    hasChangePwdPermission () {
      if (!this.selfInfo) return false
      return this.selfInfo.role !== 'account_owner' && this.selfInfo.role !== 'account_maintainer'
    }
  },
  watch: {
    userData: {
      handler (newUsers, oldUsers) {
        if (newUsers.length === oldUsers.length) return
        this.checkIfReachUserLimit()
      },
      immediate: false
    }
  },
  mounted () {
    this.getUserList().then(() => {
      this.getSelfInfo()
    })
    this.getAccountRoleList()
    this.checkIfReachUserLimit()
  },
  methods: {
    checkIfReachUserLimit () {
      getAccountInfo().then(({ license }) => {
        this.reachUserLimit = license.currentUser >= license.maxUser && license.maxUser !== -1
        this.$store.commit('userManagement/setLicenseCurrentUser', license.currentUser)
      })
    },
    getSelfInfo () {
      getSelfInfo().then(response => {
        this.selfInfo = this.userData.filter(user => user.id === response.id)[0]
      })
    },
    btnDisabled (user) {
      if (!this.selfInfo || !user) return true
      return (this.selfInfo.role === 'account_maintainer' && user.role === 'account_owner') || this.selfInfo.id === user.id
    },
    showInviteUser () {
      this.isShowInviteUser = true
    },
    showCreateUser () {
      this.isShowCreateUser = true
    },
    closeInviteUser () {
      this.isShowInviteUser = false
      this.inviteeList = []
    },
    closeCreateUser () {
      this.isShowCreateUser = false
      this.inviteeList = []
    },
    createUsers (inviteeList, inviteType) {
      this.inviteeList = inviteeList
      let existingUsers = this.checkExistingUsers()
      if (existingUsers.size > 0) {
        const html = [...existingUsers].join(',<br>')
        Message({
          message: html + ',<br>' + this.$tc('message.userAlreadyExisting', existingUsers.size),
          dangerouslyUseHTMLString: true,
          type: 'warning',
          duration: 5 * 1000,
          showClose: true
        })
        return
      }
      if (this.hasRepetitiveInvitee) {
        Message({
          message: this.$t('message.userInviteRepetitive'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
        return
      }
      this.isProcessing = true
      let promise = inviteType === 'inviteUser'
        ? inviteUser({
          emailList: this.inviteeList.map(invitee => {
            return {
              accountRole: invitee.roleId,
              groupId: 1, // 暫定預設 1 為 default group
              mail: invitee.email
            }
          }),
          webURL: window.location.origin + this.$router.resolve({ name: 'PageSignup' }).href,
          accountId: this.currentAccountId
        })
        : batchInviteUser(this.inviteeList)

      promise.then(() => {
        this.isShowInviteUser = false
        this.isShowCreateUser = false
        this.inviteeList = []
        this.getUserList()
        Message({
          message: this.$t('message.userInviteSuccess'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      })
        .catch(() => {})
        .finally(() => {
          this.isProcessing = false
        })
    },
    getUserList () {
      this.isLoading = true
      return getAccountUsers()
        .then(response => {
          this.userData = []
          this.userData = response.map(user => {
            return {
              ...user,
              roleZhName: this.getAccountRoleLocaleName(user.role)
            }
          })
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false
        })
    },
    getAccountRoleList () {
      return getAccountRoles(this.currentAccountId)
        .then(response => {
          this.accountViewerRoleId = response[response.length - 1].id
          this.roleOptions = []
          this.roleOptions = response
            .map(role => {
              return {
                value: role.id,
                key: role.name,
                name: this.getAccountRoleLocaleName(role.name)
              }
            })
        })
        .catch(() => {})
    },
    changeRole () {
      this.isProcessing = true
      updateRole({
        accountId: this.currentAccountId,
        newRole: this.currentUser.roleId,
        userId: this.currentUser.id
      })
        .then(response => {
          this.closeChangeRole()
          this.getUserList()
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
    deleteUser () {
      this.isProcessing = true
      deleteAccountUser(
        this.currentAccountId,
        this.currentUser.id
      )
        .then(response => {
          this.closeDeleteUserDialog()
          this.getUserList()
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => {
          this.isProcessing = false
        })
    },
    showChangeRole (user, hasPermission) {
      if (!hasPermission) return

      const option = this.roleOptions.find(option => option.name === this.getAccountRoleLocaleName(user.role)) || user.role
      this.currentUser.roleId = option.value
      this.currentUser.id = user.id
      this.isShowChangeRole = true
    },
    closeChangeRole () {
      this.isShowChangeRole = false
    },
    showDeleteUserDialog (user, hasPermission) {
      if (!hasPermission) return
      this.currentUser.id = user.id
      this.isShowDeleteUserDialog = true
    },
    closeDeleteUserDialog () {
      this.isShowDeleteUserDialog = false
    },
    groupName (list) {
      // 暫時只呈現第一個名稱
      return list[0].name
    },
    statusChangeConfirmTitle () {
      if (this.currentUser.active) {
        // 原本為規避狀態的使用者
        return `${this.confirmText} ${this.currentUser.username} ${this.accountText}？`
      } else {
        // 原本為開通狀態使用者
        return `${this.closeText} ${this.currentUser.username} ${this.unableLoginText}？`
      }
    },
    checkExistingUsers () {
      let existingUsers = new Set()

      for (let i = 0; i < this.inviteeList.length; i++) {
        for (let j = 0; j < this.userData.length; j++) {
          if (this.inviteeList[i].email === this.userData[j].email) {
            existingUsers.add(this.inviteeList[i].email)
            break
          }
        }
      }
      return existingUsers
    },
    async changePassword () {
      const result = this.$validator.validateAll()
      if (!result) return

      try {
        this.isProcessing = true
        const { active, password, username, id } = this.currentUser
        await updateUser({
          active,
          password,
          username,
          userId: id,
          accountId: this.currentAccountId
        })
        this.closeRestPasswordDialog()
        this.isProcessing = false
        await this.getUserList()
        Message({
          message: this.$t('message.changePasswordSuccess'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      } catch (err) {
        this.isProcessing = false
      }
    },
    showResetPasswordDialog (user, hasPermission) {
      if (!hasPermission) return
      this.currentUser.id = user.id
      this.currentUser.username = user.name
      this.currentUser.active = user.active
      this.isShowRestPasswordDialog = true
    },
    closeRestPasswordDialog () {
      // 關閉 component 後，才清空資料，以免在 function 中觸發 validate 導致錯誤發生
      this.isShowRestPasswordDialog = false
      this.$nextTick(() => {
        this.passwordInfo.password = null
        this.passwordInfo.verifyPassword = null
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-management {
  .page-title-row {
    margin-bottom: 16px;

    .title {
      font-size: 24px;
      line-height: 32px;
      margin: 0;
    }

    .bread-crumb {
      align-items: center;
      display: flex;
      font-size: 16px;
      letter-spacing: 1px;
      line-height: 20px;
    }
  }

  .tooltip-container {
    margin: 0 3px;

    .tooltip {
      line-height: 14px;
      padding: 12px;
      white-space: normal;
      width: 212px;
      z-index: 2010;
    }

    .icon {
      color: $theme-color-warning;
    }
  }

  .account-role-select {
    margin-bottom: 16px;
  }

  .table-board {
    background: var(--color-bg-5);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    padding: 24px;
  }
}

</style>
<style lang="scss">
.role-select.el-select {
  width: 120px;

  .el-input__inner {
    height: 20px;
    line-height: 20px;
    padding-left: 0;
  }

  .el-input__icon {
    line-height: 20px;
  }
}
</style>
