<template>
  <div class="remote-connection-finished file-upload-finished">
    <div class="dialog-title">{{ $t('editing.buildFinish') }}</div>
    <div class="finished-img-block">
      <img 
        :src="require(`@/assets/images/success.gif`)" 
        :alt="$t('editing.connectSuccess')" 
        class="finished-img">
      <div class="finished-file-info">{{ $t('editing.buildStatus', {total: tableIdList.length, success: successConnectionList.length, fail: failConnectionList.length}) }}</div>
    </div>
    <!-- TODO 跟 upload 做整併 -->
    <connection-list-block
      v-if="successConnectionList.length > 0"
      :title="$t('editing.buildSuccess')"
      :connection-list="successConnectionList"
    />
    <connection-list-block
      v-if="failConnectionList.length > 0"
      :title="$t('editing.buildFail')"
      :connection-list="failConnectionList"
    />
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-default"
          @click="closeFileUploadDialog"
        >{{ $t('button.finish') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import ConnectionListBlock from './ConnectionListBlock'

export default {
  name: 'RemoteConnectionFinished',
  components: {
    ConnectionListBlock
  },
  props: {
    tableIdList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    successConnectionList () {
      return this.tableIdList.filter(element => element.connectionStatus === 'success')
    },
    failConnectionList () {
      return this.tableIdList.filter(element => element.connectionStatus === 'fail')
    }
  },
  methods: {
    closeFileUploadDialog () {
      // 為了觸發重新撈取資料
      this.$store.commit('dataManagement/updateFileUploadSuccess', true)
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  },
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 18px;
  }
  .finished-img-block {
    text-align: center;
    color: #00C9DC;
    margin-bottom: 24px;
  }
  .finished-img {
    width: 80px;
    margin-bottom: 18px;
  }
  .finished-file-info {
    line-height: 20px;
  }
}
</style>
