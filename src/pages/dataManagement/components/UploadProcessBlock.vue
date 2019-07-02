<template>
  <div class="upload-process-block">
    <div class="step-process"
      :class="{'current': step === index + 1, 'active': step > index + 1 }"
      v-for="(singleProcess, index) in processText"
      :key="index"
    >
      <div class="step" v-if="step <= index + 1">{{ index + 1 }}</div>
      <div class="step" v-else><svg-icon icon-class="checked"></svg-icon></div>
      <div class="step-level">{{ singleProcess }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UploadProceeBlock',
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      processText: [
        '选择资料类型',
        '上传资料/连结资料库',
        '开始新增'
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
  .upload-process-block {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 12px;

    .step-process {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        flex: auto;

        &:after {
          display: block;
          content: "";
          border-bottom: 1px solid #43BAC3;
          flex: 1;
          margin: 0 10px;
        }
      }

      &.current, &.active {
        .step {
          color: #fff;
          background-color: #43BAC3;
          border-color: #43BAC3;
        }
      }

      &.current {
        .step-level {
          color: #43BAC3;
        }
      }

      &.active {
        .step-level {
          color: #444;
        }
      }
    }

    .step {
      flex: initial;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 30px;
      border: 1px solid  #BDBDBD;
      color: #BDBDBD;
      border-radius: 50%;
      margin-right: 8px;
    }

    .step-level {
      flex: initial;
      color: #979797;
      letter-spacing: 1px;
    }
  }
</style>
