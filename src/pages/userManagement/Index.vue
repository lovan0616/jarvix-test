<template>
  <div class="user-management">
    <div @click="showCreateUser" class="user-add">
      <svg-icon icon-class="user" class="icon"></svg-icon>
      {{ $t('editing.createUser') }}
    </div>
    <div v-if="userData.length === 0" class="user-default">{{ $t('editing.notYetCreateUser') }}</div>
    <div v-else class="single-user">
      <div class="user-table-head">
        <div @click="sortUserData" class="user-item user-sort">
          {{ $t('editing.userAccount') }}
          <svg-icon icon-class="arrow-down" :class="['icon', {'user-rotate': sortStatus === 'up'}]"></svg-icon>
        </div>
        <div class="user-item">{{ $t('editing.userTitle') }}</div>
        <div class="user-item">{{ $t('editing.group') }}</div>
        <div class="user-item">{{ $t('editing.activeStatus') }}</div>
        <div class="user-item">{{ $t('editing.role') }}</div>
        <div class="user-item">{{ $t('editing.action') }}</div>
      </div>
      <div class="user-table-body">
        <div
          v-for="(user, index) in userData"
          :key="index"
          class="user-row-child"
        >
          <div class="user-item">{{user.email}}</div>
          <div class="user-item">{{user.name}}</div>
          <div class="user-item">{{groupName(user.groupList)}}</div>
          <div class="user-item" :class="{'user-status-close': !user.active}">
            {{ user.active ? $t('editing.active') : $t('editing.close') }}
          </div>
          <div class="user-item">
            <default-select class="role-select"
              :value="user.permissionActive"
              :option-list="roleList"
              @input="setUserRole(user, user.id)"
            ></default-select>
          </div>
          <div class="user-item">
            <span @click="showPassword(user.id)" class="user-manipulate-item">{{ $t('editing.changePassword') }}</span>
            <span class="user-line"></span>
            <span @click="showEditName(user)" class="user-manipulate-item">{{ $t('editing.editingName') }}</span>
            <span class="user-line"></span>
            <span @click="showStatusChange(user)" class="user-manipulate-item">
              {{ user.active ? $t('editing.close') : $t('editing.active') }}
            </span>
            <!-- <span class="user-line"></span>
            <span @click="showDeleteAccount(user.id)" class="user-manipulate-item">刪除</span> -->
          </div>
        </div>
      </div>

      <writing-dialog
        v-if="isShowPassword"
        :title="$t('editing.changePassword')"
        :button="$t('button.built')"
        @closeDialog="closePassword"
        @confirmBtn="changePassword"
        :showBoth="true"
      >
        <div class="dialog-select-input-box">
          <!-- <input class="dialog-select-input" type="text" placeholder="原密碼"> -->
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
        v-if="isShowEditName"
        :title="$t('editing.editingName')"
        :button="$t('button.save')"
        @closeDialog="closeEditName"
        @confirmBtn="editName"
        :showBoth="true"
      >
        <div class="dialog-select-input-box">
          <input-verify
            v-model="currentUser.username"
            type="text"
            :placeholder="currentUser.username"
            name="editUserName"
            v-validate="'required'"
          >
          </input-verify>
        </div>
      </writing-dialog>

      <decide-dialog
        v-if="isShowStatusChange"
        :title="statusChangeConfirmTitle()"
        :type="'confirm'"
        :btnText="$t('button.confirm')"
        @closeDialog="closeStatusChange"
        @confirmBtn="changeStatus"
      >
      </decide-dialog>

      <decide-dialog
        v-if="isShowDeleteAccount"
        :title="`${confirmDeleteText} ${currentUser.username} ？`"
        :type="'delete'"
        @closeDialog="closeDeleteAccount"
        @confirmBtn="deleteAccount"
      >
      </decide-dialog>

    </div>
    <fill-dialog
      v-if="isShowCreateUser"
      @closeDialog="closeCreateUser"
      @confirmBtn="createUsers"
      class="fill-dialog"
    >
      <input-verify
        v-for="(invitee, index) in inviteeList"
        :key="invitee.id"
        v-model="invitee.email"
        type="email"
        :placeholder="$t('editing.inviteeEmail')"
        :name="'invitee' + '-' + invitee.id"
        v-validate="'required|email'"
      >
        <template #action>
          <a
            href="javascript:void(0)"
            class="link remove"
            @click="removeInvitee(index)"
            v-if="inviteeList.length > 1"
          >
            {{ $t('button.remove') }}
          </a>
        </template>
      </input-verify>
      <!--TODO: 判定此 account 人數上限-->
      <button
        @click="addNewInvitee()"
        class="btn btn-m btn-outline"
      >
        <svg-icon icon-class="plus" class="icon" />{{ $t('button.add') }}
      </button>
    </fill-dialog>
  </div>
