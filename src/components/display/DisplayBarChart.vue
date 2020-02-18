<template>
  <display-basic-chart
    :dataset="dataset"
    :height="height"
    :title="title"
    :addons="{
      'seriesItem:bar': {
        'large': true
      },
      'color:10': {},
      'grid:default': {},
      'xAxis:default': {},
      'yAxis:default': {},
    }"
    :is-preview="isPreview"
  ></display-basic-chart>
</template>
<script>
export default {
  name: 'DisplayBarChart',
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
      default: '420px'
    }
  }
}
</script>
