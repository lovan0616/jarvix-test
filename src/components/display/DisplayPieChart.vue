<template>
  <display-basic-chart
    :dataset="dataset"
    :title="title"
    :addons="{
      'seriesItem:pie': {},
      'seriesItem:pieLabelWithValue': {},
      'color:10': {},
      'grid:default': {}
    }"
    isPreview
  ></display-basic-chart>
</template>
<script>
export default {
  name: 'DisplayPieChart',
  props: {
    dataset: {
      type: Object
    },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: null,
          yAxis: null
        }
      }
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  }
}
</script>
