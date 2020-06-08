<template>
  <div class="choose-connection">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="1"
    />
    <div class="info-block">
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="spinner-container"
        size="50"
      />
      <div 
        v-else
        class="connection-list-block"
      >
        <div class="title-block-container">
          <div class="block-title">{{ $t('etl.connectionHistory') }}</div>
          <button 
            class="btn-m btn-outline"
            @click="createConnection"
          >{{ $t('etl.newConnectionSetting') }}</button>
        </div>
        <div class="connection-list">
          <empty-info-block
            v-if="connectionList.length === 0"
            :msg="$t('etl.emptyConnectionHistory')"
          />
          <div 
            v-for="(connection, index) in connectionList"
            v-else
            :key="connection.id"
            class="single-connection"
            @click="chooseConnection(connection.id)"
          >
            <div class="connection-title">{{ connection.name }}</div>
            <div class="conneciton-info-block">
              <div class="conneciton-info">
                <div class="connection-label">{{ $t('editing.loginAccount') }}:</div>{{ connection.account }}
              </div>
              <div class="conneciton-info">
                <div class="connection-label">Schema:</div>{{ connection.schema }}
              </div>
              <div class="conneciton-info">
                <div class="connection-label">{{ $t('editing.databaseType') }}:</div>{{ connection.databaseType }}
              </div>
              <div class="conneciton-info">
                <div class="connection-label">Host:</div>{{ connection.host }}
              </div>
              <div class="conneciton-info">
                <div class="connection-label">Database:</div>{{ connection.database }}
              </div>
              <div class="conneciton-info">
                <div class="connection-label">Port:</div>{{ connection.port }}
              </div>
            </div>
            <a
              href="javascript:void(0);" 
              class="link action-link"
              @click.stop="editConnection(connection)"
            >
              {{ $t('button.edit') }}
            </a>
            <a
              href="javascript:void(0);"
              class="conneciton__delete"
              @click.stop="currentDeleteIndex=index"
            >
              <svg-icon icon-class="delete"/>
            </a>
            <tooltip-dialog
              v-if="index === currentDeleteIndex"
              :msg="$t('editing.toolTipMessage.comfrmToDeleteConnectionHistory')"
              class="tooltip-dialog"
              @cancel="currentDeleteIndex=null"
              @confirm="deleteConnection(index, connection.id)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-outline"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getConnectionInfoList, testOldConnection, deleteDatabaseConnection } from '@/API/RemoteConnection'
import { Message } from 'element-ui'
import UploadProcessBlock from './UploadProcessBlock'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import TooltipDialog from '@/components/dialog/TooltipDialog'

export default {
  name: 'ChooseConnection',
  components: {
    UploadProcessBlock,
    EmptyInfoBlock,
    TooltipDialog
  },
  data () {
    return {
      isLoading: false,
      isEditing: false,
      currentDeleteIndex: null,
      connectionList: []
    }
  },
  computed: {
    groupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getConnectionInfoList(this.groupId).then(response => {
        if (response.length > 0) {
          this.connectionList = response
        } else {
          this.$emit('skip')
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
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
      })
    },
    createConnection () {
      this.$emit('skip')
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      this.$store.commit('dataManagement/updateCurrentUploadDataType', null)
    },
    editConnection (connection) {
      this.$emit('edit', connection)
    },
    deleteConnection (index, connectId) {
      deleteDatabaseConnection(connectId).then(() => {
        this.connectionList.splice(index, 1)
        Message({
          message: this.$t('message.deleteSuccess'),
          type: 'success',
          duration: 3 * 1000
        })
      })
      this.currentDeleteIndex = null
    }
  },
}
</script>
<style lang="scss" scoped>
.choose-connection {
  .dialog-body {
    height: 60vh;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .info-block {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  .connection-list-block {
    width: 62%;
    margin: 0 auto;
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

  .connection-list {
    max-height: calc(60vh - 102px);
    overflow: auto;
  }

  .single-connection {
    border: 2px solid #485454;
    padding: 18px 24px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &:hover {
      background-color: #485454;
      border-color: #2AD2E2;
    }

    .connection-title {
      font-size: 18px;
      font-weight: 600;
      line-height: 25px;
      margin-bottom: 8px;
    }

    .conneciton-info-block {
      display: flex;
      flex-wrap: wrap;
      color: $theme-text-color-light;

      .conneciton-info {
        display: flex;
        width: 50%;
        font-size: 14px;
      }

      .connection-label {
        margin-right: 8px;
        text-align: left;
        font-weight: 600;
      }
    }

    .action-link {
      position: absolute;
      top: 18px;
      right: 20px;
      font-size: 14px;
    }

    .conneciton__delete {
      position: absolute;
      right: 20px;
      bottom: 20px;
      margin-right: 5px;
      color: $theme-color-white;
    }

    .tooltip-dialog {
      right: 12px;
      bottom: 53px;

      &::after {
        content: '';
        position: absolute;
        top: 100%;
        right: 6%;
        border-bottom: 9px solid transparent;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-top: 9px solid #2AD2E2;
      }
    }
  }

  .create-connection {
    text-align: center;

    .icon {
      margin-right: 8px;
    }
  }
}
</style>
