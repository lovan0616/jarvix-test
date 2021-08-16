<template>
  <div class="notifier-container">
    <component
      v-for="(notification, timestamp) in notifications"
      :is="notification.renderedComponent"
      :key="timestamp"
      :timestamp="Number(timestamp)"
      :notification="notification"
      @delete="deleteNotification(notification, timestamp)"
    />
  </div>
</template>

<script>
import DelayNotifier from './DelayNotifier'
import { NOTIFICATION } from '@/schedule/utils/enum'
import { mapState } from 'vuex'

export default {
  name: 'NotifierContainer',
  components: {
    DelayNotifier
  },
  data () {
    return {
      websocketHandler: null,
      delayNotifications: {}
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    notifications () {
      return {
        ...this.delayNotifications
      }
    }
  },
  watch: {
    scheduleProjectId (id) {
      this.closeWebSocketConnection()
      this.createWebSocketConnection()
    }
  },
  mounted () {
    this.createWebSocketConnection()
  },
  destroyed () {
    if (this.websocketHandler) this.closeWebSocketConnection()
  },
  methods: {
    deleteNotification (notification, timestamp) {
      this.$delete(this[`${notification.type}Notifications`], timestamp)
    },
    createWebSocketConnection () {
      const connectionRequestUrl = `wss${window.env.SCHEDULE_API_ROOT_URL.replace('https', '')}websocket/project/${this.scheduleProjectId}`
      this.websocketHandler = new WebSocket(connectionRequestUrl)
      this.websocketHandler.onopen = this.onWebSocketOpen
      this.websocketHandler.onmessage = this.onWebSocketReceiveMessage
      this.websocketHandler.onclose = this.onWebSocketClose
    },
    onWebSocketOpen () {},
    onWebSocketClose () {},
    onWebSocketReceiveMessage ({ data }) {
      const notification = JSON.parse(data)
      const timestampKey = new Date().getTime()
      switch (notification.notifyType) {
        case NOTIFICATION.DELAY:
          this.$set(this.delayNotifications, timestampKey, {
            data: { jobs: notification.data.jobs },
            type: NOTIFICATION.DELAY.toLowerCase(),
            renderedComponent: 'DelayNotifier'
          })
      }
    },
    closeWebSocketConnection () {
      this.websocketHandler.close()
      this.websocketHandler = null
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 24px;
$top: $header-height + $padding;

.notifier-container {
  position: fixed;
  top: $top;
  right: 0;
  z-index: 1000;
  max-height: calc(100vh - #{$top});
  padding-right: $padding;
  overflow: auto;
  width: 478px;
  display: flex;
  flex-direction: column-reverse; // 為了讓通知由新到舊排列
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
