<template>
  <writing-dialog
    :title="$t('admin.resetLink')"
    :button="$t('button.copy')"
    :is-loading="isLoading"
    :show-both="true"
    @closeDialog="$emit('close')"
    @confirmBtn="copyLink"
  >
    <spinner
      v-if="isLoading"
    />
    <textarea
      v-else
      ref="link"
      :value="resetPasswordLink"
      class="reset-paswork-link-block"
      readonly/>
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import { createChangePasswordLink } from '@/API/Admin'
import { Message } from 'element-ui'
import { copyToClickBoard } from '@/utils/general'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'ResetPasswordInfoDialog',
  components: {
    WritingDialog
  },
  props: {
    userId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      resetPasswordLink: 'https://beta.link.sis.ai?token=123123124jhklhklhkhlghjghjkghjgjgjgjgjkhgjhgjhgjhkgjkhg',
      isLoading: false
    }
  },
  mounted () {
    this.getResetPasswordLink()
  },
  methods: {
    getResetPasswordLink () {
      this.isLoading = true
      createChangePasswordLink(this.userId).then(response => {
        this.resetPasswordLink = response
      }).finally(() => {
        this.isLoading = false
      })
    },
    copyLink () {
      copyToClickBoard(this.$refs.link)

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
    },
    langOnSelected (item) {
      this.selectedLanguage = item
    },
  }
}
</script>
<style lang="scss" scoped>
.reset-paswork-link-block {
  width: 100%;
  height: 180px;
  background-color: rgba(50, 58, 58, 0.95);
  padding: 24px;
  color: #DDDDDD;
  font-size: 14px;
  border-radius: 5px;
  margin: 16px 0;
  line-height: 20px;
}
</style>