<template>
  <div class="etl-choose-column">
    <div class="first-section">
      <div class="title">{{ $t('etl.dataFrameList') }}</div>
      <div class="data-frame-list">
        <div class="single-column"
          v-for="n in 3"
          :key="n"
        >XXXX</div>
      </div>
    </div>
    <div class="second-section"></div>
  </div>
</template>
<script>
export default {
  nmae: 'EtlChooseColumn'
}
</script>
<style lang="scss" scoped>
.etl-choose-column {
  background: rgba(50, 58, 58, 0.95);
  border-radius: 5px;
  padding: 18px 24px;

  .title {
    margin-bottom: 12px;
  }

  .data-frame-list {
    .single-column {
      background: rgba(67, 76, 76, 0.95);
      border-radius: 5px;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
