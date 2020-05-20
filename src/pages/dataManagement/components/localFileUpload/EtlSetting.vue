<template>
  <div class="etl-setting">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
    ></upload-process-block>
    <div class="info-block">
      <div>{{ $t('editing.dataFrameContent') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <etl-choose-column
        v-if="step === 'choose-column'"
        @advance="step = 'column-setting'"
      >
      </etl-choose-column>
      <etl-column-setting
        v-else
        @back="step = 'choose-column'"
      >
      </etl-column-setting>
    </div>
    <div class="dialog-footer" v-if="step === 'choose-column'">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="prev"
        >{{ $t('button.prevStep') }}</button>
        <button class="btn btn-default"
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
import EtlColumnSetting from '../etl/EtlColumnSetting'
import { Message } from 'element-ui'

export default {
  name: 'EtlSetting',
  components: {
    UploadProcessBlock,
    EtlChooseColumn,
    EtlColumnSetting
  },
  data () {
    return {
      step: 'choose-column'
    }
  },
  methods: {
    prev () {
      // 將所選表格恢復成預設值
      if (this.currentTableIndex !== 0) {
        this.$store.commit('dataManagement/changeCurrentTableIndex', 0)
      }
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
    },
    buildData () {
      let promiseList = []
      this.etlTableList.forEach((element, index) => {
        promiseList.push(dataSourcePreprocessor(element))
      })

      Promise.all(promiseList)
        .then(() => {
          // 全部資料表都設置成功才進入 ConfirmPage 結束導入流程
          this.$emit('next')
        })
        .catch(() => {
          // 若有資料表補值失敗 publicRequest 將跳出錯誤訊息
          Message({
            message: this.$t('message.analysisFailed'),
            type: 'error',
            duration: 3 * 1000
          })
        })
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
    }
  }
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
