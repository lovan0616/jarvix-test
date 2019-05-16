<template>
  <div class="choose-file-type">
    <div class="dialog-title">新增資料</div>
    <div class="dialog-body">
      <div class="input-block-container">
        <div class="input-block file-type-select-block"
          :class="{'has-error': errors.has('fileTypeSelect')}"
        >
          <sy-select class="file-type-select"
            name="fileTypeSelect"
            :selected="fileInfo.fileType"
            :items="fileTypeList"
            placeholder="選擇資料類型"
            @update:selected="fileTypsChange"
            v-validate="'required'"
          ></sy-select>
          <div class="error-text">請先選擇資料類型</div>
        </div>
        <div class="input-block file-info-input-block"
          :class="{'has-error': errors.has('dataSourceName')}"
        >
          <input type="text" class="input file-source-input"
            name="dataSourceName"
            placeholder="輸入資料源名稱"
            v-validate="'required'"
          >
          <div class="error-text">請先選擇資料類型</div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancelFileUpload"
        >取消</button>
        <button class="btn btn-default"
          @click="nextStep"
        >下一步</button>
      </div>
    </div>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
export default {
  inject: ['$validator'],
  name: 'ChooseFileType',
  components: {
    SySelect
  },
  data () {
    return {
      fileInfo: {
        fileType: null
      },
      fileTypeList: [
        {
          name: 'CSV',
          id: '1'
        }
      ]
    }
  },
  methods: {
    fileTypsChange () {

    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$store.commit('dataManagement/updateFileTypeChosen', true)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-file-type {
  .dialog-body {
    background: #FAFAFA;
    margin-bottom: 16px;
  }

  .input-block-container {
    width: 53.41%;
    margin: 0 auto;
    padding: 52px 0 176px;
  }

  .file-type-select-block {
    position: relative;
    margin-bottom: 92px;
  }

  .file-type-select {
    width: 100%;
  }

  .file-info-input-block {
    position: relative;
    flex: 1;

    .file-source-input {
      height: 40px;
    }
  }

  .upload-input-label {
    position: absolute;
    top: -21px;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.5px;
    color: #979797;
  }
}
</style>
