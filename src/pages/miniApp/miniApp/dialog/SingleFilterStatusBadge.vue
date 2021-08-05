<template>
  <filter-status-badge
    :badge-text="badgeText"
    :active="active"
  >
    <div
      class="filter-status-content"
      slot="content"
    >
      <div class="content-block">
        <!-- TODO: vue-i18n -->
        <div class="bold">
          篩選狀態:
        </div>
        <div>{{ statusText }}</div>
      </div>
      <div
        v-if="contentText"
        class="content-block"
      >
        <!-- TODO: vue-i18n -->
        <div class="bold">
          篩選內容:
        </div>
        <div>{{ contentText }}</div>
      </div>
    </div>
  </filter-status-badge>
</template>

<script>
import FilterStatusBadge from './FilterStatusBadge'

export default {
  name: 'SingleFilterStatusBadge',
  components: {
    FilterStatusBadge
  },
  props: {
    active: {
      type: Boolean,
      default: () => false
    },
    filter: {
      type: Object,
      required: true
    }
  },
  computed: {
    filterType () {
      return this.filter.statsType
    },
    statusText () {
      // TODO: vue-i18n
      return this.active ? '條件套用中' : '條件未套用'
    },
    contentText () {
      const rules = [
        {
          match: () => ['CATEGORY', 'BOOLEAN'].includes(this.filterType),
          getText: () => {
            const numOfDataValues = this.filter.dataValues.length
            return numOfDataValues === 0
              ? ''
              : this.filter.dataValues.join(', ')
          }
        },
        {
          match: () => this.filterType === 'NUMERIC',
          getText: () => {
            return (this.filter.start === null || this.filter.end === null)
              ? ''
              : `${this.filter.start} - ${this.filter.end}`
          }
        },
        {
          match: () => this.filterType === 'DATETIME',
          getText: () => {
            const getDateStrng = (fullDateString) => fullDateString.replace(/-/g, '/')
            return (this.filter.start === null || this.filter.end === null)
              ? ''
              : `${getDateStrng(this.filter.start)} - ${getDateStrng(this.filter.end)}`
          }
        },
        {
          match: () => this.filterType === 'RELATIVEDATETIME',
          getText: () => {
            const numOfDataValues = this.filter.dataValues.length
            return numOfDataValues === 0
              ? ''
              : this.$t('miniApp.' + this.filter.dataValues[0])
          }
        }
      ]

      const matchedRule = rules.find((rule) => rule.match())

      return matchedRule === null
        ? ''
        : matchedRule.getText()
    },
    badgeText () {
      const columnName = this.filter.columnName
      const rules = [
        {
          match: () => ['CATEGORY', 'BOOLEAN'].includes(this.filterType),
          getText: () => {
            const numOfDataValues = this.filter.dataValues.length
            return numOfDataValues === 0
              ? columnName
              : `${columnName} (${numOfDataValues})`
          }
        },
        {
          match: () => this.filterType === 'NUMERIC',
          getText: () => {
            return (this.filter.start === null || this.filter.end === null)
              ? columnName
              : `${columnName} (${this.filter.start} - ${this.filter.end})`
          }
        },
        {
          match: () => this.filterType === 'DATETIME',
          getText: () => {
            const getDateStrng = (fullDateString) => fullDateString.replace(/-/g, '/')
            return (this.filter.start === null || this.filter.end === null)
              ? columnName
              : `${columnName} (${getDateStrng(this.filter.start)} - ${getDateStrng(this.filter.end)})`
          }
        },
        {
          match: () => this.filterType === 'RELATIVEDATETIME',
          getText: () => {
            const numOfDataValues = this.filter.dataValues.length
            return numOfDataValues === 0
              ? columnName
              : `${columnName} (${this.$t('miniApp.' + this.filter.dataValues[0])})`
          }
        }
      ]

      const matchedRule = rules.find((rule) => rule.match())

      return matchedRule === null
        ? columnName
        : matchedRule.getText()
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.filter-status-content {
  min-width: 200px;
  padding: 12px;

  .content-block {
    font-size: 12px;
    line-height: 20px;
    padding: 4px 0;

    .bold {
      font-weight: 600;
    }
  }
}
</style>
