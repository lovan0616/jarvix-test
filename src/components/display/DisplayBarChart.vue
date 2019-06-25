<template>
  <display-basic-chart
    :dataset="dataset"
    :addons="{
      'seriesItem:bar': {
        'large': true
      },
      'color:10': {},
      'grid:default': {},
      'xAxis:default': {},
      'yAxis:default': {},
    }"
    isPreview
  ></display-basic-chart>
</template>
<script>
export default {
  name: 'DisplayBarChart',
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
