<template>
  <page-layout>
    <div class="login-page">
      <h1 class="page-title">{{ $t('editing.userLogin') }}</h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="login-form">
          <input-block class="login-input-block"
            :label="$t('editing.username')"
            name="userName"
            type="email"
            v-model="userInfo.account"
            v-validate="'required'"
          ></input-block>
          <input-block class="login-input-block"
            :label="$t('editing.password')"
            name="userPassword"
            type="password"
            v-model="userInfo.password"
            v-validate="'required'"
          ></input-block>
        </div>
        <button type="submit" class="btn btn-default btn-submit"
          :disabled="isSubmit"
        >{{ $t('button.login') }}</button>
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
      },
      isSubmit: false
    }
  },
  mounted () {
    this.$store.commit('chatBot/clearConversation')
  },
  methods: {
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isSubmit = true
          login({
            email: this.userInfo.account,
            password: this.userInfo.password
          })
            .then(res => {
              localStorage.setItem('token', res.accessToken)
              // TODO: 保留使用者因 token 失效重新登入前的頁面資料與狀態
              const dataSourceId = this.$store.state.dataSource.dataSourceId
              // 用戶若因 token 失效需重新登入，使用先前已選擇的 id 取得相關資料
              if (dataSourceId) {
                this.$store.dispatch('dataSource/changeDataSourceById', dataSourceId)
              }
              this.$router.push('/')
            }).catch(() => {
              this.isSubmit = false
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
        margin-bottom: 52px;
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
