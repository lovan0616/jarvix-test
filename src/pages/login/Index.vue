<template>
  <page-layout>
    <div class="login-page">
      <h1 class="page-title">使用者登入</h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="input-block">
          <label class="input-label" for="user_name">帳號</label>
          <input type="text" name="user_name" required
            v-model="userInfo.account"
          />
        </div>
        <div class="input-block last">
          <label class="input-label" for="password">密碼</label>
          <input type="password" name="password" required
            v-model="userInfo.password"
          />
        </div>
        <button type="submit" class="btn btn-submit">登入</button>
      </form>
    </div>
  </page-layout>
</template>
<script>
import axios from 'axios'
import PageLayout from '@/components/layout/PageLayout'
export default {
  name: 'PageLogin',
  components: {
    PageLayout
  },
  data () {
    return {
      userInfo: {
        account: null,
        password: null
      }
    }
  },
  methods: {
    submitForm () {
      const path = window.env.API_ROOT_URL + 'api/login'
      axios.post(path, {
        user_name: this.userInfo.account,
        password: this.userInfo.password
      })
        .then(res => {
          console.log(res.headers['set-cookie'], document.cookie)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  width: 360px;

  .page-title {
    margin: 120px 0 64px;
  }

  .input-block {
    text-align: left;
    margin-bottom: 16px;

    &.last {
      margin-bottom: 3px;
    }

    .input-label {
      display: block;
      margin-bottom: 4px;
      font-weight: bold;
    }

    input {
      width: 100%;
      height: 40px;
    }
  }
  .btn-submit {
    width: 120px;
    height: 40px;
    background-color: #0F9696;
    color: #fff;
    margin-top: 32px;
    border: none;
    border-radius: 4px;
  }
}
</style>
