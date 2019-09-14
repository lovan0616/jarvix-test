<template>
  <display-basic-chart
    :dataset="dataset"
    :height="height"
    :title="title"
    :addons="{
      'seriesItem:line': {
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
  name: 'DisplayLineChart',
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
    },
    height: {
      type: String,
      default: '380px'
    }
  }
}
</script>
