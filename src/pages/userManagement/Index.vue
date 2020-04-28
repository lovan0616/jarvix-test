<template>
  <div class="user-management">
    <div class="page-title-row">
      <div class="bread-crumb">
        {{ $t('sideNav.accountManagement') }}
      </div>
      <h1 class="title">{{ $t('sideNav.accountUserManagement') }}</h1>
    </div>
    <div class="table-board">
      <div @click="showCreateUser" class="user-add">
        <svg-icon icon-class="user" class="icon"></svg-icon>
        {{ $t('userManagement.createUser') }}
      </div>
      <div v-if="userData.length === 0" class="user-default">{{ $t('editing.notYetCreateUser') }}</div>
      <div v-else class="single-user">
        <div class="user-table-head">
          <div @click="sortUserData" class="user-item user-sort">
            {{ $t('editing.userAccount') }}
            <svg-icon icon-class="arrow-down" :class="['icon', {'user-rotate': sortStatus === 'up'}]"></svg-icon>
          </div>
          <div class="user-item">
            {{ $t('userManagement.userRoleAuthority') }}
            <role-desc-pop />
          </div>
          <div class="user-item">{{ $t('editing.action') }}</div>
        </div>
        <div class="user-table-body">
          <div
            v-for="(user, index) in userData"
            :key="index"
            class="user-row-child"
          >
            <div class="user-item">{{user.email}}</div>
            <div class="user-item">{{ $t(`userManagement.${toCamelCase(user.role)}`) }}</div>
            <div class="user-item">
              <button @click="showPasswordChange(user)" :disabled="isNotAllowChangePsd(user)" class="user-manipulate-item">{{ $t('editing.changePassword') }}</button>
              <span class="user-line"></span>
              <button @click="showRoleChange(user)" :disabled="btnDisabled(user)" class="user-manipulate-item">{{ $t('userManagement.updateRole') }}</button>
              <span class="user-line"></span>
              <button @click="showDeleteAccount(user)" :disabled="btnDisabled(user)" class="user-manipulate-item">{{ $t('button.remove') }}</button>
            </div>
          </div>
        </div>

        <writing-dialog
          v-if="isShowPasswordChange"
          :title="$t('editing.changePassword')"
          :button="$t('button.change')"
          @closeDialog="closePasswordChange"
          @confirmBtn="changePassword"
          :showBoth="true"
        >
          <div class="dialog-select-input-box">
            <input-verify
              v-model="currentUser.password"
              type="password"
              :placeholder="$t('editing.newPassword')"
              name="verifyNewPassword"
              v-validate="'required|min:8|requireOneNumeric'"
              ref="confirmPassword"
            >
            </input-verify>
            <input-verify
              v-model="currentUser.verifyPassword"
              type="password"
              :placeholder="$t('editing.confirmNewPassword')"
              name="verifyPasswordCheck"
              v-validate="'required|min:8|requireOneNumeric|confirmed:confirmPassword'"
            >
            </input-verify>
          </div>
        </writing-dialog>

        <writing-dialog
          v-if="isShowRoleChange"
          :title="$t('userManagement.updateRole')"
          :button="$t('button.change')"
          @closeDialog="closeRoleChange"
          @confirmBtn="changeRole"
          :showBoth="true"
        >
          <div class="dialog-select-input-box">
            <div class="label">
              {{ $t('userManagement.userRoleAuthority') }}
              <role-desc-pop />
            </div>
            <default-select class="input"
              v-model="currentUser.roleId"
              :option-list="roleOptions"
            ></default-select>
          </div>
        </writing-dialog>

        <decide-dialog
          v-if="isShowDeleteAccount"
          :title="$t('userManagement.confirmDeleteAccountText')"
          :type="'delete'"
          :btnText="$t('button.remove')"
          @closeDialog="closeDeleteAccount"
          @confirmBtn="deleteAccount"
        >
        </decide-dialog>

      </div>
    </div>
    <fill-dialog
      v-if="isShowCreateUser"
      @closeDialog="closeCreateUser"
      @confirmBtn="createUsers"
      class="fill-dialog"
    >
      <div class="form new-invitee">
        <div class="form-labels">
          <span class="label-invitee-email">{{ $t('editing.inviteeEmail') }}</span>
          <span class="label-user-role-authority">
            {{ $t('userManagement.userRoleAuthority') }}
            <role-desc-pop />
          </span>
        </div>
        <div class="form-item"
          v-for="(invitee, index) in inviteeList"
          :key="invitee.id">
          <input-verify
            v-model="invitee.email"
            type="email"
            :placeholder="$t('userManagement.inviteeEmailPlaceholder')"
            :name="'invitee' + '-' + invitee.id"
            v-validate="'required|email'"
          />
          <default-select class="input"
            v-model="invitee.roleId"
            :option-list="roleOptions"
          ></default-select>
          <a
            href="javascript:void(0)"
            class="link remove"
            @click="removeInvitee(index)"
            v-if="inviteeList.length > 1"
          >
            {{ $t('button.remove') }}
          </a>
        </div>
        <!--TODO: 判定此 account 人數上限-->
        <button
          @click="addNewInvitee()"
          class="btn btn-m btn-outline"
        >
          <svg-icon icon-class="plus" class="icon" />{{ $t('button.add') }}
        </button>
      </div>
    </fill-dialog>
  </div>
