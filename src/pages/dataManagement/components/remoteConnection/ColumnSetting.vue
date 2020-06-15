<template>
  <div 
    v-if="!isProcessing"
    class="column-setting"
  >
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="4"
    />
    <div class="info-block">
      <div>{{ $t('editing.dataColumn') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <etl-choose-column/>
    </div>
    <div 
      v-if="currentColumnIndex === null" 
      class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
        <button 
          :disabled="isProcessing"
          class="btn btn-default"
          @click="nextStep"
        >{{ $t('button.buildData') }}</button>
      </div>
    </div>
  </div>
  <spinner 
    v-else
    :title="$t('editing.dataBuilding')"
    class="processing-spinner-container"
    size="50"
  />
</template>
<script>
import { dataSourcePreprocessor } from '@/API/DataSource'
import UploadProcessBlock from './UploadProcessBlock'
import EtlColumnSetting from '../etl/EtlColumnSetting'
import EtlChooseColumn from '../etl/EtlChooseColumn'
import { Message } from 'element-ui'

export default {
  name: 'ColumnSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    EtlColumnSetting,
    EtlChooseColumn
  },
  props: {
    tableIdList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    },
    currentTableIndex () {
      return this.$store.state.dataManagement.currentTableIndex
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    },
    currentColumnIndex () {
      return this.$store.state.dataManagement.currentColumnIndex
    },
    anyColumnSelected () {
      let selected = (column) => column.active
      return this.etlTableList[this.currentTableIndex].columns.some(selected)
    }
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      // 將所選表格恢復成預設值
      this.$store.commit('dataManagement/changeCurrentTableIndex', 0)
      this.$store.commit('dataManagement/clearEtlTableList')
      this.$emit('prev')
    },
    nextStep () {
      if (!this.selectAtLeastOneColumnPerTable()) {
        Message({
          message: this.$t('etl.pleaseSelectAtLeastOneColumnPerTable'),
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      
      this.isProcessing = true
      let promiseList = []
      this.etlTableList.forEach((element, index) => {
        let promise = dataSourcePreprocessor(element).then(response => {
          this.tableIdList[index].connectionStatus = 'success'
        }).catch(() => {
          this.tableIdList[index].connectionStatus = 'fail'
        })
        promiseList.push(promise)
      })

      Promise.all(promiseList)
        .then(() => {
          this.$emit('next')
        })
        .catch(() => {
          Message({
            message: this.$t('message.analysisFailed'),
            type: 'error',
            duration: 3 * 1000
          })
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    selectAtLeastOneColumnPerTable () {
      let result = true
      for (let i = 0; i < this.etlTableList.length; i++) {
        if (!this.etlTableList[i].columns.some(column => column.active)) {
          result = false
          break
        }
      }
      return result
    }
  },
}
</script>
<style lang="scss" scoped>
.column-setting {
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 16px;
  }

  .data-frame-select-block {
    width: 256px;
    margin-bottom: 16px;

    .select-label {
      display: block;
      font-size: 13px;
      line-height: 18px;
    }

    .sy-select {
      width: 100%;
    }
  }

  .spinner-container {
    height: 100%;
  }

  .data-table {
    border-radius: 0;

    .data-table-body {
      height: 260px;

      .empty-info {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .data-table-cell {
      padding: 9px 0 9px 18px;
    }
  }
}
.processing-spinner-container {
  height: 80vh;
}
</style>
