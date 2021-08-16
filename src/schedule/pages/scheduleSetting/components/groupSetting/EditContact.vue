<template>
  <writing-dialog
    :title="$t('schedule.groupSetting.editContact')"
    :button="$t('schedule.setting.change')"
    :is-loading="isProcessing"
    @confirmBtn="confirm"
    @closeDialog="$emit('close', shouldRefetchGroupList)"
  >
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.rolling.name') }}
      </dt>
      <dd class="data-list__detail">
        <input-verify
          v-validate="`required|max:${max}`"
          v-model="editedContactInfo.contactName"
          name="contactName"
        />
      </dd>
    </dl>
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.rolling.group') }}
      </dt>
      <dd class="data-list__detail">
        <default-select
          v-model="editedContactInfo.emailGroupId"
          :options="groupOptions"
          :disabled="isLastDefaultContact"
          name="emailGroupId"
        />
      </dd>
    </dl>
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.rolling.email') }}
      </dt>
      <dd class="data-list__detail">
        {{ editedContactInfo.contactEmail }}
      </dd>
    </dl>
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import { editContact } from '@/schedule/API/Email'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'EditContact',
  components: {
    WritingDialog,
    InputVerify
  },
  props: {
    contactInfo: {
      type: Object,
      default: () => {
        return {
          contactEmail: String,
          contactName: String,
          emailGroupId: Number,
          emailId: Number
        }
      },
      required: true
    },
    groupOptions: {
      type: Array,
      default: () => []
    },
    isLastDefaultContact: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isProcessing: false,
      editedContactInfo: null,
      shouldRefetchGroupList: false
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  mounted () {
    this.editedContactInfo = { ...this.contactInfo }
  },
  methods: {
    confirm () {
      this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return

          this.isProcessing = true
          editContact(this.editedContactInfo)
            .then(() => {
              Message({
                message: this.$t('schedule.groupSetting.successfullyEditContact'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
              this.shouldRefetchGroupList = true
            })
            .catch(() => {})
            .finally(() => {
              this.isProcessing = false
              this.$emit('close', this.shouldRefetchGroupList)
            })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.default-select {
  padding-bottom: 0;
}
</style>
