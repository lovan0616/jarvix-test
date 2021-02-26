<template>
  <page-layout>
    <div class="forget-pwd-page">
      <h1 class="page-title">{{ $t('resetPassword.title') }}</h1>
      <form
        @submit.prevent="submitForm"
      >

        <div class="form">
          <input-block
            v-validate="'required|min:8|requireOneNumeric'"
            ref="confirmPassword"
            :label="$t('resetPassword.newPassword')"
            :disabled="isSubmit"
            v-model="userInfo.newPassword"
            class="input-block"
            name="newPassword"
            type="password"
          />
          <input-block
            v-validate="'required|min:8|requireOneNumeric|confirmed:confirmPassword'"
            :label="$t('resetPassword.confirmNewPassword')"
            :disabled="isSubmit"
            v-model="confirmNewPassword"
            class="input-block"
            name="confirmNewPassword"
            type="password"
          />
        </div>
        <button 
          :disabled="isSubmit" 
          type="submit"
          class="btn btn-default btn-submit"
        >{{ $t('button.send') }}</button>
        <router-link
          :to="{ name: 'PageLogin' }"
          class="link"
        >{{ $t('link.backToLogin') }}</router-link>
      </form>
    </div>
  </page-layout>
</template>
<script>
import { resetPassword } from '@/API/User'
import InputBlock from '@/components/InputBlock'
import PageLayout from '@/components/layout/PageLayout'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'PageResetPassword',
  components: {
    PageLayout,
    InputBlock
  },
  data () {
    return {
      userInfo: {
        newPassword: null,
        emailToken: null
      },
      confirmNewPassword: null,
      isSubmit: false
    }
  },
  mounted () {
    this.checkToken()
  },
  methods: {
    checkToken () {
      const routeToken = this.$route.query.token
      if (!routeToken) this.$router.push('/login')
      this.userInfo.emailToken = routeToken
    },
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isSubmit = true
          resetPassword(this.userInfo)
            .then(() => {
              Message({
                message: this.$t('message.changePasswordSuccess'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
              window.setTimeout(() => {
                this.$router.push('/login')
              }, 500)
            })
            .finally(() => this.isSubmit = false)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.forget-pwd-page {
  width: 360px;
  margin: 0 auto;

  .page-title {
    margin-top: 0;
    margin-bottom: 32px;
  }

  .form {
    text-align: left;
    background-color: var(--color-bg-5);
    padding: 40px;
    border-radius: 8px;

    &-info {
      font-size: 14px;
      margin-bottom: 36px;
    }

    .input-block {
      &:not(:last-child) {
        margin-bottom: 52px;
      }
    }
  }

  .btn-submit {
    width: 120px;
    margin-top: 32px;
    margin-bottom: 24px;
    border: none;
    border-radius: 4px;
  }

  .link {
    display: block;
  }
}
</style>
