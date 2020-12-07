<template>
  <div
    :style="customChartStyle"
    class="index-info"
  >
    {{ displayedText }}
  </div>
</template>

<script>
export default {
  name: 'DisplayTextInfo',
  props: {
    diagram: {
      type: String,
      required: true
    },
    dataset: { 
      type: Object, 
      default: () => ([])
    },
    customChartStyle: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    displayedText () {
      // 可能會有列表或 table 兩種形式
      return this.diagram === 'table' ? this.dataset.data[0][0] : this.dataset.index[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.index-info {
  font-size: 18px;
  line-height: 25px;
}
</style>