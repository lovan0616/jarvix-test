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
              // 取得前一次停留或拜訪的頁面
              const currentRoute = this.$store.state.setting.currentRoute
              const dataSourceId = this.$store.state.dataSource.dataSourceId
              // 用戶若因 token 失效需重新登入，使用先前已選擇的 id 取得相關資料
              if (dataSourceId) {
                this.$store.dispatch('dataSource/changeDataSourceById', dataSourceId)
              }
              this.$store.commit('userManagement/setUserInfo', {
                userName: res.name,
                accountList: res.accountList,
                groupList: res.groupList,
                permission: res.groupPermission ? [...res.accountPermission, ...res.groupPermission] : res.accountPermission
              })

              const currentGroupId = this.$store.getters['userManagement/getCurrentGroupId']
              if (!currentGroupId) {
                this.$store.commit('dataSource/setDataSourceList', [])
                return this.$router.push('/')
              }

              this.$store.dispatch('dataSource/getDataSourceList')

              // 用戶若因 token 失效需重新登入，登入後導回原頁面
              if (currentRoute && currentRoute.path) {
                const {name, query, params} = currentRoute
                return this.$router.push({name, query, params})
              } else {
                return this.$router.push('/')
              }
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
