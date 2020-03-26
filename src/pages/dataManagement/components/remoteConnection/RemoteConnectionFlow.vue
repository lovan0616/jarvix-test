<template>
  <div class="remote-connection-flow">
    <transition name="fade" mode="out-in">
      <choose-connection
        v-if="step === 0"
        :data-source-id="dataSourceId"
        @skip="nextStep"
        @next="connectEstablish"
      ></choose-connection>
      <remote-connection
        v-if="step === 1"
        @updateDataSource="setDataSource"
        @next="connectEstablish"
      ></remote-connection>
      <choose-table
        v-if="step === 2"
        @next="tableChosen"
      ></choose-table>
      <column-setting
        v-if="step === 3"
        :connection-id="connectionId"
        :table-id-list="tableIdList"
        @next="nextStep"
      ></column-setting>
      <remote-connection-finished
        v-if="step === 4"
        :table-id-list="tableIdList"
      ></remote-connection-finished>
    </transition>
  </div>
</template>
<script>
import ChooseConnection from './ChooseConnection'
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
      status: null
    }
  },
  mounted () {
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
    nextStep () {
      this.step += 1
    }
  }
}
</script>
