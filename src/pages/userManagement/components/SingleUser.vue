<template>
    <div class="single-user">
        <div class="single-row single-nav">
            <div class="single-item">使用者名稱</div>
            <div class="single-item">使用者帳號</div>
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
            <div class="single-item">{{user.uid}}</div>
            <div v-if="user.active === true" class="single-item single-status">開啟</div>
            <div v-else-if="user.active === false" class="single-item single-status single-status-close">關閉</div>
            <div class="single-item">
                <span @click="isShowPassword = true" class="single-manipulate-item single-manipulate-col">密碼變更</span>
                <span @click="isShowEditName = true" class="single-manipulate-item single-manipulate-col">編輯名稱</span>
                <span @click="isShowStatusChange = true" class="single-manipulate-item single-manipulate-col">關閉</span>
                <span @click="isShowDeleteAccount = true" class="single-manipulate-item">刪除</span>
            </div>
        </div>

    <select-dialog
      v-if="isShowPassword"
      title="密碼變更"
      button="建立"
      @closeDialog="isShowPassword = false"
      @confirmBtn="createPassword"
      :showBoth="true"
    >
        <div class="dialog-select-input-box">
            <input class="dialog-select-input" type="text" placeholder="原密碼">
            <input class="dialog-select-input" type="text" placeholder="新密碼">
            <input class="dialog-select-input" type="text" placeholder="確認新密碼">
        </div>
    </select-dialog>

    <select-dialog
      v-if="isShowEditName"
      title="編輯名稱"
      button="儲存"
      @closeDialog="isShowEditName = false"
      @confirmBtn="editName"
      :showBoth="true"
    >
        <div class="dialog-select-input-box">
            <input class="dialog-select-input" type="text" placeholder="">
        </div>
    </select-dialog>

    <decide-dialog
      v-if="isShowStatusChange"
      title="關閉 王大明 將無法正常登入，確定關閉？"
      :type="'logout'"
      @closeDialog="isShowStatusChange = false"
      @confirmBtn="changeStatus"
    >
    </decide-dialog>

    <decide-dialog
      v-if="isShowDeleteAccount"
      title="您確定要刪除 王大明 ？"
      :type="'delete'"
      @closeDialog="isShowDeleteAccount = false"
      @confirmBtn="deleteAccount"
    >
    </decide-dialog>

    </div>
</template>
<script>
import { users } from '@/API/User'
import DecideDialog from '@/components/dialog/DecideDialog'
import SelectDialog from '@/components/dialog/SelectDialog'

export default {
  name: 'SingleUser',
  components: {
    DecideDialog,
    SelectDialog
  },
  data () {
    return {
      userData: [
        {name: 'frank', uid: 'frankID', active: true},
        {name: 'jimmy', uid: 'jimmyID', active: false},
        {name: 'shark', uid: 'sharkID', active: true}
      ],
      isShowPassword: false,
      isShowEditName: false,
      isShowStatusChange: false,
      isShowDeleteAccount: false
    }
  },
  mounted () {
    getUsers(
    )
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    createPassword () {

    },
    editName () {

    },
    changeStatus () {

    },
    deleteAccount () {

    }
  },
  computed: {

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

        .single-status {
            flex-grow: 0.7;
        }

        .single-status-close {
            color: #FF5C46;
        }

        .single-manipulate-item {
            color: #4DE2F0;
            text-decoration: underline;
            padding: 0px 10px;
            cursor: pointer;
        }

        .single-manipulate-col {
            border-right: 1px solid;
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
