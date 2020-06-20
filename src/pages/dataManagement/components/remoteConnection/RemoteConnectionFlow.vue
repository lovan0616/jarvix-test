<template>
  <div class="remote-connection-flow">
    <transition 
      name="fade" 
      mode="out-in">
      <choose-connection
        v-if="step === 0"
        @skip="nextStep"
        @edit="editConnection"
        @next="connectEstablish"
      />
      <new-remote-connection
        v-if="step === 1 && !isOldConnection"
        @updateDataSource="setDataSource"
        @prev="prevStep"
        @next="connectEstablish"
      />
      <edit-remote-connection
        v-if="step === 1 && isOldConnection"
        :connect-info="connectInfo"
        @prev="editPrevStep"
        @next="connectDatabase"
      />
      <choose-table
        v-if="step === 2"
        :connection-id="connectionId"
        @prev="chooseAgain"
        @next="tableChosen"
      />
      <column-setting
        v-if="step === 3"
        :connection-id="connectionId"
        :table-id-list="tableIdList"
        @prev="prevStep"
        @next="nextStep"
      />
      <remote-connection-finished
        v-if="step === 4"
        :table-id-list="tableIdList"
      />
    </transition>
  </div>
</template>
<script>
import ChooseConnection from './ChooseConnection'
import RemoteConnection from './RemoteConnection'
import NewRemoteConnection from './NewRemoteConnection'
import EditRemoteConnection from './EditRemoteConnection'
import RemoteConnectionFinished from './RemoteConnectionFinished'
import ChooseTable from './ChooseTable'
import ColumnSetting from './ColumnSetting'

export default {
  name: 'RemoteConnectionFlow',
  components: {
    RemoteConnection,
    NewRemoteConnection,
    EditRemoteConnection,
    RemoteConnectionFinished,
    ChooseTable,
    ColumnSetting,
    ChooseConnection
  },
  data () {
    return {
      dataSourceId: this.$route.params ? parseInt(this.$route.params.id) : null,
      step: 0,
      // 連線 ID
      connectionId: null,
      // 要複製的 table id 列表
      tableIdList: [],
      status: null,
      isOldConnection: false,
      connectInfo: {}
    }
  },
  created () {
    this.step = this.dataSourceId ? 0 : 1
  },
  methods: {
    setDataSource (value) {
      this.dataSourceId = value
    },
    connectEstablish (value) {
      this.connectionId = value
      this.step = 2
    },
    tableChosen (value) {
      this.tableIdList = value
      this.nextStep()
    },
    connectDatabase (value) {
      this.connectionId = value
      this.tableChosen(value)
    },
    nextStep () {
      this.step += 1
    },
    chooseAgain () {
      this.step = 0
    },
    prevStep () {
      this.step -= 1
    },
    editPrevStep () {
      this.prevStep()
      this.isOldConnection = false
    },
    editConnection (connection) {
      this.connectInfo = connection
      this.isOldConnection = true
      this.nextStep()
    }
  }
}
</script>
<style lang="scss" scoped>
.remote-connection-flow {
  margin-bottom: 64px;
}
</style>
