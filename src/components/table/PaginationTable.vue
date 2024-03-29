<template>
  <div class="sy-table-block">
    <div
      v-show="isProcessing"
      class="spinner-block"
    >
      <spinner class="spinner" />
    </div>
    <el-table
      v-bind="tableProps"
      :empty-text="$t('editing.noData')"
      class="sy-table"
      style="width: 100%;"
      @sort-change="handleTableSort"
    >
      <el-table-column
        :width="indexWidth"
        :fixed="fixedIndex"
        type="index"
        align="center"
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
        :sortable="'custom'"
      >
        <!--Header slot-->
        <template
          slot="header"
          slot-scope="scope"
        >
          <slot
            :column="dataset.columns"
            :index="i"
            name="columns-header"
          >
            {{ scope.column.label }}
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="loadMore"
        width="0px"
        align="center"
      >
        <template
          slot="header"
          slot-scope="scope"
        >
          <Observer
            :options="formOptions()"
            @intersect="getData"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="paginationInfo.totalPages > 1"
      :total="paginationInfo.totalItems"
      :page-size="paginationInfo.itemPerPage"
      :current-page="paginationInfo.currentPage + 1"
      class="table-pagination"
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
  name: 'PaginationTable',
  components: {
    Observer
  },
  props: {
    ...Table.props,
    fixedIndex: { type: Boolean, default: false },
    dataset: {
      type: [Object, Array],
      validator: value => {
        if (Object.prototype.hasOwnProperty.call(value, 'enableEdit') && value.columns) return true
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
    },
    lazyLoadInfo: {
      type: Object,
      default: () => ({
        rootMargin: '300px',
        columnPerScroll: 6
      })
    },
    height: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      columnList: [],
      offset: 0
    }
  },
  computed: {
    tableProps () {
      let tableProps = { ...this.$props, data: this.dataset.data }
      if (!this.$props.maxHeight) {
        this.$set(tableProps, 'maxHeight', this.$attrs['is-preview'] ? 200 : 600)
      }
      if (this.$props.height) this.$set(tableProps, 'height', this.height)
      return tableProps
    },
    loadMore () {
      const headerList = this.dataset.columns.titles || this.dataset.columns
      const isBigData = headerList.length > this.lazyLoadInfo.columnPerScroll
      const hasReachedEnd = this.offset >= headerList.length
      return isBigData && !hasReachedEnd
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      const headerList = this.dataset.columns.titles || this.dataset.columns
      if (headerList.length === this.offset) return
      this.columnList.push(...headerList.slice(this.offset, this.offset + this.lazyLoadInfo.columnPerScroll))
      this.offset += this.lazyLoadInfo.columnPerScroll
    },
    changePage (value) {
      this.$emit('change-page', value)
    },
    nextPage (value) {
      this.$emit('change-page', value)
    },
    prevPage (value) {
      this.$emit('change-page', value)
    },
    formOptions () {
      return {
        rootClassName: '.el-table__header-wrapper',
        rootMargin: this.lazyLoadInfo.rootMargin,
        threshold: 0
      }
    },
    handleTableSort (column) {
      const dataColumnIndex = parseInt(column.prop)
      let sortType = null

      switch (column.order) {
        case 'ascending':
          sortType = 'ASC'
          break
        case 'descending':
          sortType = 'DESC'
          break
        default:
          break
      }
      this.$emit('on-sort', { dataColumnIndex, sortType })
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

  ::v-deep .spinner-block {
    padding: 0;
  }

  ::v-deep .sy-table.el-table {
    border: 1px solid #515959;
    margin-bottom: 16px;
    th, td {
      border-bottom: 1px solid #515959;
      border-right: 1px solid #515959;
    }
    th {
      padding: 0;
    }
    .is-sortable {
      cursor: default;
    }
  }

  ::v-deep .el-table th>.cell {
    padding: 0;
    .caret-wrapper {
      display: none;
    }
    .arrow-icon {
      cursor: pointer;
    }
  }

  ::v-deep .el-table thead th>.cell {
    overflow: visible;
  }

  ::v-deep .el-table thead th {
    overflow: visible;
    vertical-align: top;
  }

  /* 解決 lazy loading 新增欄位時，寬度增長速度大於資料顯示，造成短暫 word wrap */
  ::v-deep .el-table td {
    width: 270px
  }

  ::v-deep .el-table th {
    width: 270px
  }
}
</style>
