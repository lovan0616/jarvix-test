<template>
  <div class="display-no-answer-info">
    <div class="info-title">{{ title }}</div>
    <div class="info-description">{{ message }}</div>
  </div>
</template>
<script>
export default {
  name: 'DisplayNoAnswerInfo',
  props: {
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
.display-no-answer-info {
  height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .info-title {
    color: $theme-color-primary;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}
</style>
