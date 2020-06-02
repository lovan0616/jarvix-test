<template>
  <div class="choose-table">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
    />
    <div class="info-block">
      <div>{{ $t('editing.currentLoadedDataFrame') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="processing-spinner-container"
        size="50"
      />
      <empty-info-block
        v-else-if="tableList.length === 0"
      />
      <div
        v-else
      >
        <div class="remark-info">{{ $t('etl.tableChosenLimit', {number: tableConnectionLimt}) }}</div>
        <input
          v-model="queryWord"
          :placeholder="$t('etl.tableSearch')"
          class="choose-table__search"
          type="text"
        >
        <div
          v-if="filterTableList.length > 0"
          class="data-frame-list">
          <label 
            v-for="(table, index) in filterTableList"
            :key="index"
            class="single-data-frame"
          >
            <div class="checkbox">
              <div class="checkbox-label">
                <input 
                  :id="'table' + index"
                  :value="table"
                  v-model="tableIdList"
                  type="checkbox"
                >
                <div class="checkbox-square"/>
              </div>
            </div>
            <div class="data-frame-info">
              <div class="data-frame-name">{{ table }}</div>
            </div>
          </label>
        </div>
        <empty-info-block
          v-else-if="filterTableList.length === 0"
          :msg="$t('message.emptyResult')"
        />
      </div>

    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancelConnection"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isLoading"
          class="btn btn-outline"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
        <button 
          :disabled="isLoading || tableIdList.length === 0"
          class="btn btn-default"
          @click="nextStep"
        >{{ isLoading ? $t('button.processing') : $t('button.nextStep') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getTableList, analyzeTable } from '@/API/RemoteConnection'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import UploadProcessBlock from './UploadProcessBlock'
import { Message } from 'element-ui'

export default {
  name: 'ChooseTable',
  components: {
    UploadProcessBlock,
    EmptyInfoBlock
  },
  props: {
    connectionId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      tableList: [],
      tableIdList: [],
      filterTableList: [],
      dataSourceId: parseInt(this.$route.params.id),
      tableConnectionLimt: 10,
      queryWord: ''
    }
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  },
  watch: {
    queryWord () {
      if (this.queryWord === '') {
        this.filterTableList = [...this.tableList]
      }
      else {
        this.filterTableList = []
        this.filterTableList = [...this.tableList.filter((element) => element.toLowerCase().split(this.queryWord.toLowerCase()).length > 1)]
      }
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
        this.filterTableList = [...this.tableList]
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    cancelConnection () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      this.$emit('prev')
    },
    nextStep () {
      if (this.tableIdList.length > this.tableConnectionLimt) {
        Message({
          message: this.$t('etl.tableChosenLimit', {number: this.tableConnectionLimt}),
          type: 'warning',
          duration: 3 * 1000
        })
        return false
      }
      this.isLoading = true
      // 先清除，避免有部分成功的情形發生
      this.$store.commit('dataManagement/clearEtlTableList')
      let promiseList = this.tableIdList.map((element, index) => {
        return analyzeTable(this.connectionId, this.currentUploadInfo.dataSourceId, element).then(response => {
          response.dataSourceId = this.dataSourceId
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
    height: 48vh;
    overflow: auto;
  }

  .remark-info {
    font-size: 14px;
    color: #FFDF6F;
    margin-bottom: 8px;
    display: inline-block;
  }

  &__search {
    float: right;
    background: rgba(67, 76, 76, 0.95);
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
