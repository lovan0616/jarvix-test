<template>
  <writing-dialog
    :title="$t('schedule.groupSetting.createContact')"
    :button="$t('schedule.setting.create')"
    :is-loading="isProcessing"
    @confirmBtn="confirm"
    @closeDialog="$emit('close')"
  >
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.rolling.name') }}
      </dt>
      <dd class="data-list__detail">
        <input-verify
          v-validate="`required|max:${max}`"
          v-model="editedContactInfo.contactName"
          :placeholder="$t('schedule.groupSetting.contactName')"
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
          v-validate="'required'"
          v-model="editedContactInfo.emailGroupId"
          :options="groupOptions"
          name="contactGroup"
          @input="$emit('changeGroup', $event)"
        />
      </dd>
    </dl>
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.rolling.email') }}
      </dt>
      <dd class="data-list__detail">
        <default-select
          v-validate="'required'"
          v-model="editedContactInfo.contactEmail"
          :options="availableEmailOptions"
          filterable
          name="contactEmail"
          @input="onSelectEmail"
        />
      </dd>
    </dl>
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import { createContact } from '@/schedule/API/Email'
import { mapState } from 'vuex'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'CreateContact',
  components: {
    WritingDialog,
    InputVerify
  },
  props: {
    groupOptions: {
      type: Array,
      default: () => []
    },
    groupInfo: {
      type: Object,
      default: () => {}
    },
    emailOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isProcessing: false,
      editedContactInfo: {
        contactName: '',
        contactEmail: '',
        emailGroupId: null
      }
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    availableEmailOptions () {
      return this.emailOptions.map(candidate => ({
        ...candidate,
        disabled: !!this.groupInfo.emails.find(selectedContact => selectedContact.contactEmail === candidate.value)
      }))
    }
  },
  mounted () {
    this.editedContactInfo.emailGroupId = this.groupInfo.emailGroupId
  },
  methods: {
    onSelectEmail (selectedEmail) {
      const contact = this.availableEmailOptions.find(item => item.value === selectedEmail)
      this.editedContactInfo.contactName = contact.contactName
    },
    confirm () {
      this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return

          this.isProcessing = true
          createContact(this.editedContactInfo)
            .then(() => {
              Message({
                message: this.$t('schedule.groupSetting.successfullyCreateContact'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
              this.$emit('close', true)
            })
            .catch(() => {})
            .finally(() => this.isProcessing = false)
        })
    }
  }
}
</script>
