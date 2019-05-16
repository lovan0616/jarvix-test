<template>
  <div class="indicators-info-block">
    <slot></slot>
    <!-- <div class="indicators-board"
      v-for="(info, index) in infoList"
      :key="index"
      :style="{width: 100/infoList.length + '%'}"
    >
      <div class="board-label">{{ info.title }}</div>
      <div class="board-content">{{ info.value }}</div>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'IndicatorsList'
}
</script>
<style lang="scss" scoped>
.indicators-info-block {
  display: flex;
  justify-content: center;
  margin-bottom: 46px;
  text-align: center;
}
</style>
