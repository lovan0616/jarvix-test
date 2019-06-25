<template>
  <display-basic-chart
    :dataset="dataset"
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
    isPreview: {
      type: Boolean,
      default: false
    }
  }
}
</script>
