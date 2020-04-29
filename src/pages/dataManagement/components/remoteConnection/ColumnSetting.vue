<template>
  <div class="column-setting"
    v-if="!isProcessing"
  >
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="4"
    ></upload-process-block>
    <div class="info-block">
      <div>{{ $t('editing.dataColumn') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <etl-column-setting></etl-column-setting>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-outline"
          @click="prevStep"
        >{{ $t('button.prevStep') }}</button>
        <button class="btn btn-default"
          @click="nextStep"
        >{{ $t('button.buildData') }}</button>
      </div>
    </div>
  </div>
  <spinner class="processing-spinner-container"
    v-else
    :title="$t('editing.dataBuilding')"
    size="50"
  ></spinner>
</template>
<script>
import { dataSourcePreprocessor } from '@/API/DataSource'
import UploadProcessBlock from './UploadProcessBlock'
import EtlColumnSetting from '../etl/EtlColumnSetting'

export default {
  name: 'ColumnSetting',
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
      isProcessing: false
    }
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    prevStep () {
      this.$store.commit('dataManagement/clearEtlTableList')
      this.$emit('prev')
    },
    nextStep () {
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
          this.isProcessing = false
        })
        .catch(err => {
          this.isProcessing = false
          console.log(err)
        })
    },
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  },
  computed: {
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    },
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  }
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
