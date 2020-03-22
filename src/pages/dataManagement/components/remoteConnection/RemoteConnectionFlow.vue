<template>
  <div class="remote-connection-flow">
    <transition name="fade" mode="out-in">
      <remote-connection
        v-if="connectionStatus === null"
      ></remote-connection>
      <!-- <remote-connection-finished
        v-else
      ></remote-connection-finished> -->
      <!-- <choose-table></choose-table> -->
      <!-- <column-setting></column-setting> -->
    </transition>
  </div>
</template>
<script>
import RemoteConnection from './RemoteConnection'
import RemoteConnectionFinished from './RemoteConnectionFinished'
import ChooseTable from './ChooseTable'
import ColumnSetting from './ColumnSetting'

export default {
  name: 'RemoteConnectionFlow',
  components: {
    RemoteConnection,
    RemoteConnectionFinished,
    ChooseTable,
    ColumnSetting
  },
  computed: {
    connectionStatus () {
      return this.$store.state.dataManagement.connectionStatus
    }
  }
}
</script>
