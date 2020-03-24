<template>
  <div class="remote-connection">
    <div class="dialog-title">{{ $t('editing.connectMySQL') }}</div>
    <upload-process-block
      :step="isLoading ? 2 : 1"
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
          :label="$t('editing.dataSourceName')"
          name="dataSourceName"
          v-model="dataSourceName"
          v-validate="'required'"
        ></input-block>
        <input-block class="dialog-input"
          :label="$t('editing.loginAccount')"
          name="loginAccount"
          v-model="connectInfo.account"
          v-validate="'required'"
        ></input-block>
        <input-block class="dialog-input"
          :label="$t('editing.loginPassword')"
          name="loginPassword"
          v-model="connectInfo.password"
          v-validate="'required'"
        ></input-block>
        <div class="database-type-select-block dialog-input">
          <label for="connectInfo.databaseType"
            class="select-label"
          >{{ $t('editing.databaseType') }}</label>
          <default-select
            name="databaseType"
            v-model="connectInfo.databaseType"
            :option-list="dbOptionList"
            :placeholder="$t('editing.defaultOption')"
            v-validate="'required'"
          ></default-select>
        </div>
        <input-block class="dialog-input"
          label="Schema"
          name="schema"
          v-model="connectInfo.schema"
          v-validate="'required'"
        ></input-block>
        <div class="inline-input-block">
          <input-block class="dialog-input host"
            label="Host"
            name="host"
            v-model="connectInfo.host"
            v-validate="'required'"
          ></input-block>
          <input-block class="dialog-input port"
            label="Port"
            name="port"
            v-model="connectInfo.port"
            v-validate="'required'"
          ></input-block>
        </div>
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
        >{{isLoading ? $t('button.connecting') : $t('button.start')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { testConnection, createDatabaseConnection } from '@/API/RemoteConnection'
import { createDataSource } from '@/API/DataSource'
import InputBlock from '@/components/InputBlock'
import UploadProcessBlock from './UploadProcessBlock'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  inject: ['$validator'],
  name: 'RemoteConnection',
  components: {
    InputBlock,
    UploadProcessBlock,
    DefaultSelect
  },
  data () {
    return {
      isLoading: false,
      dbOptionList: [
        {
          name: 'MSSQL',
          value: 'MSSQL'
        },
        {
          name: 'MYSQL',
          value: 'MYSQL'
        },
        {
          name: 'ORACLE',
          value: 'ORACLE'
        },
        {
          name: 'POSTGRESQL',
          value: 'POSTGRESQL'
        }
      ],
      dataSourceName: null,
      dataSourceId: null,
      connectInfo: {
        account: null,
        databaseType: null,
        host: null,
        name: null,
        password: null,
        port: null,
        schema: null
      }
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

          testConnection(this.connectInfo).then(() => {
            this.createConnection()
          }).catch(() => {
            this.$store.commit('dataManagement/updateConnectionStatus', false)
          })
        }
      })
    },
    createDataSource () {
      return createDataSource(this.dataSourceName).then(response => {
        this.dataSourceId = response.dataSourceId
      })
    },
    createConnection () {
      createDatabaseConnection(this.connectInfo).then(response => {
        this.$store.commit('dataManagement/updateConnectionStatus', true)
      }).catch(() => {
        this.$store.commit('dataManagement/updateConnectionStatus', false)
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
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 16px;
  }
  .input-block-container {
    width: 53.41%;
    margin: 0 auto;
    padding: 48px 0 80px;
  }
  .dialog-input {
    margin-bottom: 36px;
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
  .database-type-select-block {
    position: relative;

    .select-label {
      position: absolute;
      font-size: 13px;
      line-height: 24px;
      top: -24px;
      left: 0;
    }

    & >>> .sy-select {
      width: 100%;
      border-bottom: 1px solid #aaa;
    }
  }

  .inline-input-block {
    width: 100%;
    display: flex;

    .dialog-input {
      margin-bottom: 0;
    }

    .host {
      width: 74.66%;
      margin-right: 16px;
    }
  }
}
</style>
<style lang="scss">
.database-type-select-block {
  .sy-select {
    .el-input__inner {
      padding-left: 0;
    }
  }

  .el-select-dropdown__item {
    padding-left: 0;
  }
}
</style>
