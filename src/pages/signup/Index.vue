<template>
  <page-layout>
    <div class="signup-page">
      <h1 class="page-title">{{ $t('editing.userSignup') }}</h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="signup-form">
          <div class="signup-input-block input-block">
            <div class="input valid">{{userInfo.email}}</div>
            <label class="placeholder">{{ $t('editing.username') }}</label>
          </div>
          <input-block class="signup-input-block"
            :label="$t('editing.userTitle')"
            name="userName"
            type="text"
            v-model="userInfo.username"
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
        email: null,
        username: null,
        password: null,
        verifyPassword: null,
        accountId: null,
        invitedByUserId: null,
        groupId: null
      },
      isProcessing: false
    }
  },
  created () {
    // retrieve email token for validation
    const emailToken = this.$route.query.token
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
          this.userInfo.email = res.email
          this.userInfo.accountId = res.accountId
          this.userInfo.invitedByUserId = res.invitedByUserId
          this.userInfo.groupId = res.mailData ? res.mailData.groupId : 1 // 暫定預設 1 為 default group
        })
        .catch(() => {
          this.$router.push({name: 'PageLogin'})
        })
    },
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        const {verifyPassword, ...userInfo} = this.userInfo
        signup(userInfo)
          .then(() => {
            this.$router.push({name: 'PageLogin'})
            Message({
              message: this.$t('message.signUpSuccessPleaseLogin'),
              type: 'success',
              duration: 3 * 1000
            })
          })
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

    .signup-input-block.input-block {
      & >>> .error-text {
        right: 0;
      }

      &:not(:last-child) {
        margin-bottom: 37px;
      }

      &:first-of-type {
        margin-top: 28px;
      }
    }
  }

  .btn-submit {
    width: 148px;
    height: 44px;
    margin-top: 16px;
    border: none;
    border-radius: 4px;
  }
}
</style>
