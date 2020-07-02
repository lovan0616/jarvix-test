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
      <etl-column-setting/>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-outline"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
        <button 
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
import { dataPreprocessor } from '@/API/DataSource'
import UploadProcessBlock from './UploadProcessBlock'
import EtlColumnSetting from '../etl/EtlColumnSetting'
import { Message } from 'element-ui'

export default {
  name: 'LocalColumnSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    EtlColumnSetting
  },
  props: {
    tableIdList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isProcessing: false,
      copyTableList: []
    }
  },
  computed: {
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    },
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  },
  methods: {
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      this.$emit('prev')
    },
    nextStep () {
      this.isProcessing = true
      let promiseList = []
      this.etlTableList.forEach((element, index) => {
        promiseList.push(dataPreprocessor(element))
      })

      Promise.all(promiseList)
        .then(() => {
          Message({
            message: this.$t('message.etlSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
          this.$emit('next')
        })
        .catch(err => {
          this.isProcessing = false
        })
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
    padding: 24px;
    margin-bottom: 16px;
  }

  & >>> .sy-select {
    border-bottom: 1px solid #aaa;
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
