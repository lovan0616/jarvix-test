<template>
  <writing-dialog
    v-if="isBoundedWithNotification"
    :title="$t('schedule.groupSetting.deleteGroup')"
    :button="$t('schedule.button.confirm')"
    :is-loading="isProcessing"
    @confirmBtn="confirm"
    @closeDialog="$emit('close', shouldRefetchGroupList)"
  >
    <div class="dialog-content">
      <div>{{ $t('schedule.groupSetting.deleteTargetedGroupContent', { emailGroupName: groupInfo.emailGroupName, defaultEmailGroupName }) }}</div>
      <div class="dialog-content__data">
        <div>
          <dl class="data-list">
            <dt class="data-list__title">
              {{ $t('schedule.notification.type') }}：
            </dt>
            <dd class="data-list__data highlight">
              {{ displayedBoundedNotifications }}
            </dd>
          </dl>
          <dl class="data-list">
            <dt class="data-list__title">
              {{ $t('schedule.groupSetting.currentCorrespondingGroup') }}：
            </dt>
            <dd class="data-list__data">
              <span class="highlight">{{ groupInfo.emailGroupName }}</span>
              <svg-icon icon-class="arrow-right" />
              <span class="highlight">{{ defaultEmailGroupName }}</span>
            </dd>
          </dl>
        </div>
        <div class="reminder">
          <i class="el-icon-warning-outline" />
          {{ $t('schedule.groupSetting.deleteTargetedGroupReminder') }}
        </div>
      </div>
    </div>
  </writing-dialog>
  <decide-dialog
    v-else
    :content="$t('schedule.groupSetting.deleteGroupReminder')"
    :btn-text="$t('schedule.button.confirm')"
    :is-processing="isProcessing"
    type="confirm"
    @confirmBtn="confirm"
    @closeDialog="$emit('close', shouldRefetchGroupList)"
  />
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import DecideDialog from '@/components/dialog/DecideDialog'
import { deleteGroup } from '@/schedule/API/Email'
import { Message } from 'element-ui'

export default {
  name: 'DeleteGroup',
  components: {
    WritingDialog,
    DecideDialog
  },
  props: {
    groupInfo: {
      type: Object,
      default: () => {}
    },
    defaultEmailGroupName: {
      type: String,
      default: 'Default'
    },
    notificationSetting: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      shouldRefetchGroupList: false,
      isProcessing: false
    }
  },
  computed: {
    boundedNotifications () {
      return this.notificationSetting
        .reduce((acc, cur) => {
          if (cur.emailGroupId === this.groupInfo.emailGroupId && cur.isActive) {
            acc.push(cur.alertEvent)
          }
          return acc
        }, [])
    },
    isBoundedWithNotification () {
      return this.boundedNotifications.length > 0
    },
    displayedBoundedNotifications () {
      return this.isBoundedWithNotification
        ? this.boundedNotifications.reduce((acc, cur) => {
          return acc.concat(this.$t(`schedule.notification.${cur.toLowerCase()}`) + ' ')
        }, '')
        : null
    }
  },
  methods: {
    confirm () {
      if (this.isProcessing) return

      this.isProcessing = true
      deleteGroup(this.groupInfo.emailGroupId)
        .then(() => {
          Message({
            message: '成功刪除群組',
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.shouldRefetchGroupList = true
          this.$emit('updateShouldRefetchBackStageSetting', true)
          this.$emit('close', this.shouldRefetchGroupList)
        })
        .catch(() => {})
        .finally(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  text-align: center;
  margin: 20px 0;
  &__data {
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    margin-top: 24px;
    width: fit-content;
    .data-list {
      display: flex;
      margin: 0;
      &__data {
        margin: 0 0 8px 0;
      }
    }
    .reminder {
      font-size: 14px;
      color: #AAA;
    }
  }
  .highlight {
    color: $theme-color-warning;
  }
}
</style>
