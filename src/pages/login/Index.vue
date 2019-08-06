<template>
  <page-layout>
    <div class="login-page">
      <h1 class="page-title">使用者登入</h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="login-form">
          <input-block class="login-input-block"
            label="帐号"
            name="userName"
            v-model="userInfo.account"
            v-validate="'required'"
          ></input-block>
          <input-block class="login-input-block"
            label="密码"
            name="userPassword"
            type="password"
            v-model="userInfo.password"
            v-validate="'required'"
          ></input-block>
        </div>
        <button type="submit" class="btn btn-default btn-submit">登入</button>
      </form>
    </div>
  </page-layout>
</template>
<script>
import { login } from '@/API/User'
import InputBlock from '@/components/InputBlock'
import PageLayout from '@/components/layout/PageLayout'
export default {
  inject: ['$validator'],
  name: 'PageLogin',
  components: {
    PageLayout,
    InputBlock
  },
  data () {
    return {
      userInfo: {
        account: null,
        password: null
      }
    }
  },
  mounted () {
    this.$store.commit('updateChatRoomStatus', false)
  },
  methods: {
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          login({
            user_name: this.userInfo.account,
            password: this.userInfo.password
          })
            .then(res => {
              localStorage.setItem('token', res.user.token)
              this.$router.push('/kyc')
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  width: 360px;
  margin: 0 auto;

  .page-title {
    margin-top: 0;
    margin-bottom: 32px;
  }

  .login-form {
    text-align: left;
    background-color: $theme-bg-color;
    padding: 40px;
    border-radius: 8px;

    .login-input-block {
      &:not(:last-child) {
        margin-bottom: 40px;
      }
    }
  }

  .btn-submit {
    width: 120px;
    margin-top: 32px;
    border: none;
    border-radius: 4px;
  }
}
</style>
