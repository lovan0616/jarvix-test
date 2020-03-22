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
    >
      <el-table-column
        type="index"
        :width="indexWidth"
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
      v-if="paginationInfo.totalPages > 1"
      layout="prev, pager, next"
      :total="paginationInfo.totalPages"
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

export default {
  name: 'PaginationTable',
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
      default: 80
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
  },
  computed: {
    tableProps () {
      let tableProps = { ...this.$props, data: this.dataset.data }
      if (!this.$props.maxHeight) {
        this.$set(tableProps, 'maxHeight', this.$attrs['is-preview'] ? 200 : 400)
      }
      return tableProps
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
}
</style>
<style src="@/styles/element-ui/el-pagination.scss" lang="scss"></style>