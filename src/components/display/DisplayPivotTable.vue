<template>
  <div class="display-pivot-table">
    <display-basic-chart
      :dataset="transformDataset"
      :height="height"
      :title="title"
      :add-index-to-data="false"
      :addons="{
        'seriesItem:bar': {
          'large': true
        },
        'color:10': {},
        'grid:default': {},
        'xAxis:default': {},
        'yAxis:default': {},
      }"
    />
  </div>
</template>

<script>

export default {
  name: 'DisplayPivotTable',
  props: {
    dataset: {
      type: Object,
      default: () => {
        return {
          index: null,
          data: null
        }
      }
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
    height: {
      type: String,
      default: '420px'
    }
  },
  data () {
    return {

    }
  },
  computed: {
    transformDataset () {
      const indexLength = this.dataset.index.reduce((result, curr) => curr.length > result ? curr.length : result, 0)
      const sep = Math.floor(indexLength / 2)
      const xStart = 0
      const xEnd = sep
      const yStart = sep
      const yEnd = indexLength

      let newIndex = []
      let newColumn = []
      let newData = []

      this.dataset.index.forEach((item, i) => {
        const indexValue = item.slice(xStart, xEnd)
        const columnValue = item.slice(yStart, yEnd)
        let indexIndex = this.indexOfArrayElement(newIndex, indexValue)
        let columnIndex = this.indexOfArrayElement(newColumn, columnValue)
        if (columnIndex < 0) {
          newColumn.push(columnValue)
          columnIndex = newColumn.length - 1
        }
        if (indexIndex < 0) {
          newIndex.push(indexValue + '')
          indexIndex = newIndex.length - 1
          newData[indexIndex] = []
        }
        newData[indexIndex][columnIndex] = this.dataset.data[i][0]
      })
      let dataset = {
        index: newIndex,
        columns: newColumn,
        data: newData
      }
      return dataset
    }
  },
  created () {

  },
  methods: {
    indexOfArrayElement (array, item) {
      let result = -1
      for (let i = array.length - 1; i >= 0; i--) {
        if (JSON.stringify(array[i]) === JSON.stringify(item)) {
          result = i
          break
        }
      }
      return result
    }
  }
}
</script>

<style scoped>

</style>
