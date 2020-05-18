<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition name="fade" mode="out-in">
        <div class="create-data-source">
            <div class="dialog-title">{{ $t('editing.newData') }}</div>
            <div class="dialog-body">
            <div class="input-block-container">
                <input-block class="file-info-input-block"
                :label="$t('editing.dataSourceName')"
                name="dataSourceName"
                v-model="dataSourceInfo.name"
                v-validate="`required|max:${max}`"
                ></input-block>
            </div>
            </div>
            <div class="dialog-footer">
            <div class="dialog-button-block">
                <button class="btn btn-outline"
                  @click="cancelFileUpload"
                  >{{ $t('button.cancel') }}</button>
                <button class="btn btn-default"
                  :disabled="isProcessing"
                  @click="built"
                  >{{ $t('button.built') }}</button>
            </div>
            </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import InputBlock from '@/components/InputBlock'

export default {
  inject: ['$validator'],
  name: 'CreateDataSourceName',
  components: {
    SySelect,
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
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    built () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        this.dataSourceInfo.groupId = this.currentGroupId
        let confirmResult = new Promise(resolve => this.$emit('confirm', {resolve, dataSourceInfo: this.dataSourceInfo}))
        confirmResult.then(() => {
          this.isProcessing = false
        })
        // this.$emit('confirm', { groupId: this.currentGroupId, name: this.dataSourceInfo.name })
      })
    }
  },
  computed: {
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  }
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
