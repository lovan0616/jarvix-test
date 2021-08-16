<template>
  <section class="dialog">
    <el-progress
      :percentage="progress"
      :stroke-width="3"
      :width="80"
      color="#2AD2E2"
      type="circle"
    />
    <div class="dialog__title">
      {{ $t('schedule.simulation.simulating') }}
    </div>
    <default-button
      type="outline"
      @click="$emit('cancel')"
    >
      {{ $t('schedule.button.cancel') }}
    </default-button>
  </section>
</template>

<script>
export default {
  name: 'SimulatingSpinner',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    margin-top: 24px;
    margin-bottom: 24px;
    font-size: 18px;
    line-height: 22px;
    color: var(--color-theme);
  }
  ::v-deep .el-progress {
    svg path:first-child {
      stroke: #666;
    }
    &__text {
      color: #FFF;
    }
  }
}
</style>
