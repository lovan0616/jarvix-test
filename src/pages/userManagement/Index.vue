<template>
  <div class="user-management">
    <div @click="showCreateUser" class="user-add">
      <svg-icon icon-class="user" class="icon"></svg-icon>
      建立使用者
    </div>
    <!-- <div class="user-default">尚未建立使用者</div> -->
    <div class="user-row">
      <SingleUser ref="singleUser"></SingleUser>
    </div>
    <div @click="closeCreateUser" class="full-create-dialog" v-if="isShowCreateUser">
      <h2>建立使用者</h2>
      <div @click.stop class="full-create-dialog-box">
        <input v-model="userData.username" class="dialog-input" type="text" placeholder="使用者名稱">
        <input v-model="userData.email" class="dialog-input" type="text" placeholder="使用者帳號">
        <input v-model="userData.password" class="dialog-input" type="password" placeholder="登入密碼">
        <input v-model="verifyPassword" class="dialog-input" type="password" placeholder="確認密碼">
      </div>
      <div @click.stop class="dialog-btn-row">
        <button @click="closeCreateUser" class="dialog-btn">取消</button>
        <button @click="createSingleUser" class="dialog-btn dialog-create">建立</button>
      </div>
    </div>
  </div>
</template>
<script>
import { createUser } from '@/API/User'
import SingleUser from './components/SingleUser'
export default {
  name: 'UserManagement',
  components: {
    SingleUser
  },
  data () {
    return {
      isShowCreateUser: false,
      userData: {
        username: '',
        email: '',
        password: ''
      },
      verifyPassword: ''
    }
  },
  mounted () {

  },
  methods: {
    showCreateUser () {
      this.isShowCreateUser = true
    },
    closeCreateUser () {
      this.isShowCreateUser = false
    },
    createSingleUser () {
      if (this.userData.password === this.verifyPassword) {
        createUser(
          this.userData
        )
          .then(response => {
            this.isShowCreateUser = false
            this.$refs.singleUser.getUserList()
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        alert('請確認密碼')
      }

    }
  },
  computed: {

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

}
</style>
