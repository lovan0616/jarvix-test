<template>
  <div class="insight-wrapper">
    <div class="title">
      <svg-icon
        :icon-class="'len-with-line-chart'"
      />
      {{ $t('resultDescription.dataInsight') }}
    </div>
    <div
      class="info"
      v-html="textTransform(info)"
    />
    <bar-chart-insight
      v-for="(insight, index) in subComponents"
      :key="index"
      :dataset="insight.dataset"
      :title="insight.title"
      :is-show-legend="isShowLegend"
      :is-show-toolbox="isShowToolbox"
      :height="height"
    />
  </div>
</template>
<script>
import BarChartInsight from '@/components/display/BarChartInsight'

export default {
  name: 'CorrelationInsight',
  components: {
    BarChartInsight
  },
  props: {
    info: {
      type: String,
      default: null
    },
    subComponents: {
      type: Array,
      default: () => []
    },
    isShowLegend: {
      type: Boolean,
      default: true
    },
    isShowToolbox: {
      type: Boolean,
      default: true
    },
    height: { type: String, default: '300px' }
  },
  methods: {
    textTransform (text) {
      return this.info ? text.replace('^2', '<sup>2</sup>') : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.info {
  padding: 10px;

  & ~ .insight {
    border-top: 1px solid #52696a;
  }
}
</style>
