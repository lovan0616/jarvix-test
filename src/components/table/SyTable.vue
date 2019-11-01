<template>
  <div class="sy-table-block">
    <el-table class="sy-table"
      v-bind="tableProps"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="80"
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
    <el-pagination class="table-pagination"
      v-if="totalPage > 1"
      background
      layout="prev, pager, next"
      :total="dataset.data.length"
      :page-size="countPerPage"
      :current-page="currentPage"
      @current-change="changePage"
      @prev-click="prevPage"
      @next-click="nextPage"
    ></el-pagination>
  </div>
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
  data () {
    return {
      currentPage: 1,
      countPerPage: 20
    }
  },
  methods: {
    getTableIndex (index) {
      return this.dataset.index[index]
    },
    changePage (value) {
      this.currentPage = value
    },
    nextPage () {
      if (this.currentPage + 1 <= this.totalPage) {
        this.currentPage += 1
      }
    },
    prevPage () {
      if (this.currentPage - 1 > 0) {
        this.currentPage -= 1
      }
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.dataset.data.length / this.countPerPage)
    },
    tableData () {
      if (typeof this.dataset !== 'object') return []
      if (!(this.dataset instanceof Array)) {
        // is object
        let minIndex = (this.currentPage - 1) * this.countPerPage
        let maxIndex = this.currentPage * this.countPerPage - 1
        let columnLength = this.dataset.columns.length
        let displayData = []
        for (let i = minIndex; i <= maxIndex; i++) {
          let newData = {}
          if (!this.dataset.data[i]) break
          for (let j = 0; j < columnLength; j++) {
            newData[j.toString()] = this.dataset.data[i][j]
          }
          displayData.push(newData)
        }
        return displayData
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
          this.$set(tableProps, 'maxHeight', this.$attrs['is-preview'] ? 200 : 400)
        }
        return tableProps
      }
    },
    tableSpanMethod () {
      if (!this.autoMerge) return false
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
.sy-table-block {
  width: 100%;
  height: auto;

  .sy-table {
    margin-bottom: 16px;
  }
}
</style>
<style lang="scss">
.table-pagination.el-pagination {
  text-align: center;

  button, .el-pager li {
    height: 30px;
    border-radius: 4px;
  }

  &.is-background {
    .btn-next, .btn-prev, .el-pager li {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.16);
    }
    .el-pager li:not(.disabled).active {
      background-color: $theme-color-primary;
    }
  }
}
</style>
