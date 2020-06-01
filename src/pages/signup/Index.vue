<template>
  <page-layout>
    <div class="signup-page">
      <h1 class="page-title">{{ $t('editing.userSignup') }}</h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="signup-form">
          <div class="signup-input-block input-block">
            <div class="input valid">{{ userInfo.email }}</div>
            <label class="placeholder">{{ $t('editing.username') }}</label>
          </div>
          <input-block 
            v-validate="`required|max:${max}|`"
            :label="$t('editing.userTitle')"
            v-model="userInfo.username"
            class="signup-input-block"
            name="userName"
            type="text"
          />
          <input-block 
            v-validate="`required|min:8|max:${max}|requireOneNumeric`"
            ref="confirmPassword"
            :label="$t('editing.setLoginPassword')"
            v-model="userInfo.password"
            class="signup-input-block"
            name="userPassword"
            type="password"
          />
          <input-block 
            v-validate="`required|min:8|max:${max}|requireOneNumeric|confirmed:confirmPassword`"
            :label="$t('editing.confirmPasswordAgain')"
            v-model="userInfo.verifyPassword"
            class="signup-input-block"
            name="verifyPassword"
            type="password"
          />
        </div>
        <button
          :disabled="isProcessing"
          class="btn btn-default btn-submit"
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
        groupId: null,
        accountRoleId: null
      },
      isProcessing: false
    }
  },
  computed: {
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
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
          this.userInfo.accountRoleId = res.accountRole
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
  },
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
