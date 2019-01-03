<template>
  <el-table class="sy-table"
    v-bind="tableProps"
  >
    <el-table-column
      v-for="(col, i) in data.columns"
      :key="i"
      :prop="i.toString()"
      :label="(typeof col === 'number') ? col.toString() : col"
    />
  </el-table>
</template>

<script>
import { Table } from 'element-ui'

export default {
  name: 'SyTable',
  props: {
    ...Table.props,
    data: {
      type: [ Object, Array ],
      validator: value => {
        if (typeof value !== 'object') return false
        if (!(value instanceof Array)) {
          return value.index && value.data && value.columns
        } else return true
      },
      default: () => []
    },
    autoMerge: { type: Boolean, default: false }
  },
  computed: {
    tableData () {
      if (typeof this.data !== 'object') return []
      if (!(this.data instanceof Array)) {
        // is object
        return this.data.data.map(row => {
          return this.data.columns.reduce((accu, curr, currIndex) => {
            accu[currIndex.toString()] = row[currIndex]
            return accu
          }, {})
        })
      } else {
        // is array
        return []
      }
    },
    tableProps () {
      if (this.autoMerge) return { ...this.$props, data: this.tableData, spanMethod: this.tableSpanMethod }
      else return { ...this.$props, data: this.tableData }
    },
    tableSpanMethod () {
      let result = []
      let rowCounter = 1
      let colCounters = [...Array(this.data.columns.length)].fill(1)
      this.data.data.forEach((row, rowIndex) => {
        result[rowIndex] = []
        row.forEach((col, colIndex) => {
          result[rowIndex][colIndex] = [1, 1]
          if (col === row[colIndex + 1]) rowCounter++
          else {
            [...Array(rowCounter)].forEach((n, i) => {
              if (i === rowCounter - 1) result[rowIndex][colIndex - i][1] = rowCounter
              else result[rowIndex][colIndex - i][1] = 0
            })
            rowCounter = 1
          }
          if (this.data.data[rowIndex + 1] && col === this.data.data[rowIndex + 1][colIndex]) colCounters[colIndex]++
          else {
            [...Array(colCounters[colIndex])].forEach((n, i) => {
              if (i === colCounters[colIndex] - 1) result[rowIndex - i][colIndex][0] = colCounters[colIndex]
              else result[rowIndex - i][colIndex][0] = 0
            })
            if (rowCounter !== 1 && colCounters[colIndex] !== 1) {
              result[rowIndex - colCounters[colIndex] + 1][colIndex][0]--
              result[rowIndex][colIndex][0] = 1
            }
            colCounters[colIndex] = 1
          }
        })
      })
      return ({ row, column, rowIndex, columnIndex }) => result[rowIndex][columnIndex]
    }
  }
}
</script>
