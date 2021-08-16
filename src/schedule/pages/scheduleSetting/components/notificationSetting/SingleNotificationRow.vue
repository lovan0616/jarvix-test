<template>
  <div class="notification__item">
    <el-switch
      v-model="isActive"
      class="notification__item-switcher"
      @change="toggleActive($event)"
    />
    <div class="notification__item-type">
      {{ $t(`schedule.notification.${notification.alertEvent.toLowerCase()}`) }}
    </div>
    <svg-icon icon-class="go-right" />
    <span>{{ $t('schedule.notification.group') }}</span>
    <default-select
      v-model="notification.emailGroupId"
      :options="emailGroupOptions"
      class="notification__item-selector"
    />
  </div>
</template>

<script>
import { NOTIFICATION } from '@/schedule/utils/enum'

export default {
  name: 'SingleNotificationRow',
  props: {
    notification: {
      type: Object,
      default: () => {}
    },
    emailGroupOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  mounted () {
    this.isActive = this.notification.isActive
  },
  methods: {
    toggleActive (isActive) {
      switch (this.notification.alertEvent) {
        case NOTIFICATION.DELAY:
          this.$emit('toggleActive', {
            isActive,
            alertEvent: NOTIFICATION.DELAY
          })
          break
      }
    }
  }
}
</script>
