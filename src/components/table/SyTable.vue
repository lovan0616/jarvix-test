<template>
  <div class="sy-table-block">
    <button 
      v-if="isShowDonwnloadBtn && appQuestion" 
      type="button"
      class="btn-m btn-default btn-download"
      @click="downloadData"
    >{{ $t('button.download') }}</button>
    <el-table 
      v-bind="tableProps"
      :cell-class-name="getCellIndex"
      :row-class-name="tableRowClassName"
      class="sy-table"
      style="width: 100%;"
      @cell-click="onClickCell"
      @row-click="onClickRow"
    >
      <el-table-column
        :width="indexWidth"
        type="index"
      />
      <el-table-column
        v-for="(col, i) in columnList"
        :key="i"
        :prop="i.toString()"
        :label="(typeof col === 'number') ? col.toString() : col"
        min-width="120"
      />
      <el-table-column
        v-if="hasMoreColumn"
        width="0px"
        align="center"
      >
        <template 
          slot="header" 
          slot-scope="scope">
          <Observer 
            :options="formOptions()" 
            @intersect="getData"/>
        </template>
      </el-table-column>
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
import Observer from '../Observer'

export default {
  name: 'SyTable',
  components: {
    Observer
  },
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
    componentId: {
      type: Number,
      default: null
    },
    canDownloadCsv: {
      type: Boolean,
      default: false
    },
    indexWidth: {
      type: Number,
      default: 80
    },
    hasPagination: {
      type: Boolean,
      default: false
    },
    isShowDonwnloadBtn: {
      type: Boolean,
      default: true
    },
    lazyLoadInfo: {
      type: Object,
      default: () => ({
        rootMargin: '130px',
        columnPerScroll: 16
      })
    },
    customChartStyle: {
      type: Object,
      default: () => {}
    },
    customCellClassName: {
      type: Array,
      default: () => [
        // 為指定的行或列加上 cellClassName
        // { 
        //   type: 'row',
        //   index: 1,
        //   className: 'myClassName moreClassName' // 欲帶入多個 class 時以空格隔開即可
        // },
        // {
        //   type: 'column',
        //   index: 3,
        //   className: 'myClassName'
        // }
      ]
    },
    isHoverable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentPage: 1,
      countPerPage: 20,
      columnList: [],
      offset: 0
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
        const minIndex = (this.currentPage - 1) * this.countPerPage
        const maxIndex = this.currentPage * this.countPerPage
        const currentPageData = this.dataset.data.slice(minIndex, maxIndex)
        return currentPageData.map(data => ({ ...data }))
      } else {
        // is array
        return []
      }
    },
    tableProps () {
      if (this.autoMerge) return { ...this.$props, data: this.tableData, spanMethod: this.tableSpanMethod }
      else {
        let tableProps = { ...this.$props, data: this.tableData, ...this.customChartStyle }
        if ((!this.customChartStyle && !this.$props.maxHeight) || (this.customChartStyle && !this.$props.maxHeight && !this.customChartStyle.height)) {
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
    },
    hasMoreColumn () {
      const headerList = this.dataset.columns
      const isBigData = headerList.length > this.lazyLoadInfo.columnPerScroll
      const hasReachedEnd = this.offset >= headerList.length
      return isBigData && !hasReachedEnd
    },
    tableRowClassName () {
      return this.isHoverable ? 'is-hovered' : ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      const headerList = this.dataset.columns
      if (headerList.length <= this.offset) return
      this.columnList.push(...headerList.slice(this.offset, this.offset + this.lazyLoadInfo.columnPerScroll))
      this.offset += this.lazyLoadInfo.columnPerScroll
    },
    formOptions () {
      return {
        rootClassName: '.el-table__header-wrapper',
        rootMargin: this.lazyLoadInfo.rootMargin,
        threshold: 0,
      }
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
    },
    downloadData () {
      let tableData = JSON.parse(JSON.stringify(this.dataset.data))
      tableData.unshift(this.dataset.columns)
      let fileName = this.timeToFileName(window.location.search.split('&')[1].split('stamp=')[1]) + '_' + this.appQuestion
      if (this.hasPagination && this.canDownloadCsv) return this.addCSVDownloadTask(this.appQuestion, this.componentId)
      this.exportToCSV(fileName, tableData)
    },
    getCellIndex ({ row, column, rowIndex, columnIndex }) {
      // 為 行/列 增加 index 屬性，供 clickCell 事件使用 
      row.index = rowIndex;
      column.index = columnIndex;
      
      // 回傳 cellClassName
      let colSetting = this.customCellClassName.find(item => item.index === columnIndex && item.type === 'column')
      let rowSetting = this.customCellClassName.find(item => item.index === rowIndex && item.type === 'row')
      
      if (colSetting && rowSetting) return [colSetting.className, rowSetting.className]
      if (colSetting) return colSetting.className
      if (rowSetting) return rowSetting.className
    },
    onClickCell (row, column) {
      this.$emit('clickCell', { row, column })
    },
    onClickRow (row, column) {
      this.$emit('clickRow', { 
        row, 
        column,
        header: this.dataset.columns
      })
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
    top: -32px;
    left: 0;
  }

  &>>>.arrow-block {
    top: 0;
    bottom: 0;
    margin: auto;
  }

  /* 解決 lazy loading 新增欄位時，寬度增長速度大於資料顯示，造成短暫 word wrap */
  /deep/ .sy-table td {
    width: 150px
  }

  /deep/ .sy-table th {
    width: 150px
  }
}
</style>
