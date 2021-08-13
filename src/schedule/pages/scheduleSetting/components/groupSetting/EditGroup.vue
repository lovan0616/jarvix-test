<template>
  <writing-dialog
    :button="$t('schedule.setting.change')"
    :is-loading="isProcessing"
    :title="$t('schedule.groupSetting.renameGroup')"
    @confirmBtn="confirm"
    @closeDialog="$emit('close', shouldRefetchGroupList)"
  >
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.groupSetting.oldGroupName') }}
      </dt>
      <dd class="data-list__detail">
        {{ groupInfo.emailGroupName }}
      </dd>
    </dl>
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.groupSetting.newGroupName') }}
      </dt>
      <dd class="data-list__detail">
        <input-verify
          v-validate="`required|max:${max}`"
          v-model="editedGroupInfo.emailGroupName"
          name="emailGroupName"
        />
      </dd>
    </dl>
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import { editGroup } from '@/schedule/API/Email'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'EditGroup',
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
    }
  },
  data () {
    return {
      isProcessing: false,
      editedGroupInfo: {
        emailGroupId: this.groupInfo.emailGroupId,
        emailGroupName: ''
      },
      shouldRefetchGroupList: false
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  mounted () {
    this.editedGroupInfo.emailGroupName = this.groupInfo.emailGroupName
  },
  methods: {
    confirm () {
      this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return

          const sameNameGroup = this.groupOptions.find(group => group.label === this.editedGroupInfo.emailGroupName)
          if (sameNameGroup) {
            Message({
              message: this.$t('schedule.groupSetting.groupNameAlreadyExist', { name: this.editedGroupInfo.groupName }),
              type: 'warning',
              duration: 3 * 1000,
              showClose: true
            })
            return
          }

          this.isProcessing = true
          editGroup(this.editedGroupInfo)
            .then(() => {
              Message({
                message: this.$t('schedule.groupSetting.successfullyRenameGroup'),
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

</style>
