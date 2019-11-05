<template>
  <div class="single-user">
    <div class="single-row single-nav">
      <div class="single-item">使用者名稱</div>
      <div @click="sortUserData" class="single-item single-sort">
        使用者帳號
        <svg-icon icon-class="arrow-down" class="icon" :class="{'single-rotate': sortStatus === 'up'}"></svg-icon>
      </div>
      <div class="single-item single-status">啟用狀態</div>
      <div class="single-item">操作</div>
    </div>
    <div
    v-for="(user, index) in userData"
    :key="index"
    class="single-row"
    :class="{'single-row-first-type': index % 2 === 0, 'single-row-second-type': index % 2 === 1}"
    >
      <div class="single-item">{{user.name}}</div>
      <div class="single-item">{{user.email}}</div>
      <div v-if="user.active === true" class="single-item single-status">開啟</div>
      <div v-else-if="user.active === false" class="single-item single-status single-status-close">關閉</div>
      <div class="single-item">
        <span @click="showPassword(user.id)" class="single-manipulate-item">密碼變更</span>
        <span class="single-line"></span>
        <span @click="showEditName(user)" class="single-manipulate-item">編輯名稱</span>
        <span class="single-line"></span>
        <span v-if="user.active === true" @click="showStatusChange(user)" class="single-manipulate-item">關閉</span>
        <span v-if="user.active === false" @click="showStatusChange(user)" class="single-manipulate-item">開啟</span>
        <!-- <span class="single-line"></span>
        <span @click="showDeleteAccount(user.id)" class="single-manipulate-item">刪除</span> -->
      </div>
    </div>

  <writing-dialog
    v-if="isShowPassword"
    title="密碼變更"
    button="建立"
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
        placeholder="新密碼"
      >
      <input
        v-model="currentUser.verifyPassword"
        class="dialog-select-input"
        type="password"
        placeholder="確認新密碼"
      >
    </div>
  </writing-dialog>

  <writing-dialog
    v-if="isShowEditName"
    title="編輯名稱"
    button="儲存"
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
    :title="`關閉 ${currentUser.username} 將無法正常登入，確定關閉？`"
    :type="'confirm'"
    @closeDialog="closeStatusChange"
    @confirmBtn="changeStatus"
  >
  </decide-dialog>

  <decide-dialog
    v-if="isShowDeleteAccount"
    title="您確定要刪除 王大明 ？"
    :type="'delete'"
    @closeDialog="closeDeleteAccount"
    @confirmBtn="deleteAccount"
  >
  </decide-dialog>

  </div>
</template>
<script>
import { getUsers, updateUser, deleteUser } from '@/API/User'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'

export default {
  name: 'SingleUser',
  components: {
    DecideDialog,
    WritingDialog
  },
  data () {
    return {
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
      sortStatus: 'down'
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      getUsers()
        .then(response => {
          this.userData = []
          this.userData = response
          // 小至大排序
          this.ascendingData(this.userData)
          console.log(response)
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
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        alert('請確認新密碼')
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
          console.log(response)
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
          console.log(response)
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
          console.log(response)
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
          return -1
        }
        if (emailA > emailB) {
          return 1
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
          return 1
        }
        if (emailA > emailB) {
          return -1
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
.single-user {

    .single-nav {
        background: rgba(59, 82, 84, 0.8);
        color: #fff;
    }

    .single-row {
        font-size: 14px;
        display: flex;
        padding: 18px 0px 18px 18px;

        .single-item {
            flex: 1;
        }

        .single-sort {
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }

        .single-rotate {
          transform: rotate(180deg);
        }

        .single-status {
            flex-grow: 0.7;
        }

        .single-status-close {
            color: #FF5C46;
        }

        .single-manipulate-item {
            color: #4DE2F0;
            border-bottom: 1px solid;
            cursor: pointer;

            &:hover {
              opacity: 0.8;
            }
        }

        .single-line {
          color: #9DBDBD;
          margin: 0px 10px 0px 8px;
          border-right: 1px solid #9DBDBD;
          font-size: 12px;
        }
    }

    .single-row-first-type {
        background: rgba(35, 61, 64, 0.6);
    }

    .single-row-second-type {
        background: rgba(50, 75, 78, 0.6);
    }
}
</style>
