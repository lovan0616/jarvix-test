<template>
  <div class="pagination-table">
    <div
      v-show="isProcessing"
      class="spinner-block"
    >
      <spinner class="spinner" />
    </div>
    <el-table
      v-bind="tableProps"
      :height="height"
      :empty-text="$t('schedule.table.noData')"
      class="ss-table"
      style="width: 100%;"
    >
      <el-table-column
        v-if="dataset.index && dataset.index.length > 0"
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
        v-for="(col, index) in dataset.columns.titles"
        :key="index"
        :prop="col.title"
        :label="col.name"
        :width="col.width"
        :min-width="minColumnWidth"
      />
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
export default {
  name: 'PaginationTable',
  props: {
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
    fixedIndex: { type: Boolean, default: false },
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
    height: {
      type: String,
      default: null
    }
  },
  computed: {
    tableProps () {
      const tableProps = { ...this.$props, data: this.dataset.data }
      if (this.$props.height) this.$set(tableProps, 'height', this.height)
      return tableProps
    }
  },
  methods: {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination-table {
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

  /deep/ .spinner-block {
    padding: 0;
  }
}
</style>
