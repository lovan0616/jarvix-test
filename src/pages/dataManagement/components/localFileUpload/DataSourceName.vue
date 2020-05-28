<template>
  <div class="choose-file-type">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block/>
    <div class="dialog-body">
      <div class="input-block-container">
        <input-block 
          v-validate="`required|max:${max}`"
          :label="$t('editing.dataSourceName')"
          v-model="dataSourceInfo.name"
          class="file-info-input-block"
          name="dataSourceName"
        />
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-default he"
          @click="nextStep"
        >{{ $t('button.buildData') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import InputBlock from '@/components/InputBlock'
import UploadProcessBlock from './UploadProcessBlock'

export default {
  inject: ['$validator'],
  name: 'DataSourceName',
  components: {
    SySelect,
    InputBlock,
    UploadProcessBlock
  },
  data () {
    return {
      dataSourceInfo: {
        name: null
      }
    }
  },
  computed: {
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$store.commit('dataManagement/updateCurrentUploadDataSourceName', this.dataSourceInfo.name)
          this.$emit('next')
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.choose-file-type {
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    margin-bottom: 16px;
  }

  .input-block-container {
    width: 53.41%;
    margin: 0 auto;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .input-block {
      &:not(:last-child) {
        margin-bottom: 92px;
      }
    }
  }

  .file-info-input-block {
    position: relative;

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
