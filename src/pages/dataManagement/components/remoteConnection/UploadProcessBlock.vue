<template>
  <div class="upload-process-block">
    <div
      v-for="(singleProcess, index) in processText"
      :class="{'current': step === index + 1, 'active': step > index + 1 }"
      :key="index"
      class="step-process"
    >
      <div
        v-if="step <= index + 1"
        class="step"
      >
        {{ index + 1 }}
      </div>
      <div
        v-else
        class="step"
      >
        <svg-icon icon-class="checked" />
      </div>
      <div class="step-level">
        {{ singleProcess }}
      </div>
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
  computed: {
    processText () {
      return [
        this.$t('editing.connectDB'),
        this.$t('editing.connectStep2'),
        this.$t('editing.connectStep3')
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
          border-bottom: 1px solid #a7a7a7;
          flex: 1;
          margin: 0 10px;
        }
      }

      &.current {
        .step {
          color: #000;
          background-color: $theme-color-primary;
          border-color: $theme-color-primary;
        }
        .step-level {
          color: $theme-color-primary;
        }
      }

      &.active {
        &:not(:last-child) {
          &:after {
            border-color: #fff;
          }
        }

        .step {
          color: #fff;
          background-color: transparent;
          border-color: #fff;
        }
        .step-level {
          color: #fff;
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
