<template>
  <filter-status-badge
    v-if="filters.length"
    :badge-text="badgeText"
  >
    <div
      class="filter-status-table"
      slot="content"
    >
      <el-table :data="tableData">
        <el-table-column
          prop="name"
          label="條件名稱"
          min-width="50px"
        >
          <template slot-scope="scope">
            <filter-status-badge
              :badge-text="scope.row.name"
              no-tooltip
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="text"
          label="內容"
        />
      </el-table>
    </div>
  </filter-status-badge>
</template>

<script>
import FilterStatusBadge from './FilterStatusBadge'

export default {
  name: 'OverflowFilterStatusBadge',
  components: {
    FilterStatusBadge
  },
  props: {
    filters: {
      type: Array,
      required: true
    }
  },
  computed: {
    badgeText () {
      return `+${this.filters.length}`
    },
    tableData () {
      return this.filters.map((filter) => ({
        name: filter.columnName,
        text: this.getFilterContentText(filter) || '－'
      }))
    }
  },
  methods: {
    getFilterContentText (filter) {
      const filterType = filter.statsType
      const rules = [
        {
          match: () => ['CATEGORY', 'BOOLEAN'].includes(filterType),
          getText: () => {
            const numOfDataValues = filter.dataValues.length
            return numOfDataValues === 0
              ? ''
              : filter.dataValues.join(', ')
          }
        },
        {
          match: () => filterType === 'NUMERIC',
          getText: () => {
            return (filter.start === null || filter.end === null)
              ? ''
              : `${filter.start} - ${filter.end}`
          }
        },
        {
          match: () => filterType === 'DATETIME',
          getText: () => {
            const getDateStrng = (fullDateString) => fullDateString.replace(/-/g, '/')
            return (filter.start === null || filter.end === null)
              ? ''
              : `${getDateStrng(filter.start)} - ${getDateStrng(filter.end)}`
          }
        },
        {
          match: () => filterType === 'RELATIVEDATETIME',
          getText: () => {
            const numOfDataValues = filter.dataValues.length
            return numOfDataValues === 0
              ? ''
              : this.$t('miniApp.' + filter.dataValues[0])
          }
        }
      ]

      const matchedRule = rules.find((rule) => rule.match())

      return matchedRule === null
        ? ''
        : matchedRule.getText()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-status-table {
  min-width: 400px;
  word-break: normal;

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table {
    background-color: transparent;
    color: #ddd;
  }

  ::v-deep .el-table td,
  ::v-deep .el-table th.is-leaf {
    border-bottom: 1px solid #52696a;
  }

  ::v-deep .el-table--border::after,
  ::v-deep .el-table--group::after,
  ::v-deep .el-table::before {
    background-color: #52696a;
  }

  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>
