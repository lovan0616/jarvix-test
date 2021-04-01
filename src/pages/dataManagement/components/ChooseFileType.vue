<template>
  <div class="choose-file-type">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <div class="dialog-body">
      <div class="input-block-container">
        <div class="choose-type-container">
          <div 
            v-for="dataType in dataTypeList"
            :key="dataType.type"
            :class="{'is-disabled': dataType.type !== 'import_script' && !hasPermission(dataType.type)}"
            class="single-type-block"
            @click="selectDataType(dataType.type)"
          >
            <svg-icon 
              class="check-icon"
              icon-class="check-circle"
            />
            <div class="single-type-content">
              <svg-icon 
                :icon-class="dataType.icon"
                class="icon"
              />
              <div class="type-title">{{ dataType.title }}</div>
              <div 
                class="type-content" 
                v-html="dataType.description"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { importType } from '@/utils/general'
import SySelect from '@/components/select/SySelect'
import InputBlock from '@/components/InputBlock'

export default {
  inject: ['$validator'],
  name: 'ChooseFileType',
  components: {
    SySelect,
    InputBlock
  },
  data () {
    return {
      selectedDataType: importType.LOCAL
    }
  },
  computed: {
    dataTypeList () {
      return [
        {
          type: importType.LOCAL,
          icon: 'upload',
          title: this.$t('editing.localUpload'),
          description: this.$t('editing.localUploadDescription')
        },
        {
          type: importType.REMOTE,
          icon: 'db-connection',
          title: this.$t('editing.remoteConnection'),
          description: this.$t('editing.remoteConnectionDescription')
        },
        ...(this.hasPermission('app') ? [{
          type: importType.SCRIPT,
          icon: 'script',
          title: this.$t('editing.runScript'),
          description: this.$t('editing.runScriptDescription')
        }] : [])
      ]
    } 
  },
  methods: {
    hasPermission (type) {
      return this.$store.state.userManagement.permission.includes(type)
    },
    selectDataType (value) {
      if (value !== 'import_script' && !this.hasPermission(value)) return
      this.selectedDataType = value
      this.nextStep()
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.$store.commit('dataManagement/updateCurrentUploadDataType', this.selectedDataType)
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-file-type {
  .dialog-body {
    background: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 16px;
  }

  .input-block-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    height: 308px;
    padding: 24px;

    .choose-type-container {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .single-type-block {
        position: relative;
        width: 50%;
        display: flex;
        justify-content: center;
        align-items:center;
        border: 2px solid rgba(72, 84, 84, 0.95);
        border-radius: 12px;
        cursor: pointer;
        padding: 20px;

        &.is-disabled {
          cursor: not-allowed;
          opacity: 0.3;
          &:hover {
            border: 2px solid rgba(72, 84, 84, 0.95);
          }
        }

        &:hover {
          border: 2px solid #2AD2E2;
        }

        .icon {
          font-size: 70px;
        }

        .check-icon {
          display: none;
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 30px;
          color: #2AD2E2;
        }

        .type-title {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 12px;
        }

        .type-content {
          font-size: 14px;
          color: #ccc;
        }

        &:not(:last-child) {
          margin-right: 20px;
        }
      }

      .single-type-content {
        text-align: center;
      }
    }
  }
}
</style>
