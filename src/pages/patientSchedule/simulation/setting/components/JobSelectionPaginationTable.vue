<template>
  <div class="pagination-table ss-pagination-table ">
    <div
      v-show="isProcessing"
      class="spinner-block"
    >
      <spinner class="spinner" />
    </div>
    <el-table
      ref="multipleTable"
      v-bind="tableProps"
      :empty-text="$t('schedule.table.noData')"
      class="ss-table"
      style="width: 100%;"
      cell-class-name="schedule-table-cell"
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
      <el-table-column
        label="Priority"
        width="120"
      >
        <template slot-scope="prorityColumn">
          {{ priortyOptions[dataset.data[prorityColumn.$index].priority - 1].label }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="selection"
        fixed="right"
        width="103"
      >
        <template
          slot="header"
          slot-scope="scope"
        >
          <el-checkbox
            v-model="isCheckAll"
            :name="scope[0]"
            class="job-select-checkbox"
            @change="handleCheckAllChange()"
          />
        </template>
        <template slot-scope="selectionColumn">
          <el-checkbox
            v-model="dataset.data[selectionColumn.$index].isChecked"
            :disabled="layout === 'unscheduled' && dataset.data[selectionColumn.$index].isScheduled"
            class="job-select-checkbox"
            @change="changeCheck(dataset.data[selectionColumn.$index])"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="paginationInfo.totalPages > 1"
      :total="paginationInfo.totalItems"
      :page-size="paginationInfo.itemPerPage"
      :current-page="paginationInfo.currentPage + 1"
      class="ss-pagination"
      layout="prev, pager, next"
      @current-change="changePage"
      @prev-click="prevPage"
      @next-click="nextPage"
    />
  </div>
</template>

<script>
export default {
  name: 'JobSelectionPaginationTable',
  props: {
    dataset: {
      type: [Object, Array],
      validator: value => {
        console.log(value)
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
    selection: { type: Boolean, default: false },
    layout: {
      type: String,
      default: ''
    },
    indexWidth: {
      type: Number,
      default: 40
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
  data () {
    return {
      isCheckAllList: [],
      priortyOptions: [
        { value: 1, label: 'High' },
        { value: 2, label: 'Normal' },
        { value: 3, label: 'Low' }
      ]
    }
  },
  computed: {
    tableProps () {
      const tableProps = { ...this.$props, data: this.dataset.data }
      if (!this.$props.maxHeight) {
        this.$set(tableProps, 'maxHeight', this.$attrs['is-preview'] ? 200 : 350)
      }
      if (this.$props.height) this.$set(tableProps, 'height', this.height)
      return tableProps
    },
    isCheckAll: {
      get () {
        return this.isCheckAllList[this.paginationInfo.currentPage]
      },
      set (value) {
        this.$set(this.isCheckAllList, this.paginationInfo.currentPage, value)
      }

    }
  },
  watch: {
    dataset: {
      handler () {
        this.$set(this.isCheckAllList, this.paginationInfo.currentPage, this.dataset.data.every(data => data.isChecked))
      },
      immediate: true
    }
  },
  mounted () {
    for (let i = 0; i < this.paginationInfo.totalPages; i++) {
      this.isCheckAllList.push(false)
    }
  },
  methods: {
    handleCheckAllChange () {
      if (this.isCheckAllList[this.paginationInfo.currentPage]) {
        this.dataset.data.forEach(item => {
          if (!item.isChecked) {
            item.isChecked = true
            this.changeCheck(item)
          }
        })
      } else {
        this.dataset.data.forEach(item => {
          if (this.layout === 'scheduled' || (this.layout === 'unscheduled' && !item.isScheduled)) {
            item.isChecked = false
            this.changeCheck(item)
          }
        })
      }
    },
    changeCheck (checkedRow) {
      this.$set(this.isCheckAllList, this.paginationInfo.currentPage, this.dataset.data.every(data => data.isChecked))
      this.$emit('change-check', checkedRow)
    },
    changePage (value) {
      this.paginationInfo.currentPage = value - 1
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
.ss-pagination-table {
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

  /deep/ .ss-table.el-table {
    border: 1px solid #555858;
    th, td {
      border-bottom: 1px solid #555858;
      border-right: 1px solid #555858;
    }
  }

  /deep/ .el-input--small .el-input__inner {
    border: none;
    background-color: transparent;
  }

  /deep/ .el-select .el-input .el-select__caret {
    font-weight: bold;
    color: var(--color-white);
  }

  /deep/ .el-checkbox__inner {
    background-color: transparent;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: var(--color-theme);
  }

  /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: var(--color-text-disabled);
  }

  .job-select-checkbox {
    width: 100%;
  }

  .ss-table /deep/ td.schedule-table-cell:last-child {
    padding: 0;
  }
}
</style>
