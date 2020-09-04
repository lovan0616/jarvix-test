<template>
  <writing-dialog
    :title="$t('user.changePwd')"
    :button="$t('button.change')"
    :is-loading="isLoading"
    :show-both="true"
    @closeDialog="$emit('closeDialog')"
    @confirmBtn="changePassword"
  >
    <div class="change-pwd-form">
      <input-block
        v-validate="'required'"
        :label="$t('user.oldPassword')"
        v-model="passwordInfo.oldPassword"
        class="pwd-input-block"
        name="oldPassword"
        type="password"
      />
      <input-block
        v-validate="'required|min:8|requireOneNumeric'"
        ref="confirmPassword"
        :label="$t('user.newPassword')"
        v-model="passwordInfo.newPassword"
        class="pwd-input-block"
        name="newPassword"
        type="password"
      />
      <input-block
        v-validate="'required|min:8|requireOneNumeric|confirmed:confirmPassword'"
        :label="$t('user.confirmPassword')"
        v-model="passwordInfo.confirmPassword"
        class="pwd-input-block"
        name="confirmPassword"
        type="password"
      />
    </div>
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputBlock from '@/components/InputBlock'
import { changePassword } from '@/API/User'
import { Message } from 'element-ui'

export default {
  name: 'ChangePwdDialog',
  inject: ['$validator'],
  components: {
    WritingDialog,
    InputBlock
  },
  data () {
    return {
      isLoading: false,
      passwordInfo: {
        newPassword: null,
        oldPassword: null,
        confirmPassword: null
      }
    }
  },
  methods: {
    changePassword () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isLoading = true
          changePassword({
            newPassword: this.passwordInfo.newPassword,
            oldPassword: this.passwordInfo.oldPassword
          }).then(() => {
            Message({
              message: this.$t('message.changePersonalPasswordSuccess'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            setTimeout(() => {
              this.$router.push('/login')
            }, 2000)
          })
            .catch(() => {
              this.isLoading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.change-pwd-form {
  margin-top: 24px;
  margin-bottom: 24px;

  .pwd-input-block {
    /deep/.input-block {
      .error-text {
        bottom: -8px;
      }
      .input:focus ~ .placeholder, .input.valid ~ .placeholder {
        transform: translate3d(0, -16px, 0);
      }
    }
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
}
</style>