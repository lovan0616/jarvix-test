<template>
  <page-layout>
    <div class="forget-pwd-page">
      <h1 class="page-title">{{ $t('forgetPassword.title') }}</h1>
      <form
        @submit.prevent="submitForm"
      >
        <div class="form">
          <input-block
            v-validate="'required'"
            :label="$t('editing.username')"
            v-model="userInfo.account"
            :disabled="isSubmit"
            class="input-block"
            name="userName"
            type="email"
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
import { requestResetPassword } from '@/API/User'
import InputBlock from '@/components/InputBlock'
import PageLayout from '@/components/layout/PageLayout'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'PageForgetPassword',
  components: {
    PageLayout,
    InputBlock
  },
  data () {
    return {
      userInfo: {
        account: null
      },
      isSubmit: false
    }
  },
  methods: {
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isSubmit = true
          requestResetPassword({
            email: this.userInfo.account
          })
            .then(() => {
              Message({
                message: this.$t('message.sendResetPasswordEmail'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
              this.$router.push('/login')
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
