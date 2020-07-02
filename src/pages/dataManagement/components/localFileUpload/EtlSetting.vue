<template>
  <div class="etl-setting">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
    />
    <div class="info-block">
      <div>{{ $t('editing.dataFrameContent') }}</div>
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
          @click="prev"
        >{{ $t('button.prevStep') }}</button>
        <button 
          :disabled="isProcessing"
          class="btn btn-default"
          @click="buildData"
        >{{ $t('button.buildData') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { dataPreprocessor } from '@/API/DataSource'
import UploadProcessBlock from './UploadProcessBlock'
import EtlChooseColumn from '../etl/EtlChooseColumn'
import { Message } from 'element-ui'

export default {
  name: 'EtlSetting',
  components: {
    UploadProcessBlock,
    EtlChooseColumn
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
    }
  },
  methods: {
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prev () {
      // 將所選表格恢復成預設值
      if (this.currentTableIndex !== 0) {
        this.$store.commit('dataManagement/changeCurrentTableIndex', 0)
      }
      this.$store.commit('dataManagement/clearEtlTableList')
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
    },
    buildData () {
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
        promiseList.push(dataPreprocessor(element))
      })

      Promise.all(promiseList)
        .then(() => {
          // 全部資料表都設置成功才進入 ConfirmPage 結束導入流程
          this.$emit('next')
        })
        .catch(() => {})
        .finally(() => {
          this.isProcessing = false
        })
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
.etl-setting {
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}
</style>
