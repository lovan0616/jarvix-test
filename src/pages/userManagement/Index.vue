<template>
  <div class="user-management">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.accountUserManagement') }}</h1>
    </div>
    <div class="table-board">
      <div class="button-block">
        <button
          :disabled="isLoading || isProcessing || reachUserLimit"
          class="btn-m btn-default btn-has-icon"
          @click="showCreateUser">
          <svg-icon 
            icon-class="user" 
            class="icon"/>
          {{ $t('userManagement.createUser') }}
        </button>
        <div 
          v-if="reachUserLimit"
          class="reach-limit"
        >{{ $t('notification.userLimitNotification') }}</div>
      </div>
      <crud-table
        :headers="tableHeaders"
        :data-list.sync="userData"
        :loading="isLoading"
        :empty-message="$t('editing.notYetCreateGroup')"
        @changePassword="showPasswordChange"
        @changeRole="showChangeRole"
        @deleteUserFromAccount="showDeleteAccount"
      >
        <template v-slot:roleZhName>
          <role-desc-pop />
        </template>
        <template v-slot:action="{ data }">
          <a
            :disabled="isNotAllowChangePsd(data)"
            class="link action-link"
            @click="showPasswordChange(data, !isNotAllowChangePsd(data))">
            {{ $t('editing.changePassword') }}
          </a>
          <a
            :disabled="btnDisabled(data)"
            class="link action-link"
            @click="showChangeRole(data, !btnDisabled(data))">
            {{ $t('userManagement.updateRole') }}
          </a>
          <a
            :disabled="btnDisabled(data)"
            class="link action-link"
            @click="showDeleteAccount(data, !btnDisabled(data))">
            {{ $t('button.remove') }}
          </a>
        </template>
      </crud-table>
    </div>

    <writing-dialog
      v-if="isShowPasswordChange"
      :title="$t('editing.changePassword')"
      :button="$t('button.change')"
      :is-loading="isProcessing"
      :show-both="true"
      @closeDialog="closePasswordChange"
      @confirmBtn="changePassword"
    >
      <div class="dialog-select-input-box">
        <input-verify
          v-validate="'required|min:8|requireOneNumeric'"
          ref="confirmPassword"
          v-model="currentUser.password"
          :placeholder="$t('editing.newPassword')"
          type="password"
          name="verifyNewPassword"
        />
        <input-verify
          v-validate="'required|min:8|requireOneNumeric|confirmed:confirmPassword'"
          v-model="currentUser.verifyPassword"
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
              class="icon" />
            <div class="tooltip">
              <role-desc-pop />
            </div>
          </span>
        </div>
        <default-select 
          v-model="currentUser.roleId"
          :option-list="roleOptions"
          class="input"
        />
      </div>
    </writing-dialog>

    <decide-dialog
      v-if="isShowDeleteAccount"
      :title="$t('userManagement.confirmDeleteAccountText')"
      :type="'delete'"
      :btn-text="$t('button.remove')"
      :is-processing="isProcessing"
      @closeDialog="closeDeleteAccount"
      @confirmBtn="deleteAccount"
    />

    <fill-dialog
      v-if="isShowCreateUser"
      :is-processing="isProcessing"
      class="fill-dialog"
      @closeDialog="closeCreateUser"
      @confirmBtn="createUsers"
    >
      <div class="form new-invitee">
        <div class="form-labels">
          <span class="label-invitee-email">{{ $t('editing.inviteeEmail') }}</span>
          <span class="label-user-role-authority">
            {{ $t('userManagement.userRoleAuthority') }}
            <span class="tooltip-container">
              <svg-icon 
                icon-class="information-circle" 
                class="icon" />
              <div class="tooltip">
                <role-desc-pop />
              </div>
            </span>
          </span>
        </div>
        <div 
          v-for="(invitee, index) in inviteeList"
          :key="invitee.id"
          class="form-item">
          <input-verify
            v-validate="'required|email'"
            v-model="invitee.email"
            :placeholder="$t('userManagement.inviteeEmailPlaceholder')"
            :name="'invitee' + '-' + invitee.id"
            type="email"
          />
          <default-select 
            v-model="invitee.roleId"
            :option-list="roleOptions"
            class="input"
          />
          <a
            v-if="inviteeList.length > 1"
            href="javascript:void(0)"
            class="link remove"
            @click="removeInvitee(index)"
          >
            {{ $t('button.remove') }}
          </a>
        </div>
        <button
          class="btn btn-m btn-outline"
          @click="addNewInvitee()"
        >
          <svg-icon 
            icon-class="plus" 
            class="icon" />{{ $t('button.add') }}
        </button>
      </div>
    </fill-dialog>
  </div>
