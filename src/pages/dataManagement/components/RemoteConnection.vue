<template>
  <div class="remote-connection">
    <div class="dialog-title">{{ $t('editing.connectMySQL') }}</div>
    <upload-process-block
      :step="isLoading ? 3 : 2"
    ></upload-process-block>
    <div class="dialog-body">
      <div class="loading-block"
        v-if="isLoading"
      >
        <svg-icon icon-class="spinner" class="loading-icon"></svg-icon>
        <div class="loading-text">{{ $t('editing.DBconnecting') }}</div>
      </div>
      <div class="input-block-container"
        v-else
      >
        <input-block class="dialog-input"
          :label="$t('editing.IPaddress')"
          name="dataBase"
          v-model="database"
          v-validate="'required'"
        ></input-block>
        <input-block class="dialog-input"
          :label="$t('editing.username')"
          name="userName"
          v-model="username"
          v-validate="'required'"
        ></input-block>
        <input-block class="dialog-input"
          :label="$t('editing.password')"
          name="password"
          type="password"
          v-model="password"
          v-validate="'required'"
        ></input-block>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          :disabled="isLoading"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-default"
          :disabled="isLoading"
          @click="nextStep"
        >{{isLoading ? $t('button.connecting') : $t('button.connect')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { dbConnect, buildStorage } from '@/API/Storage'
import InputBlock from '@/components/InputBlock'
import UploadProcessBlock from './UploadProcessBlock'

export default {
  inject: ['$validator'],
  name: 'RemoteConnection',
  components: {
    InputBlock,
    UploadProcessBlock
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isLoading = true
          this.$store.commit('dataManagement/updateConnectionType', this.currentUploadInfo.type)
          dbConnect(this.currentUploadInfo.storageId, this.connectionInfo)
            .then(() => {
              buildStorage(this.currentUploadInfo.storageId, this.currentUploadInfo.bookmarkId)
                .then(() => {
                  this.$store.commit('dataManagement/updateConnectionStatus', true)
                })
            })
            .catch(() => {
              this.$store.commit('dataManagement/updateConnectionStatus', false)
            })
        }
      })
    }
  },
  computed: {
    database: {
      get () {
        return this.connectionInfo.database
      },
      set (value) {
        this.$store.commit('dataManagement/updateConnectionDataBase', value)
      }
    },
    username: {
      get () {
        return this.connectionInfo.username
      },
      set (value) {
        this.$store.commit('dataManagement/updateConnectionUserName', value)
      }
    },
    password: {
      get () {
        return this.connectionInfo.password
      },
      set (value) {
        this.$store.commit('dataManagement/updateConnectionPassword', value)
      }
    },
    connectionInfo () {
      return this.$store.state.dataManagement.connectionInfo
    },
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.remote-connection {
  .dialog-body {
    background: #F8F8F8;
    margin-bottom: 16px;
  }
  .input-block-container {
    width: 53.41%;
    margin: 0 auto;
    padding: 48px 0 80px;
  }
  .dialog-input {
    &:not(:last-child) {
      margin-bottom: 68px;
    }
  }
  .loading-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;

    .loading-icon {
      font-size: 65px;
      margin-bottom: 48px;
    }
    .loading-text {
      color: $theme-text-color;
    }
  }
}
</style>
