<template>
  <div class="user-management">
    <div @click="showCreateUser" class="user-add">
      <svg-icon icon-class="user" class="icon"></svg-icon>
      {{ $t('editing.createUser') }}
    </div>
    <div v-if="userData.length === 0" class="user-default">{{ $t('editing.notYetCreateUser') }}</div>
    <div v-else class="single-user">
      <div class="user-table-head">
        <div class="user-item">{{ $t('editing.userName') }}</div>
        <div @click="sortUserData" class="user-item user-sort">
          {{ $t('editing.userAccount') }}
          <svg-icon icon-class="arrow-down" :class="['icon', {'user-rotate': sortStatus === 'up'}]"></svg-icon>
        </div>
        <div class="user-item user-status">{{ $t('editing.activeStatus') }}</div>
        <div class="user-item">{{ $t('editing.action') }}</div>
      </div>
      <div class="user-table-body">
        <div
          v-for="(user, index) in userData"
          :key="index"
          class="user-row-child"
        >
          <div class="user-item">{{user.name}}</div>
          <div class="user-item">{{user.email}}</div>
          <div :class="['user-status', {'user-status-close': !user.active}]">
            <template v-if="user.active">{{ $t('editing.active') }}</template>
            <template v-else>{{ $t('editing.close') }}</template>
          </div>
          <div class="user-item">
            <span @click="showPassword(user.id)" class="user-manipulate-item">{{ $t('editing.changePassword') }}</span>
            <span class="user-line"></span>
            <span @click="showEditName(user)" class="user-manipulate-item">{{ $t('editing.editingName') }}</span>
            <span class="user-line"></span>
            <span @click="showStatusChange(user)" class="user-manipulate-item">
              <template v-if="user.active">{{ $t('editing.close') }}</template>
              <template v-else>{{ $t('editing.active') }}</template>
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
          <input
            v-model="currentUser.password"
            class="dialog-select-input"
            type="password"
            :placeholder="$t('editing.newPassword')"
          >
          <input
            v-model="currentUser.verifyPassword"
            class="dialog-select-input"
            type="password"
            :placeholder="$t('editing.confirmNewPassword')"
          >
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
          <input
            v-model="currentUser.username"
            class="dialog-select-input"
            type="text"
            :placeholder="currentUser.username"
          >
        </div>
      </writing-dialog>

      <decide-dialog
        v-if="isShowStatusChange"
        :title="`${closeText} ${currentUser.username} ${unableLoginText}？`"
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
      @confirmBtn="createSingleUser"
    >
      <input v-model="userInfo.username" class="dialog-input" type="text" :placeholder="$t('editing.userName')">
      <input v-model="userInfo.email" class="dialog-input" type="text" :placeholder="$t('editing.userAccount')">
      <input v-model="userInfo.password" class="dialog-input" type="password" :placeholder="$t('editing.loginPassword')">
      <input v-model="verifyPassword" class="dialog-input" type="password" :placeholder="$t('editing.confirmPassword')">
    </fill-dialog>
  </div>
</template>
<script>
import { createUser, getUsers, updateUser, deleteUser } from '@/API/User'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import FillDialog from '@/components/dialog/FillDialog'
export default {
  name: 'UserManagement',
  components: {
    DecideDialog,
    WritingDialog,
    FillDialog
  },
  data () {
    return {
      isShowCreateUser: false,
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
      unableLoginText: this.$t('editing.unableLogin')
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    showCreateUser () {
      this.isShowCreateUser = true
    },
    closeCreateUser () {
      for (let index in this.userInfo) {
        this.userInfo[index] = ''
      }
      this.verifyPassword = ''
      this.isShowCreateUser = false
    },
    createSingleUser () {
      if (this.userInfo.password === this.verifyPassword) {
        createUser(
          this.userInfo
        )
          .then(response => {
            this.isShowCreateUser = false
            this.getUserList()
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        alert(this.$t('editing.pleaseConfirmPassword'))
      }
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
      if (this.currentUser.password === this.currentUser.verifyPassword) {
        updateUser(
          {password: this.currentUser.password},
          this.currentId
        )
          .then(response => {
            this.closePassword()
            this.getUserList()
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        alert(this.$t('editing.pleaseConfirmNewPassword'))
      }
    },
    editName () {
      updateUser(
        {username: this.currentUser.username},
        this.currentId
      )
        .then(response => {
          this.closeEditName()
          this.getUserList()
        })
        .catch(error => {
          console.log(error)
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
      this.currentUser.password = ''
      this.currentUser.verifyPassword = ''
      this.isShowPassword = false
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
    }
  }
}
</script>
<style lang="scss" scoped>
.user-management {
  padding: 24px;
  background: rgba(0, 0, 0, 0.55);
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

    .user-item {
        flex: 1;
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

    .user-status {
      flex: 1;
      flex-grow: 0.7;
    }

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
}

</style>
