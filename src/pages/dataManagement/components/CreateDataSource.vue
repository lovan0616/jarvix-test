<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="create-data-source">
        <div class="dialog-title">{{ $t('editing.newDataSource') }}</div>
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
              @click="cancelBuilt"
            >{{ $t('button.cancel') }}</button>
            <button 
              :disabled="isProcessing"
              class="btn btn-default"
              @click="built"
            >
              <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
              <span v-else>{{ $t('button.built') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InputBlock from '@/components/InputBlock'

export default {
  inject: ['$validator'],
  name: 'CreateDataSource',
  components: {
    InputBlock
  },
  data () {
    return {
      isProcessing: false,
      dataSourceInfo: {
        groupId: null,
        name: null
      }
    }
  },
  computed: {
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  methods: {
    cancelBuilt () {
      this.$emit('close')
    },
    built () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        this.dataSourceInfo.groupId = this.currentGroupId
        this.$emit('confirm', this.dataSourceInfo)
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.create-data-source {
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
