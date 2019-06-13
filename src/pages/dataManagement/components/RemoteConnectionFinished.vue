<template>
  <div class="remote-connection-finished file-upload-finished">
    <div class="dialog-title">连接MySQL资料库</div>
      <div class="finished-img-block">
        <img :src="require(`@/assets/images/${statusImg}.svg`)" alt="连线成功" class="finished-img">
        <div class="finished-file-info">{{ statusTitle }}</div>
      </div>
      <div class="dialog-footer">
        <div class="dialog-button-block">
          <button class="btn btn-outline"
            @click="goBack"
          >返回修正</button>
          <button class="btn btn-default"
            @click="closeFileUploadDialog"
          >我知道了</button>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'RemoteConnectionFinished',
  methods: {
    closeFileUploadDialog () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    goBack () {
      this.$store.commit('dataManagement/updateConnectionStatus', null)
    }
  },
  computed: {
    connectionStatus () {
      return this.$store.state.dataManagement.connectionStatus
    },
    statusImg () {
      if (this.connectionStatus) {
        return 'remote-upload-success'
      } else {
        return 'remote-upload-fail'
      }
    },
    statusTitle () {
      if (this.connectionStatus) {
        return '连线成功'
      } else {
        return '连线失败，请检查设定是否正确'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 18px;
  }
  .finished-img-block {
    text-align: center;
    margin-bottom: 84px;
  }
  .finished-img {
    width: 152px;
    margin-bottom: 34px;
  }
  .finished-file-info {
    line-height: 20px;
  }
}
</style>
