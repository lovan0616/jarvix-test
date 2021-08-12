<template>
  <div class="insight-wrapper">
    <div class="title">
      <svg-icon
        :icon-class="'len-with-line-chart'"
      />
      {{ $t('resultDescription.dataInsight') }}
    </div>
    <bar-chart-insight
      :dataset="dataset"
      :title="title"
      :is-show-legend="isShowLegend"
      :is-show-toolbox="isShowToolbox"
      :height="height"
    />
  </div>
</template>
<script>
import BarChartInsight from '@/components/display/BarChartInsight'

export default {
  name: 'DisplayDifferenceInsight',
  components: {
    BarChartInsight
  },
  props: {
    dataset: {
      type: Object,
      default: () => {}
    },
    title: {
      type: Object,
      default: () => {}
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
  }
}
</script>
