<template>
  <div class="insight">
    <p
      class="insight__description"
      v-for="(description, index) in dataset.descriptions"
      :key="index"
    >
      {{ dataset.descriptions.length > 1 ? (index + 1) + '. ' + description : description }}
    </p>
    <div class="insight__chart">
      <display-bar-chart
        :dataset="dataset"
        :title="title"
        :is-show-legend="isShowLegend"
        :is-show-toolbox="isShowToolbox"
        :height="height"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChartInsight',
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
