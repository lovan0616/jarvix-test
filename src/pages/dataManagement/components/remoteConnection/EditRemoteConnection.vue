<template>
  <div class="remote-connection">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block />
    <div class="dialog-body">
      <form 
        class="input-block-container"
      >
        <div class="return-block-container">
          <div class="block__arrow" />
          <a
            href="javascript:void(0);" 
            class="link action-link"
            @click.prevent="prevStep"
          >
            {{ $t('etl.returnConnectionHistory') }}
          </a>
        </div>
        <remote-connection-form
          :data-source-id="dataSourceId"
          :connect-info="connectInfo"
          class="remote-connection-form"
        />  
        <div class="dialog-footer">
          <div class="dialog-button-block">
            <button
              :disabled="isProcessing"
              class="btn btn-default"
              @click.prevent="saveConnectionInfo(false)"
            >{{ $t('button.saveAndConnect') }}</button>
            <button 
              :disabled="isProcessing"
              class="btn btn-default"
              @click.prevent="saveConnectionInfo"
            >{{ $t('button.save') }}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { testOldConnection, updateDatabaseConnection } from '@/API/RemoteConnection'
import { Message } from 'element-ui'
import UploadProcessBlock from './UploadProcessBlock'
import RemoteConnectionForm from './RemoteConnectionForm'

export default {
  inject: ['$validator'],
  name: 'EditRemoteConnection',
  components: {
    UploadProcessBlock,
    RemoteConnectionForm
  },
  props: {
    connectInfo: { 
      type: Object,
      default: () => {
        return  {
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
    }
  },
  data () {
    return {
      isProcessing: false,
      dataSourceId: this.$route.params ? parseInt(this.$route.params.id) : null
    }
  },
  computed: {
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  },
  methods: {
    prevStep () {
      this.$emit('prev')
    },
    chooseConnection (id) {
      testOldConnection(id).then(() => {
        this.$emit('next', id)
      }).catch(() => {
        Message({
          message: this.$t('message.connectionFail'),
          type: 'error',
          duration: 3 * 1000
        })
        this.isProcessing = false
      })
    },
    saveConnectionInfo (onlySave=true) {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.isProcessing = true
          const {id, ...connectionInfo} = this.connectInfo
          return updateDatabaseConnection (id, connectionInfo)
            .then (() => {
              Message({
                message: this.$t('message.saveSuccess'),
                type: 'success',
                duration: 3 * 1000
              })
              onlySave ? this.prevStep() : this.chooseConnection(id)
            })
            .catch(() => { 
              this.isProcessing = false
            })
        }
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
  .return-block-container {
    display: flex;
    align-items: center;
    margin-bottom: 33px;

    .block__arrow {
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 1px;
      border-left: 2px solid $button-color;
      border-bottom: 2px solid $button-color;
      transform: rotate(45deg)
    }

    .block__label {
      font-weight: 600;
      font-size: 14px;
      color: $button-color;
      &:hover {
        border-bottom: 2px solid;
      }
    }
  }
  .remote-connection-form {
    margin-bottom: 24px;
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

