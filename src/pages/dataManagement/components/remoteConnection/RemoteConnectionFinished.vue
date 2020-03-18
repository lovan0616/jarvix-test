<template>
  <div class="remote-connection-finished file-upload-finished">
    <div class="dialog-title">{{ $t('editing.connectMySQL') }}</div>
      <div class="finished-img-block">
        <img :src="require(`@/assets/images/${statusImg}.svg`)" :alt="$t('editing.connectSuccess')" class="finished-img">
        <div class="finished-file-info">{{ statusTitle }}</div>
      </div>
      <div class="dialog-footer">
        <div class="dialog-button-block">
          <button class="btn btn-outline"
            @click="goBack"
          >{{ $t('button.backToEdit') }}</button>
          <button class="btn btn-default"
            @click="closeFileUploadDialog"
          >{{ $t('button.gotIt') }}</button>
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
        return this.$t('editing.connectSuccess')
      } else {
        return this.$t('editing.connectFailure')
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
