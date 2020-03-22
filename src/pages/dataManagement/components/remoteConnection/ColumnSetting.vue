<template>
  <div class="column-setting">
    <div class="dialog-title">{{ $t('editing.connectMySQL') }}</div>
    <upload-process-block
      :step="3"
    ></upload-process-block>
    <div class="info-block">
      <div>{{ $t('editing.dataColumn') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ 'test' }}</div>
    </div>
    <div class="dialog-body">
      <div class="data-frame-select-block">
        <label class="select-label">{{ $t('editing.currentDisplayDataFrame') }}</label>
        <default-select
        ></default-select>
      </div>
      <div class="data-table">
        <div class="data-table-row table-head">
          <div class="data-table-cell">{{ $t('editing.columnName') }}</div>
          <div class="data-table-cell">{{ $t('editing.dataType') }}</div>
        </div>
        <div class="data-table-body">
          <div class="data-table-row"
            v-for="n in 20"
            :key="n"
          >
            <div class="data-table-cell">column1</div>
            <div class="data-table-cell">
              <default-select class="data-type-select"
              ></default-select>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          :disabled="isLoading"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-default"
          :disabled="isLoading"
          @click="nextStep"
        >{{isLoading ? $t('button.processing') : $t('button.copyAndBuild')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import UploadProcessBlock from './UploadProcessBlock'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'ColumnSetting',
  components: {
    UploadProcessBlock,
    DefaultSelect
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    cancelFileUpload () {

    },
    nextStep () {
      
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

  .data-table {
    border-radius: 0;

    .data-table-body {
      height: 260px;
    }

    .data-table-cell {
      padding: 9px 0 9px 18px;
    }
  }
}
</style>
<style lang="scss">
.data-type-select {
   .el-input__inner {
     height: 20px;
     line-height: 20px;
     font-size: 14px;
   }
   .el-input__icon {
     line-height: 20px;
   }
 }
</style>
