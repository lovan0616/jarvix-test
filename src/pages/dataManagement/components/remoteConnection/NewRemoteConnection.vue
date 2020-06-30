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
        <remote-connection-form
          :data-source-id="dataSourceId"
          :data-source-name="dataSourceName"
          :connect-info="connectInfo"
        />
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
import UploadProcessBlock from './UploadProcessBlock'
import RemoteConnectionForm from './RemoteConnectionForm'

export default {
  inject: ['$validator'],
  name: 'NewRemoteConnection',
  components: {
    UploadProcessBlock,
    RemoteConnectionForm
  },
  data () {
    return {
      isLoading: false,
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
              duration: 3 * 1000
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
    margin-bottom: 33px;

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
  .loading-block {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
}
</style>

