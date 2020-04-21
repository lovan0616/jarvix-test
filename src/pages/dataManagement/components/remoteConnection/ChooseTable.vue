<template>
  <div class="choose-table">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
    ></upload-process-block>
    <div class="info-block">
      <div>{{ $t('editing.currentLoadedDataFrame') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <spinner class="processing-spinner-container"
        v-if="isLoading"
        :title="$t('editing.loading')"
        size="50"
      ></spinner>
      <empty-info-block
        v-else-if="tableList.length === 0"
        
      ></empty-info-block>
      <div class="data-frame-list"
        v-else
      >
        <label class="single-data-frame"
          v-for="(table, index) in tableList"
          :key="index"
        >
          <div class="checkbox">
            <div class="checkbox-label">
              <input type="checkbox" name="table"
                :value="table"
                v-model="tableIdList"
              >
              <div class="checkbox-square"></div>
            </div>
          </div>
          <div class="data-frame-info">
            <div class="data-frame-name">{{ table }}</div>
            <!-- <div class="data-frame-content">Scene1 content</div> -->
          </div>
        </label>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          :disabled="isLoading"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-outline"
          :disabled="isLoading"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
        <button class="btn btn-default"
          :disabled="isLoading || tableIdList.length === 0"
          @click="nextStep"
        >{{isLoading ? $t('button.processing') : $t('button.nextStep')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getTableList, analyzeTable } from '@/API/RemoteConnection'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import UploadProcessBlock from './UploadProcessBlock'

export default {
  name: 'ChooseTable',
  props: {
    connectionId: {
      type: Number,
      default: null
    }
  },
  components: {
    UploadProcessBlock,
    EmptyInfoBlock
  },
  data () {
    return {
      isLoading: false,
      tableList: [],
      tableIdList: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getTableList(this.connectionId).then(response => {
        this.tableList = response

        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      this.$emit('prev')
    },
    nextStep () {
      this.isLoading = true

      let promiseList = this.tableIdList.map((element, index) => {
        return analyzeTable(this.connectionId, element).then(response => {
          this.$store.commit('dataManagement/updateEtlTableList', response)
        })
      })

      Promise.all(promiseList).then(() => {
        this.isLoading = false
        this.$emit('next', this.tableIdList.map(element => {
          return {
            name: element,
            value: element,
            connectionStatus: null
          }
        }))
      }).catch(() => {
        this.isLoading = false
      })
    }
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-table {
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .data-frame-list, .processing-spinner-container {
    max-height: 48vh;
    overflow: auto;
  }

  .single-data-frame {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 14px 24px;
    background: rgba(67, 76, 76, 0.95);
    border-radius: 5px;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    .checkbox {
      margin-right: 20px;

      .checkbox-label {
        width: 16px;
        height: 16px;
      }

      .checkbox-square:after {
        left: 5px;
      }
    }

    .data-frame-name {
      font-size: 14px;
      font-weight: 600;
      // margin-bottom: 8px;
    }
    .data-frame-content {
      font-size: 13px;
      line-height: 18px;
      color: #ddd;
    }
  }
}
</style>
