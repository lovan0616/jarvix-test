<template>
  <div class="input-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="1"
    />
    <div class="dialog-body">
      <div class="setting-block flow-name-container">
        <input-block 
          v-validate="`required`"
          :label="$t('modelFlow.upload.setFlowName')"
          v-model="flowName"
          class="flow-name-input"
          name="flowName"
        />
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button
          class="btn btn-default"
          @click="next"
        >{{ $t('button.nextStep') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import UploadProcessBlock from './components/UploadProcessBlock'
import InputBlock from '@/components/InputBlock'
import { mapState, mapMutations } from 'vuex'

export default {
  inject: ['$validator'],
  name: 'EditFlowName',
  components: {
    UploadProcessBlock,
    InputBlock
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('modelFlowManagement', ['currentUploadFlowInfo']),
    flowName: {
      get () {
        return this.currentUploadFlowInfo.name || ''
      },
      set (value) {
        this.updateCurrentUploadFlowInfo({
          ...this.currentUploadFlowInfo,
          name: value
        })
      }
    }
  },
  methods: {
    ...mapMutations('modelFlowManagement', ['updateShowCreateFlowDialog', 'updateCurrentUploadFlowInfo']),
    next () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.$emit('next')
      })
    },
    cancel () {
      this.updateShowCreateFlowDialog(false)
    }
  }
}
</script>
<style lang="scss" scoped>
.input-setting-dialog {
  .dialog-title {
    margin-bottom: 16px;
  }

  .setting-block {
    background: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;

    &.flow-name-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50vh;
    }

    .flow-name-input {
      width: 35%;
    }
  }
}
</style>
