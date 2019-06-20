<template>
  <div class="indicator-info">
    <div class="info-label">{{ info.title }}</div>
    <div class="info-content">{{ info.value }}</div>
  </div>
</template>
<script>
export default {
  name: 'IndicatorInfo',
  props: {
    info: {
      type: Object,
      default () {
        return {
          title: null,
          value: null
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.indicator-info {
  &:not(:last-child) {
    margin-right: 20px;
  }
  .info-label {
    font-size: 13px;
    line-height: 22px;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
    color: $theme-text-color;
  }
  .info-content {
    font-size: 28px;
    line-height: normal;
    letter-spacing: 0.05em;
    color: $theme-text-color-dark;
    font-family: 'Oswald'
  }
}
</style>
