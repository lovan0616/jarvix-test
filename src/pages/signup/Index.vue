<template>
  <page-layout>
    <div class="signup-page">
      <h1 class="page-title">{{ $t('editing.userSignup') }}</h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="signup-form">
          <div class="signup-input-block input-block">
            <div class="input valid">{{userInfo.userName}}</div>
            <label class="placeholder">{{ $t('editing.username') }}</label>
          </div>
          <input-block class="signup-input-block"
            :label="$t('editing.userTitle')"
            name="userName"
            type="text"
            v-model="userInfo.userTitle"
            v-validate="'required'"
          />
          <input-block class="signup-input-block"
            :label="$t('editing.setLoginPassword')"
            name="userPassword"
            type="password"
            v-model="userInfo.password"
            v-validate="'required|min:8|requireOneNumeric'"
            ref="confirmPassword"
          />
          <input-block class="signup-input-block"
            :label="$t('editing.confirmPasswordAgain')"
            name="verifyPassword"
            type="password"
            v-model="userInfo.verifyPassword"
            v-validate="'required|min:8|requireOneNumeric|confirmed:confirmPassword'"
          />
        </div>
        <button
          class="btn btn-default btn-submit"
          :disabled="isProcessing"
        >
          {{ $t('button.confirmSignup') }}
        </button>
      </form>
    </div>
  </page-layout>
</template>
<script>
import { signup, mailConfirm } from '@/API/User'
import PageLayout from '@/components/layout/PageLayout'
import InputBlock from '@/components/InputBlock'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  components: {
    PageLayout,
    InputBlock
  },
  data () {
    return {
      userInfo: {
        userName: null,
        userTitle: null,
        password: null,
        verifyPassword: null
      },
      isProcessing: false,
      accountId: null
    }
  },
  created () {
    // retrieve email token for validation
    const emailToken = this.$route.query.emailToken
    if (!emailToken) {
      this.$router.push({name: 'PageLogin'})
      return Message({
        message: this.$t('errorMessage.lackOfSignUpToken'),
        type: 'error',
        duration: 3 * 1000
      })
    }
    this.confirmEmailToken(emailToken)
  },
  methods: {
    confirmEmailToken (emailToken) {
      mailConfirm({emailToken})
        .then(res => {
          this.userInfo.userName = res.email
          this.accountId = res.accountId
        })
        .catch(() => {
          this.$router.push({name: 'PageLogin'})
          Message({
            message: this.$t('errorMessage.authFail'),
            type: 'error',
            duration: 3 * 1000
          })
        })
    },
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        signup({
          email: this.userInfo.userName,
          username: this.userInfo.userTitle,
          password: this.userInfo.password
        })
          .then(() => { this.$router.push({name: 'PageLogin'}) })
          .catch(() => { this.isProcessing = false })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.signup-page {
  width: 360px;
  margin: 0 auto;

  .page-title {
    margin-top: 0;
    margin-bottom: 32px;
  }

  .signup-form {
    text-align: left;
    background-color: $theme-bg-color;
    padding: 28px;
    border-radius: 5px;

    .signup-input-block {
      &:not(:last-child) {
        margin-bottom: 37px;
      }

      &:first-of-type {
        margin-top: 28px;
      }
    }
  }

  .btn-submit {
    width: 88px;
    margin-top: 16px;
    border: none;
    border-radius: 4px;
  }
}
</style>
