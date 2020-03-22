<template>
  <div class="choose-table">
    <div class="dialog-title">{{ $t('editing.connectMySQL') }}</div>
    <upload-process-block
      :step="2"
    ></upload-process-block>
    <div class="info-block">
      <div>{{ $t('editing.currentLoadedDataFrame') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ 'test' }}</div>
    </div>
    <div class="dialog-body">
      <div class="data-frame-list">
        <label class="single-data-frame">
          <div class="checkbox">
            <div class="checkbox-label">
              <input type="checkbox" name=""
              >
              <div class="checkbox-square"></div>
            </div>
          </div>
          <div class="data-frame-info">
            <div class="data-frame-name">Secen1</div>
            <div class="data-frame-content">Scene1 content</div>
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
        <button class="btn btn-default"
          :disabled="isLoading"
          @click="nextStep"
        >{{isLoading ? $t('button.processing') : $t('button.nextStep')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import UploadProcessBlock from './UploadProcessBlock'

export default {
  name: 'ChooseTable',
  components: {
    UploadProcessBlock
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

  .single-data-frame {
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
      margin-bottom: 8px;
    }
    .data-frame-content {
      font-size: 13px;
      line-height: 18px;
      color: #ddd;
    }
  }
}
</style>
