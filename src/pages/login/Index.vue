<template>
  <page-layout>
    <div class="login-page">
      <h1 class="page-title">
        {{ $t('editing.userLogin') }}
      </h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="login-form">
          <input-block
            v-validate="'required'"
            :label="$t('editing.username')"
            v-model="userInfo.account"
            class="login-input-block"
            name="userName"
            type="email"
          />
          <input-block
            v-validate="'required'"
            :label="$t('editing.password')"
            v-model="userInfo.password"
            class="login-input-block"
            name="userPassword"
            type="password"
          />
        </div>
        <button
          :disabled="isSubmit"
          type="submit"
          class="btn btn-default btn-submit"
        >
          {{ $t('button.login') }}
        </button>
        <a
          v-if="isSmtpConnected"
          href="/forget-password"
          class="link"
        >{{ $t('forgetPassword.title') }}</a>
      </form>
    </div>
  </page-layout>
</template>
<script>
import { login } from '@/API/User'
import InputBlock from '@/components/InputBlock'
import PageLayout from '@/components/layout/PageLayout'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

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
  computed: {
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
    ...mapState('userManagement', ['isAdmin']),
    ...mapState('setting', ['isSmtpConnected'])
  },
  methods: {
    ...mapActions('userManagement', ['getUserInfo']),
    ...mapMutations('setting', ['updateTokenTimestamp']),
    async submitForm () {
      const result = this.$validator.validateAll()
      if (!result) return

      this.isSubmit = true

      try {
        const { accessToken } = await login({
          email: this.userInfo.account,
          password: this.userInfo.password
        })

        this.updateTokenTimestamp(Date.now())
        localStorage.setItem('token', accessToken)
        await this.getUserInfo()
        // 判斷是否為 Admin
        if (this.isAdmin) {
          await this.$router.push({ name: 'PageAdmin' })
          return
        }

        // 取得前一次停留或拜訪的資訊
        const currentRoute = this.$store.state.setting.currentRoute
        const dataSourceId = this.$store.state.dataSource.dataSourceId

        if (!this.getCurrentGroupId) {
          this.$store.commit('dataSource/setDataSourceList', [])
          this.$store.dispatch('dataSource/handleEmptyDataSource')
        }

        // 用戶若因 token 失效需重新登入，使用先前已選擇的 id 取得相關資料
        if (this.getCurrentGroupId && dataSourceId) {
          const dataFrameId = this.$store.state.dataSource.dataFrameId
          this.$store.dispatch('dataSource/getDataSourceList', { dataSourceId, dataFrameId })
        }

        // 用戶若因 token 失效需重新登入，登入後導回原頁面
        if (currentRoute && currentRoute.path && currentRoute.path !== '/') {
          const { name, query, params } = currentRoute
          // 因無帳戶或專案權限導致 token 失效的情境，登入後 url 掛回預設的帳戶或專案
          params.account_id = this.getCurrentAccountId
          params.group_id = this.getCurrentGroupId
          await this.$router.push({ name, query, params })
          return
        }

        // 沒有群組時導向引導頁面
        if (!this.getCurrentGroupId) {
          await this.$router.push({
            name: 'PageGrouplessGuidance',
            params: { account_id: this.getCurrentAccountId }
          })
          return
        }

        this.$router.push({
          name: 'PageIndex',
          params: {
            account_id: this.getCurrentAccountId,
            group_id: this.getCurrentGroupId
          }
        })
      } catch (error) {
        this.isSubmit = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  margin: 0 auto;
  width: 360px;

  .page-title {
    margin-bottom: 32px;
    margin-top: 0;
  }

  .login-form {
    background-color: var(--color-bg-5);
    border-radius: 8px;
    padding: 40px;
    text-align: left;

    .login-input-block {
      &:not(:last-child) {
        margin-bottom: 52px;
      }
    }
  }

  .btn-submit {
    border: none;
    border-radius: 4px;
    margin-bottom: 24px;
    margin-top: 32px;
    width: 120px;
  }

  .link {
    display: block;
  }
}
</style>
