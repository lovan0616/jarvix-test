<template>
  <div class="sy-table-block">
    <div class="spinner-block"
      v-show="isProcessing"
    >
      <spinner class="spinner"></spinner>
    </div>
    <el-table class="sy-table"
      v-bind="tableProps"
      style="width: 100%;"
      ref="table"
    >
      <el-table-column
        type="index"
        :width="indexWidth"
        align="center"
        :fixed="fixedIndex"
      >
        <template slot="header">
          <slot name="index-header" />
        </template>
      </el-table-column>
      <el-table-column
        v-for="(col, i) in columnList"
        :key="i"
        :prop="i.toString()"
        :label="(typeof col === 'number') ? col.toString() : col.primaryAlias"
        :width="columnWidth"
        :min-width="minColumnWidth"
      >
        <!--Header slot-->
        <template slot="header" slot-scope="scope">
          <slot name="columns-header"
            :column="dataset.columns"
            :index="i"
          >
           {{scope.column.label}}
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="loadMore"
        ref="tableEnd"
        type="index"
        :width="indexWidth"
        align="center"
      >
        <template slot="header" slot-scope="scope">
          <Observer :options="options" @intersect="intersected"/>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="table-pagination"
      v-if="paginationInfo.totalPages > 1"
      layout="prev, pager, next"
      :total="paginationInfo.totalItems"
      :page-size="paginationInfo.itemPerPage"
      :current-page="paginationInfo.currentPage + 1"
      @current-change="changePage"
      @prev-click="prevPage"
      @next-click="nextPage"
    ></el-pagination>
  </div>
</template>

<script>
import { Table } from 'element-ui'
import Observer from '../Observer'

export default {
  name: 'PaginationTable',
  props: {
    ...Table.props,
    fixedIndex: { type: Boolean, default: false },
    dataset: {
      type: [ Object, Array ],
      validator: value => {
        if (typeof value !== 'object') return false
        if (!(value instanceof Array)) {
          return value.index && value.data && value.columns
        } else return true
      },
      default: () => {
        return {
          data: [],
          columns: [],
          index: []
        }
      }
    },
    indexWidth: {
      type: Number,
      default: 40
    },
    columnWidth: {
      type: String,
      default: null
    },
    minColumnWidth: {
      type: String,
      default: '120'
    },
    paginationInfo: {
      type: Object,
      default () {
        return {
          currentPage: 0,
          totalPages: 0,
          totalItems: 0,
          itemPerPage: 0
        }
      }
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Observer
  },
  data () {
    return {
      columnList: [],
      offset: 0,
      columnPerScroll: 6,
      options: {
        root: this.$refs.table,
        threshold: 0
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      const headerList = this.dataset.columns.titles || this.dataset.columns
      if (headerList.length === this.offset) return
      this.columnList = [...this.columnList, ...headerList.slice(this.offset, this.offset + this.columnPerScroll)]
      this.offset += this.columnPerScroll
    },
    changePage (value) {
      this.$emit('change-page', value)
    },
    nextPage () {
      if (this.paginationInfo.currentPage + 1 <= this.paginationInfo.totalPages) {
        this.paginationInfo.currentPage += 1
        this.$emit('change-page', this.paginationInfo.currentPage)
      }
    },
    prevPage () {
      if (this.paginationInfo.currentPage - 1 > 0) {
        this.paginationInfo.currentPage -= 1
        this.$emit('change-page', this.paginationInfo.currentPage)
      }
    },
    intersected () {
      this.getData()
    }
  },
  computed: {
    tableProps () {
      let tableProps = { ...this.$props, data: this.dataset.data }
      if (!this.$props.maxHeight) {
        this.$set(tableProps, 'maxHeight', this.$attrs['is-preview'] ? 200 : 600)
      }
      return tableProps
    },
    loadMore () {
      const headerList = this.dataset.columns.titles || this.dataset.columns
      const isBigData = headerList.length > this.columnPerScroll
      const hasReachedEnd = this.offset >= headerList.length
      return isBigData && !hasReachedEnd
    }
  }
}
</script>
<style lang="scss" scoped>
.sy-table-block {
  position: relative;
  width: 100%;
  height: auto;

  .spinner-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 100;
  }

  .sy-table {
    margin-bottom: 16px;
  }

  /* TODO: 上版前需把註解移除 */
  /deep/ .sy-table.el-table {
    border: 1px solid #515959;
    th, td {
      border-bottom: 1px solid #515959;
      border-right: 1px solid #515959;
    }
  }

  /deep/ .el-table th>.cell {
    padding: 0;
  }

  /deep/ .el-table th {
    padding: 0;
  }

  /deep/ .el-table thead th>.cell {
    overflow: visible;
  }

  /deep/ .el-table thead th {
    overflow: visible;
    vertical-align: top;
  }
}
</style>
<style src="@/styles/element-ui/el-pagination.scss" lang="scss"></style>