</template>
<script>
import { getUsers, updateUser, deleteUser, inviteUser } from '@/API/User'
import { updateUserPermission } from '@/API/Permission'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import FillDialog from '@/components/dialog/FillDialog'
import DefaultSelect from '@/components/select/DefaultSelect'
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
    DefaultSelect
  },
  data () {
    return {
      isShowCreateUser: false,
      inviteeList: [],
      userInfo: {
        username: '',
        email: '',
        password: ''
      },
      verifyPassword: '',
      userData: [],
      isShowPassword: false,
      isShowEditName: false,
      isShowStatusChange: false,
      isShowDeleteAccount: false,
      currentId: '',
      currentUser: {
        active: true,
        password: '',
        username: '',
        verifyPassword: ''
      },
      sortStatus: 'down',
      confirmDeleteText: this.$t('editing.confirmDelete'),
      closeText: this.$t('editing.close'),
      unableLoginText: this.$t('editing.unableLogin'),
      confirmText: this.$t('editing.confirmActive'),
      accountText: this.$t('editing.username')
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
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
        inviteUser({
          emailList: this.inviteeList.map(invitee => invitee.email),
          webURL: window.location.origin + this.$router.resolve({name: 'PageSignup'}).href
        })
          .then(() => {
            this.isShowCreateUser = false
            this.inviteeList = []
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
      getUsers()
        .then(response => {
          this.userData = []
          this.userData = response
        })
        .catch(error => {
          console.log(error)
        })
    },
    changePassword () {
      this.$validator.validateAll().then(result => {
        if (result) {
          updateUser(
            {password: this.currentUser.password},
            this.currentId
          )
            .then(response => {
              this.closePassword()
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
    editName () {
      this.$validator.validateAll().then(result => {
        if (result) {
          updateUser(
            {username: this.currentUser.username},
            this.currentId
          )
            .then(response => {
              this.closeEditName()
              this.getUserList()
              Message({
                message: this.$t('message.editNameSuccess'),
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
    changeStatus () {
      updateUser(
        {active: this.currentUser.active},
        this.currentId
      )
        .then(response => {
          this.closeStatusChange()
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
    deleteAccount () {
      deleteUser(
        this.currentId
      )
        .then(response => {
          this.closeDeleteAccount()
          this.getUserList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    showPassword (id) {
      this.currentId = id
      this.isShowPassword = true
    },
    closePassword () {
      // 關閉 component 後，才清空資料，以免在 function 中觸發 validate 導致錯誤發生
      this.isShowPassword = false
      this.$nextTick(() => {
        this.currentUser.password = ''
        this.currentUser.verifyPassword = ''
      })
    },
    showEditName (user) {
      this.currentUser.username = user.name
      this.currentId = user.id
      this.isShowEditName = true
    },
    closeEditName () {
      this.isShowEditName = false
    },
    showStatusChange (user) {
      this.currentUser.active = user.active
      this.currentUser.username = user.name
      this.currentUser.active = !this.currentUser.active
      this.currentId = user.id
      this.isShowStatusChange = true
    },
    closeStatusChange () {
      this.isShowStatusChange = false
    },
    showDeleteAccount (id) {
      this.currentId = id
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
        email: ''
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
    setUserRole (user, id) {
      updateUserPermission(id).then(response => {
        user.permissionActive = !user.permissionActive
      })
    }
  },
  computed: {
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
  padding: 24px;
  background: $theme-bg-color;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;

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
      max-height: calc(100vh - 300px);
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
      "2" "userTitle" 190px,
      "3" "group" 280px,
      "4" "activeStatus" 140px,
      "5" "role" 200px,
      "6" "action" 280px;

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
      border-bottom: 1px solid;
      cursor: pointer;

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
    .input-verify {
      .remove {
        position: absolute;
        top: 0;
        right: 0;
        line-height: 40px;
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
