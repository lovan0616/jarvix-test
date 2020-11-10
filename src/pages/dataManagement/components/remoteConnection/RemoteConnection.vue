<template>
  <div class="remote-connection">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="isLoading ? 2 : 1"
    />
    <div class="dialog-body">
      <spinner 
        v-if="isLoading"
        :title="$t('editing.DBconnecting')"
        class="loading-block"
        size="50"
      />
      <form 
        v-else
        class="input-block-container"
      >
        <div class="title-block-container">
          <div class="block-title">{{ $t('etl.newConnectionSetting') }}</div>
          <button 
            class="btn-m btn-outline"
            @click.prevent="prevStep"
          >{{ $t('etl.connectionHistory') }}</button>
        </div>
        <!-- 為了避免瀏覽器自動帶入 -->
        <input 
          name="account" 
          type="text" 
          class="hidden-input">
        <input 
          name="password" 
          type="password" 
          class="hidden-input">
        <input-block 
          v-validate="`required|max:${max}`"
          v-if="!dataSourceId"
          :label="$t('editing.dataSourceName')"
          v-model="dataSourceName"
          class="dialog-input"
          name="dataSourceName"
        />
        <input-block 
          v-validate="`required|max:${max}`"
          :label="$t('editing.connectionName')"
          v-model="connectInfo.name"
          class="dialog-input"
          name="connectionName"
        />
        <input-block 
          v-validate="'required'"
          :label="$t('editing.loginAccount')"
          v-model="connectInfo.account"
          class="dialog-input"
          name="account"
        />
        <input-block 
          v-validate="'required'"
          :label="$t('editing.loginPassword')"
          v-model="connectInfo.password"
          class="dialog-input"
          type="password"
          name="loginPwd"
        />
        <div class="database-type-select-block dialog-input">
          <label 
            for="connectInfo.databaseType"
            class="select-label"
          >{{ $t('editing.databaseType') }}</label>
          <default-select
            v-validate="'required'"
            v-model="connectInfo.databaseType"
            :option-list="dbOptionList"
            :placeholder="$t('editing.defaultOption')"
            name="databaseType"
          />
        </div>
        <input-block 
          v-validate="'required'"
          v-model="connectInfo.database"
          class="dialog-input"
          label="Database"
          name="database"
        />
        <input-block 
          v-validate="'max:128'"
          v-model="connectInfo.schema"
          class="dialog-input"
          label="Schema"
          name="schema"
        />
        <div class="inline-input-block">
          <input-block 
            v-validate="'required'"
            v-model="connectInfo.host"
            class="dialog-input host"
            label="Host"
            name="host"
          />
          <input-block 
            v-validate="'required'"
            v-model="connectInfo.port"
            class="dialog-input port"
            label="Port"
            name="port"
          />
        </div>
      </form>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isLoading"
          class="btn btn-default"
          @click="nextStep"
        >{{ isLoading ? $t('button.connecting') : $t('button.nextStep') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { testConnection, createDatabaseConnection } from '@/API/RemoteConnection'
import { createDataSource } from '@/API/DataSource'
import { Message } from 'element-ui'
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
          name: 'POSTGRESQL',
          value: 'POSTGRESQL'
        },
        {
          name: 'ORACLE',
          value: 'ORACLE'
        },
        {
          name: 'MySQL',
          value: 'MySQL'
        }
      ],
      dataSourceId: this.$route.params ? parseInt(this.$route.params.id) : null,
      dataSourceName: null,
      connectInfo: {
        account: null,
        databaseType: null,
        host: null,
        name: null,
        password: null,
        port: null,
        database: null,
        schema: null
      }
    }
  },
  computed: {
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      this.$emit('prev')
    },
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isLoading = true

          testConnection(this.connectInfo).then(() => {
            this.dataSourceId ? this.createConnection() : this.createDataSource()
          }).catch(() => {
            Message({
              message: this.$t('message.connectionFail'),
              type: 'error',
              duration: 3 * 1000,
              showClose: true
            })
            this.isLoading = false
          })
        }
      })
    },
    createDataSource () {
      return createDataSource({
        name: this.dataSourceName,
        groupId: this.currentGroupId
      }).then(response => {
        this.dataSourceId = response.dataSourceId

        this.$emit('updateDataSource', this.dataSourceId)

        this.createConnection()
      }).catch(() => {
        this.isLoading = false
      })
    },
    createConnection () {
      createDatabaseConnection({
        groupId: this.currentGroupId,
        ...this.connectInfo
      }).then(response => {
        this.$emit('next', response)
      }).catch(() => {
        this.isLoading = false
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.remote-connection {
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 16px;
  }
  .title-block-container {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .block-title {
      font-weight: 600;
      font-size: 18px;
      margin-right: 16px;
    }
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
    justify-content: center;
    align-items: center;
    height: 50vh;
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

  .hidden-input {
    display: block;
    opacity: 0;
    height: 0;
    padding: 0;
    border: 0;
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
}
.remote-connection {
  .input-block .error-text {
    right: 0;
  }
}
</style>
