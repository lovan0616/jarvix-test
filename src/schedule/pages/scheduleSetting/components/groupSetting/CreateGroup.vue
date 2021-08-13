<template>
  <writing-dialog
    :title="$t('schedule.rolling.createGroup')"
    :button="$t('schedule.setting.create')"
    :is-loading="isProcessing"
    @confirmBtn="confirm"
    @closeDialog="$emit('close', shouldRefetchGroupList)"
  >
    <dl class="data-list">
      <dt class="data-list__title">
        {{ $t('schedule.rolling.group') }}
      </dt>
      <dd class="data-list__detail">
        <input-verify
          v-validate="`required|max:${max}`"
          v-model="editedGroupInfo.groupName"
          :placeholder="$t('schedule.rolling.groupName')"
          name="groupName"
        />
      </dd>
    </dl>
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import { createGroup } from '@/schedule/API/Email'
import { mapState } from 'vuex'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'CreateGroup',
  components: {
    WritingDialog,
    InputVerify
  },
  props: {
    groupOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isProcessing: false,
      editedGroupInfo: {
        projectId: null,
        groupName: ''
      },
      shouldRefetchGroupList: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  mounted () {
    this.editedGroupInfo.projectId = this.scheduleProjectId
  },
  methods: {
    confirm () {
      this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return

          const sameNameGroup = this.groupOptions.find(group => group.label === this.editedGroupInfo.groupName)
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
          createGroup(this.editedGroupInfo)
            .then(({ id: newGroupId }) => {
              Message({
                message: this.$t('schedule.groupSetting.successfullyCreateGroup'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
              // 有新增群組的話，回到上層跳窗、上上層後台設定都要重拿 group list
              this.shouldRefetchGroupList = true
              this.$emit('updateShouldRefetchBackStageSetting', true)
              // 記著新增加的群組 id，等下就直接 focus 到它
              this.$emit('createGroup', newGroupId)
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
