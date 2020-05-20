<template>
  <spinner class="spinner-container"
    v-if="isLoading"
    :title="$t('editing.loading')"
    size="50"
  ></spinner>
  <div class="choose-connection"
    v-else
  >
    <div class="dialog-title">{{ $t('editing.chooseConnection') }}</div>
    <div class="dialog-body">
      <div class="connection-list">
        <div class="single-connection"
          v-for="connection in connectionList"
          :key="connection.id"
          @click="chooseConnection(connection.id)"
        >
          <div class="connection-title">{{ connection.name }}</div>
          <div class="conneciton-info-block">
            <div class="conneciton-info">
              <div class="connection-label">{{ $t('editing.databaseType') }}:</div>{{ connection.databaseType }}
            </div>
            <div class="conneciton-info">
              <div class="connection-label">Host:</div>{{ connection.host }}
            </div>
            <div class="conneciton-info">
              <div class="connection-label">Port:</div>{{ connection.port }}
            </div>
            <div class="conneciton-info">
              <div class="connection-label">Schema:</div>{{ connection.schema }}
            </div>
            <div class="conneciton-info">
              <div class="connection-label">Database:</div>{{ connection.database }}
            </div>
            <div class="conneciton-info">
              <div class="connection-label">{{ $t('editing.username') }}:</div>{{ connection.account }}
            </div>
          </div>
        </div>
        <div class="single-connection create-connection"
          @click="createConnection"
        >
          <svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('editing.createConnection') }}
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-outline"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getConnectionInfoList, testOldConnection } from '@/API/RemoteConnection'

export default {
  name: 'ChooseConnection',
  props: {
    dataSourceId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      connectionList: []
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
    }
  },
  computed: {
    groupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-connection {
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .connection-list {
    max-height: 60vh;
    overflow: auto;
  }

  .single-connection {
    border: 2px solid #485454;
    padding: 24px;
    border-radius: 8px;
    cursor: pointer;

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

      .conneciton-info {
        display: flex;
        width: 50%;
      }

      .connection-label {
        width: 40%;
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
