<template>
  <div class="input-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="1"
    />
    <div class="dialog-body">
      <div class="setting-block script-name-container">
        <input-block 
          v-validate="`required|max:${max}`"
          :label="$t('script.setScriptName')"
          v-model="scriptName"
          class="script-name-input"
          name="scriptName"
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
import UploadProcessBlock from './fileUpload/UploadProcessBlock'
import InputBlock from '@/components/InputBlock'

export default {
  inject: ['$validator'],
  name: 'EditScriptName',
  components: {
    UploadProcessBlock,
    InputBlock
  },
  data () {
    return {
    }
  },
  computed: {
    scriptName: {
      get () {
        return this.$store.state.modelManagement.currentUploadModelName
      },
      set (value) {
        this.$store.commit('modelManagement/updateModelName', value)
      }
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  methods: {
    next () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.$emit('next')
      })
    },
    cancel () {
      this.$store.commit('modelManagement/updateShowCreateModelDialog', false)
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

    &.script-name-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50vh;
    }

    .script-name-input {
      width: 35%;
    }
  }
}
</style>
