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
    }
  },
  computed: {
    displayedText () {
      // 可能會有列表或 table 兩種形式
      if (this.diagram === 'table') {
        if (this.dataset.data && this.dataset.data[0] && this.dataset.data[0][0]) {
          return this.dataset.data[0][0]
        }
      } else {
        if (this.dataset.index && this.dataset.index[0]) {
          return this.dataset.index[0]
        }
      }
      return null
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
