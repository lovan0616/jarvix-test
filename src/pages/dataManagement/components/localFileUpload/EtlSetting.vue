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
      <!-- TODO 使用 currentColumnInfo 控制元件 show/hide -->
      <etl-choose-column/>
    </div>
    <div 
      v-if="currentColumnIndex === null" 
      class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="prev"
        >{{ $t('button.prevStep') }}</button>
        <button 
          :disabled="isProcessing || !anyColumnSelected"
          class="btn btn-default"
          @click="buildData"
        >{{ $t('button.buildData') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { dataSourcePreprocessor } from '@/API/DataSource'
import UploadProcessBlock from './UploadProcessBlock'
import EtlChooseColumn from '../etl/EtlChooseColumn'

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
    },
    anyColumnSelected () {
      let selected = (column) => column.active
      return this.etlTableList[this.currentTableIndex].columns.some(selected)
    }
  },
  methods: {
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
      this.isProcessing = true

      let promiseList = []
      this.etlTableList.forEach((element, index) => {
        promiseList.push(dataSourcePreprocessor(element))
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
