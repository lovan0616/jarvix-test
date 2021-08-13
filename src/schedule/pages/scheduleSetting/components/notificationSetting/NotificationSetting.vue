<template>
  <div class="block__form">
    <div class="notification__description">
      {{ $t('schedule.notification.description') }}
    </div>
    <spinner v-if="isLaoding" />
    <div
      v-else
      class="notification__container"
    >
      <single-notification-row
        v-for="notification in notifications"
        :key="notification.alertEvent"
        :notification="notification"
        :email-group-options="emailGroupOptions"
        @toggleActive="$emit('toggleActive', $event)"
      />
    </div>
  </div>
</template>

<script>
import SingleNotificationRow from './SingleNotificationRow'
import { getContactGroups } from '@/schedule/API/Email'
import { mapState } from 'vuex'

export default {
  name: 'NotificationSetting',
  components: {
    SingleNotificationRow
  },
  props: {
    originalSetting: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isLaoding: true,
      emailGroupOptions: null,
      notifications: null
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId'])
  },
  mounted () {
    this.notifications = { ...this.originalSetting }
    this.fetchContactGroups()
  },
  methods: {
    fetchContactGroups () {
      getContactGroups(this.scheduleProjectId)
        .then(emailGroups => {
          this.emailGroupOptions = emailGroups.map(item => ({ value: item.emailGroupId, label: item.emailGroupName }))
        })
        .finally(() => this.isLaoding = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner-block {
  flex-basis: 100%;
}
::v-deep .notification {
  &__description {
    margin-bottom: 16px;
    flex-basis: 100%;
  }
  &__container {
    flex-basis: 100%;
  }
  &__item {
    display: flex;
    align-items: center;
    gap: 20px;
    background: rgba(35, 61, 64, 0.6);
    border-radius: 8px;
    padding: 24px;
    &-selector {
      padding-bottom: 0;
    }
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
