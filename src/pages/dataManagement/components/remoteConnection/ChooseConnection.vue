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
            v-for="connection in connectionList"
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
              class="conneciton__edit"
              @click="editConnection(connection.id)"
            >
              {{ $t('button.edit') }}
            </a>
            <a
              href="javascript:void(0);"
              class="conneciton__delete"
              @click="deleteConnection(connection.id)"
            >
              <svg-icon icon-class="delete"/>
            </a>
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
import { getConnectionInfoList, testOldConnection } from '@/API/RemoteConnection'
import UploadProcessBlock from './UploadProcessBlock'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'ChooseConnection',
  components: {
    UploadProcessBlock,
    EmptyInfoBlock
  },
  data () {
    return {
      isLoading: false,
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
    deleteConnectionList (id) {

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
    padding: 24px;
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
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
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

    .conneciton__edit {
      position: absolute;
      top: 18px;
      right: 20px;
      font-size: 14px;
      color: $button-color;

      &:hover {
        border-bottom: 1px solid;
      }
    }

    .conneciton__delete {
      position: absolute;
      right: 20px;
      bottom: 20px;
      color: $theme-color-white;
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
