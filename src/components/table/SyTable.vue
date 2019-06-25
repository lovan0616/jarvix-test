<template>
  <el-table class="sy-table"
    v-bind="tableProps"
    style="width: 100%;"
  >
    <el-table-column
      fixed
      type="index"
      width="120"
      :index="getTableIndex"
    >
    </el-table-column>
    <el-table-column
      v-for="(col, i) in dataset.columns"
      :key="i"
      :prop="i.toString()"
      :label="(typeof col === 'number') ? col.toString() : col"
      min-width="120"
    />
  </el-table>
</template>

<script>
import { Table } from 'element-ui'

export default {
  name: 'SyTable',
  props: {
    ...Table.props,
    dataset: {
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
  methods: {
    getTableIndex (index) {
      return this.dataset.index[index]
    }
  },
  computed: {
    tableData () {
      if (typeof this.dataset !== 'object') return []
      if (!(this.dataset instanceof Array)) {
        // is object
        return this.dataset.data.map(row => {
          return this.dataset.columns.reduce((accu, curr, currIndex) => {
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
      else {
        let tableProps = { ...this.$props, data: this.tableData }
        if (!this.$props.maxHeight) {
          this.$set(tableProps, 'maxHeight', 300)
        }
        return tableProps
      }
    },
    tableSpanMethod () {
      let result = []
      let rowCounter = 1
      let colCounters = [...Array(this.dataset.columns.length)].fill(1)
      this.dataset.data.forEach((row, rowIndex) => {
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
          if (this.dataset.data[rowIndex + 1] && col === this.dataset.data[rowIndex + 1][colIndex]) colCounters[colIndex]++
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
<style lang="scss" scoped>
.sy-table {
  margin-bottom: 32px;
}
</style>
