<template>
  <div class="remote-connection-flow">
    <transition name="fade" mode="out-in">
      <remote-connection
        v-if="connectionStatus === null"
      ></remote-connection>
      <remote-connection-finished
        v-else
      ></remote-connection-finished>
    </transition>
  </div>
</template>
<script>
import RemoteConnection from './RemoteConnection'
import RemoteConnectionFinished from './RemoteConnectionFinished'
export default {
  name: 'RemoteConnectionFlow',
  components: {
    RemoteConnection,
    RemoteConnectionFinished
  },
  computed: {
    connectionStatus () {
      return this.$store.state.dataManagement.connectionStatus
    }
  }
}
</script>