</template>
<script>
import { getAccountUsers, deleteUserAccount, inviteUser, getAccountRoles, updateRole, getSelfInfo, updateUser } from '@/API/User'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import FillDialog from '@/components/dialog/FillDialog'
import DefaultSelect from '@/components/select/DefaultSelect'
import RoleDescPop from '@/pages/userManagement/components/RoleDescPop'
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
    RoleDescPop
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
      isShowRoleChange: false,
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
      sortStatus: 'up',
      confirmDeleteText: this.$t('editing.confirmDelete'),
      closeText: this.$t('editing.close'),
      unableLoginText: this.$t('editing.unableLogin'),
      confirmText: this.$t('editing.confirmActive'),
      accountText: this.$t('editing.username')
    }
  },
  mounted () {
    this.getUserList().then(() => {
      this.getSelfInfo()
    })
    this.getAccountRoleList()
  },
  methods: {
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
        if (this.hasRepetitiveInvitee) {
          Message({
            message: this.$t('message.userInviteRepetitive'),
            type: 'warning',
            duration: 3 * 1000
          })
          return
        }
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
          .catch(error => {
            console.log(error)
          })
      })
    },
    getUserList () {
      return getAccountUsers()
        .then(response => {
          this.userData = []
          this.userData = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAccountRoleList () {
      getAccountRoles(this.currentAccountId)
        .then(response => {
          this.roleOptions = []
          this.roleOptions = response
            // 後端一起回傳了非 account role，先擋掉
            .filter(role => role.name.includes('account'))
            .map(role => {
              return {
                value: role.id,
                name: this.getZhRoleName(role.name)
              }
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    changeRole () {
      updateRole({
        accountId: this.$store.getters['userManagement/getCurrentAccountId'],
        newRole: this.currentUser.roleId,
        userId: this.currentId
      })
        .then(response => {
          this.closeRoleChange()
          this.getUserList()
          Message({
            message: this.$t('message.changeStatusSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    changePassword () {
      this.$validator.validateAll().then(result => {
        if (result) {
          updateUser({
            active: this.currentUser.active,
            password: this.currentUser.password,
            userId: this.currentId,
            username: this.currentUser.name
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
              console.log(error)
            })
        }
      })
    },
    deleteAccount () {
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
        })
        .catch(error => {
          console.log(error)
        })
    },
    showPasswordChange (user) {
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
    showRoleChange (user) {
      const option = this.roleOptions.find(option => option.name === this.getZhRoleName(user.role)) || user.role
      this.currentUser.roleId = option.value
      this.currentId = user.id
      this.isShowRoleChange = true
    },
    closeRoleChange () {
      this.isShowRoleChange = false
    },
    showDeleteAccount (user) {
      this.currentId = user.id
      this.isShowDeleteAccount = true
    },
    closeDeleteAccount () {
      this.isShowDeleteAccount = false
    },
    ascendingData (data) {
      data.sort(function (a, b) {
        let emailA = a.email.toUpperCase()
        let emailB = b.email.toUpperCase()
        if (emailA < emailB) {
          return 1
        }
        if (emailA > emailB) {
          return -1
        }

        // names must be equal
        return 0
      })
    },
    decendingData (data) {
      data.sort(function (a, b) {
        let emailA = a.email.toUpperCase()
        let emailB = b.email.toUpperCase()
        if (emailA < emailB) {
          return -1
        }
        if (emailA > emailB) {
          return 1
        }

        // names must be equal
        return 0
      })
    },
    sortUserData () {
      if (this.sortStatus === 'up') {
        this.sortStatus = 'down'
        this.ascendingData(this.userData)
      } else {
        this.sortStatus = 'up'
        this.decendingData(this.userData)
      }
    },
    addNewInvitee () {
      this.inviteeList.push({
        id: inviteeId++,
        email: '',
        roleId: 5 // 選項預設為 viewer 權限
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
  }
}
</script>
<style lang="scss" scoped>
.user-management {

  .page-title-row {
    margin-bottom: 16px;

    .title {
      margin-top: .4rem;
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

  .user-add {
    width: 105px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background: #1EB8C7;
    border-radius: 5px;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .user-default {
    padding: 19px 0px;
    text-align: center;
    color: #ccc;
    background: rgba(35, 61, 64, 0.6);
    border: 1px solid #05282C;
    box-sizing: border-box;
    border-radius: 8px;
  }

  .single-user {

    .user-table-head {
      background: rgba(59, 82, 84, 0.8);
      color: #fff;
      font-size: 14px;
      display: flex;
      padding: 18px 0px 18px 18px;
    }

    .user-table-body {
      overflow-y: auto;
    }

    .user-row-child {
      font-size: 14px;
      display: flex;
      padding: 18px 0px 18px 18px;

      &:nth-child(odd) {
        background: rgba(50, 75, 78, 0.6);
      }

      &:nth-child(even) {
        background: rgba(35, 61, 64, 0.6);
      }
    }

    /* Set column widh */
    $column-width:
      "1" "userAccount" 280px,
      "2" "role" 200px,
      "3" "action" 140px;

    @each $index, $name, $width in $column-width {
      .user-item:nth-of-type(#{$index}) {
        flex: 1 1 $width;
      }
    }

    .user-sort {
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    .user-rotate {
      transform: rotate(180deg);
    }

    // .user-status {
    //   flex: 1;
    //   flex-grow: 0.7;
    // }

    .user-status-close {
      color: #FF5C46;
    }

    .user-manipulate-item {
      color: #4DE2F0;
      cursor: pointer;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid;
      padding-left: 0;
      padding-right: 0;

      &:disabled {
        opacity: 0.15;
        cursor: not-allowed;
        &:hover {
          opacity: 0.15;
        }
      }

      &:hover {
        opacity: 0.8;
      }
    }

    .user-line {
      color: #9DBDBD;
      margin: 0px 10px 0px 8px;
      border-right: 1px solid #9DBDBD;
      font-size: 12px;
    }
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
          .tooltip-thumbnail {
            margin-left: 8px;
          }
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

.tooltip-thumbnail {
  color: $theme-color-warning;
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
