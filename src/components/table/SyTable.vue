<template>
  <div class="sy-table-block">
    <button 
      v-if="appQuestion" 
      type="button"
      class="btn-m btn-default btn-download"
      @click="downloadData"
    >{{ $t('button.download') }}</button>
    <el-table 
      v-bind="tableProps"
      class="sy-table"
      style="width: 100%;"
    >
      <el-table-column
        :width="indexWidth"
        type="index"
      />
      <el-table-column
        v-for="(col, i) in dataset.columns"
        :key="i"
        :prop="i.toString()"
        :label="(typeof col === 'number') ? col.toString() : col"
        min-width="120"
      />
    </el-table>
    <arrow-button
      v-if="hasPagination"
      :right="20"
      @click.native="$emit('next')"
    />
    <el-pagination 
      v-if="totalPage > 1"
      :total="dataset.data.length"
      :page-size="countPerPage"
      :current-page="currentPage"
      class="table-pagination"
      hide-on-single-page
      layout="prev, pager, next"
      @current-change="changePage"
      @prev-click="prevPage"
      @next-click="nextPage"
    />
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
    autoMerge: { type: Boolean, default: false },
    indexWidth: {
      type: Number,
      default: 80
    },
    hasPagination: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentPage: 1,
      countPerPage: 20
    }
  },
  computed: {
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    },
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
  },
  methods: {
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
    },
    downloadData () {
      let tableData = JSON.parse(JSON.stringify(this.dataset.data))
      tableData.unshift(this.dataset.columns)
      let fileName = this.timeToFileName(window.location.search.split('&')[1].split('stamp=')[1]) + '_' + this.appQuestion
      this.exportToCSV(fileName, tableData)
    }
  },
}
</script>
<style lang="scss" scoped>
.sy-table-block {
  position: relative;
  width: 100%;
  height: auto;

  .sy-table {
    margin-bottom: 16px;
  }

  .btn-download {
    position: absolute;
    top: -30px;
    left: 0;
  }

  &>>>.arrow-block {
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
<style src="@/styles/element-ui/el-pagination.scss" lang="scss"></style>