</template>
<script>
import { getAccountUsers, deleteUserAccount, inviteUser, getAccountRoles, updateRole, getSelfInfo, updateUser } from '@/API/User'
import { getAccountInfo } from '@/API/Account'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import FillDialog from '@/components/dialog/FillDialog'
import DefaultSelect from '@/components/select/DefaultSelect'
import RoleDescPop from '@/pages/userManagement/components/RoleDescPop'
import CrudTable from '@/components/table/CrudTable'
import { Message } from 'element-ui'
let inviteeId = 0

export default {
  inject: ['$validator'],
  name: 'UserManagement',
  components: {
    DecideDialog,
    WritingDialog,
    FillDialog,
    InputVerify,
    DefaultSelect,
    RoleDescPop,
    CrudTable
  },
  data () {
    return {
      roleOptions: [],
      isShowCreateUser: false,
      inviteeList: [],
      userInfo: {
        username: '',
        email: '',
        password: ''
      },
      userData: [],
      isShowPasswordChange: false,
      isShowChangeRole: false,
      isShowDeleteAccount: false,
      currentId: '',
      currentUser: {
        active: null,
        username: '',
        role: '',
        roleId: null,
        password: '',
        verifyPassword: ''
      },
      selfUser: {
        roleId: null
      },
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
          sort: true,
          width: '35%'
        },
        {
          text: this.$t('userManagement.userRoleAuthority'),
          value: 'roleZhName',
          width: '35%',
          tooltip: {
            width: '212px'
          }
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '30%'
        }
      ]
    }
  },
  computed: {
    hasRepetitiveInvitee () {
      let hasRepetitive = this.inviteeList
        .map(invitee => invitee.email)
        .filter((email, index, array) => array.indexOf(email) !== index)
      return hasRepetitive.length > 0
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
        this.reachUserLimit = license.currentUser >= license.maxUser
        this.$store.commit('userManagement/setLicenseCurrentUser', license.currentUser)
      })
    },
    getSelfInfo () {
      getSelfInfo().then(response => {
        this.selfUser = this.userData.filter(user => user.id === response.id)[0]
      })
    },
    btnDisabled (user) { // 待改善
      if (this.selfUser.role === 'account_maintainer' && user.role === 'account_owner') {
        return true
      } else if (this.selfUser.id === user.id) {
        return true
      }
      return false
    },
    isNotAllowChangePsd (user) {
      return this.selfUser.role !== 'account_owner'
    },
    showCreateUser () {
      this.addNewInvitee()
      this.isShowCreateUser = true
    },
    closeCreateUser () {
      this.isShowCreateUser = false
      this.inviteeList = []
    },
    createUsers () {
      this.$validator.validateAll().then(result => {
        if (!result) return

        let existingUsers = this.checkExistingUsers()
        if (existingUsers.size > 0) {
          const html = [...existingUsers].join(',<br>')
          Message({
            message: html + ',<br>' + this.$t('message.userAlreadyExisting'),
            dangerouslyUseHTMLString: true,
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        if (this.hasRepetitiveInvitee) {
          Message({
            message: this.$t('message.userInviteRepetitive'),
            type: 'warning',
            duration: 3 * 1000
          })
          return
        }
        this.isProcessing = true
        inviteUser({
          emailList: this.inviteeList.map(invitee => {
            return {
              accountRole: invitee.roleId,
              groupId: 1, // 暫定預設 1 為 default group
              mail: invitee.email
            }
          }),
          webURL: window.location.origin + this.$router.resolve({name: 'PageSignup'}).href,
          accountId: this.$store.getters['userManagement/getCurrentAccountId']
        })
          .then(() => {
            this.isShowCreateUser = false
            this.inviteeList = []
            this.getUserList()
            Message({
              message: this.$t('message.userInviteSuccess'),
              type: 'success',
              duration: 3 * 1000
            })
          })
          .catch(() => {})
          .finally(() => {
            this.isProcessing = false
          })
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
              roleZhName: this.$t(`userManagement.${this.toCamelCase(user.role)}`)
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
                name: this.getZhRoleName(role.name)
              }
            })
        })
        .catch(() => {})
    },
    changeRole () {
      this.isProcessing = true
      updateRole({
        accountId: this.$store.getters['userManagement/getCurrentAccountId'],
        newRole: this.currentUser.roleId,
        userId: this.currentId
      })
        .then(response => {
          this.closeChangeRole()
          this.getUserList()
          Message({
            message: this.$t('message.changeStatusSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
        .catch(error => {
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    changePassword () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isProcessing = true
          updateUser({
            active: this.currentUser.active,
            password: this.currentUser.password,
            userId: this.currentId,
            username: this.currentUser.name,
            accountId: this.$store.getters['userManagement/getCurrentAccountId']
          })
            .then(response => {
              this.closePasswordChange()
              this.getUserList()
              Message({
                message: this.$t('message.changePasswordSuccess'),
                type: 'success',
                duration: 3 * 1000
              })
            })
            .catch(error => {
            })
            .finally(() => {
              this.isProcessing = false
            })
        }
      })
    },
    deleteAccount () {
      this.isProcessing = true
      deleteUserAccount(
        this.$store.getters['userManagement/getCurrentAccountId'],
        this.currentId
      )
        .then(response => {
          this.closeDeleteAccount()
          this.getUserList()
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
          this.checkIfReachUserLimit()
        })
        .catch(() => {})
        .finally(() => {
          this.isProcessing = false
        })
    },
    showPasswordChange (user, hasPermission) {
      if (!hasPermission) return
      this.currentId = user.id
      this.currentUser.username = user.name
      this.currentUser.active = user.active
      this.isShowPasswordChange = true
    },
    closePasswordChange () {
      // 關閉 component 後，才清空資料，以免在 function 中觸發 validate 導致錯誤發生
      this.isShowPasswordChange = false
      this.$nextTick(() => {
        this.currentUser.password = ''
        this.currentUser.verifyPassword = ''
      })
    },
    showChangeRole (user, hasPermission) {
      if (!hasPermission) return

      const option = this.roleOptions.find(option => option.name === this.getZhRoleName(user.role)) || user.role
      this.currentUser.roleId = option.value
      this.currentId = user.id
      this.isShowChangeRole = true
    },
    closeChangeRole () {
      this.isShowChangeRole = false
    },
    showDeleteAccount (user, hasPermission) {
      if (!hasPermission) return

      this.currentId = user.id
      this.isShowDeleteAccount = true
    },
    closeDeleteAccount () {
      this.isShowDeleteAccount = false
    },
    addNewInvitee () {
      this.inviteeList.push({
        id: inviteeId++,
        email: '',
        roleId: this.accountViewerRoleId
      })
    },
    removeInvitee (index) {
      this.inviteeList.splice(index, 1)
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
    toCamelCase (str) {
      return str.replace(/(\w)(_)(\w)/g, (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`)
    },
    getZhRoleName (accountRole) {
      return this.$t(`userManagement.${this.toCamelCase(accountRole)}`)
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
    }
  },
}
</script>
<style lang="scss" scoped>
.user-management {

  .page-title-row {
    margin-bottom: 16px;

    .title {
      margin: 0;
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
  }
  .table-board {
    padding: 24px;
    background: $theme-bg-color;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
  }

  .fill-dialog {
    .form.new-invitee {
      width: 652px;
      padding: 36px 76px;
      .form-labels {
        display: flex;
        margin-bottom: 20px;
        font-size: 14px;
        height: 21px;
        overflow: visible;
        .label-invitee-email {
          flex: 0 0 269px;
        }
        .label-user-role-authority {
          flex: 0 0 168px;
          margin-left: 13px;
          display: flex;
          align-items: center;
        }
      }
      .form-item {
        position: relative;
        font-size: 0;
        .input-verify {
          display: inline-block;
          width: 269px;
        }
        .el-select {
          display: inline-block;
          width: 168px;
          height: 40px;
          border-bottom-color: #fff;
          margin-left: 13px;
          /deep/ .el-input__inner {
            padding-left: 0;
          }
        }
        .remove {
          position: absolute;
          top: 0;
          right: 0;
          line-height: 40px;
        }
      }
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

  /deep/ .dialog-box {
    .dialog-inner-box {
      .label {
        font-size: 13px;
        text-align: left;
        margin-bottom: 8px;
      }
      .dialog-select-input-box {
        margin-bottom: 16px;
        .el-input__inner {
          padding-left: 0;
        }
      }
      .dialog-button-block {
        .btn.dialog-decide-cancel {
          background-color: #2AD2E2;
          border: none;
        }
      }
    }
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
