<template>
  <div class="column-summary">
    <div
      v-if="showHistogram"
      class="data-block"
    >
      <display-histogram-chart :dataset="histogramData" />
    </div>
    <div class="data-block">
      <ul class="list">
        <li
          v-for="(value, name) in descriptionList"
          :class="{'list__item--date':summaryData.statsType === 'DATETIME'}"
          :key="name + value"
          class="list__item"
        >
          <div class="list__item--name">
            <el-tooltip
              slot="label"
              :enterable="false"
              :popper-class="'column-summary__tooltip'"
              :visible-arrow="false"
              :content="`${name}`"
              placement="bottom-start"
            >
              <span>{{ name }}</span>
            </el-tooltip>
          </div>
          <div class="list__item--value">
            <el-tooltip
              slot="label"
              :enterable="false"
              :visible-arrow="false"
              :popper-class="'column-summary__tooltip'"
              placement="bottom-start"
            >
              <template slot="content">
                <span v-if="typeof value === 'string'">{{ value }}</span>
                <span v-else>{{ value.start + '-' }}<br>{{ value.end }}</span>
              </template>
              <span v-if="typeof value === 'string'">{{ value }}</span>
              <span v-else>{{ value.start + '-' }}<br>{{ value.end }}</span>
            </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DisplayHistogramChart from './DisplayHistogramChart'

export default {
  name: 'DataColumnSummary',
  components: {
    DisplayHistogramChart
  },
  props: {
    summaryData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    showHistogram () {
      const statesType = this.summaryData.statsType
      const distinctCount = this.summaryData.distinct_count
      return statesType === 'NUMERIC' && distinctCount > 1
    },
    histogramData () {
      if (this.summaryData.statsType !== 'NUMERIC') return
      const stateMeta = this.summaryData.numeric_stats_meta
      return {
        data: stateMeta.bins.map(rangeData => rangeData.count),
        range: [Number(stateMeta.min), Number(stateMeta.max)]
      }
    },
    descriptionList () {
      return {
        ...this.additionalDescription,
        ...this.dataTypeDescriptionList
      }
    },
    dataTypeDescriptionList () {
      const distinctCount = this.summaryData.distinct_count
      if (distinctCount <= 1) return
      const totlaRowsWithData = this.summaryData.total_count
      switch (this.summaryData.statsType) {
        case 'CATEGORY': {
          const {
            largest_value: largestValue,
            largest_value_count: largestValueCount,
            second_largest_value: secondaryValue,
            second_largest_value_count: secondaryValueCount
          } = this.summaryData.category_stats_meta || {}
          const showLargestValue = largestValue || largestValue === ''
          const showSecondaryValue = secondaryValue || secondaryValue === ''
          return {
            ...(showLargestValue && { [largestValue || `(${this.$t('columnSummary.emptyString')})`]: this.formatPercentage(largestValueCount / totlaRowsWithData) }),
            ...(showSecondaryValue && { [secondaryValue || `(${this.$t('columnSummary.emptyString')})`]: this.formatPercentage(secondaryValueCount / totlaRowsWithData) }),
            [this.$t('columnSummary.distinctCount')]: `${this.formatComma(this.summaryData.distinct_count)} ${this.$t('columnSummary.record')}`
          }
        }
        case 'DATETIME': {
          const {
            min_timestamp: startDate,
            max_timestamp: endDate
          } = this.summaryData.datetime_stats_meta
          return {
            [this.$t('columnSummary.range')]: {
              start: startDate,
              end: endDate
            }
          }
        }
        case 'BOOLEAN': {
          const {
            true_count: trueCount,
            false_count: falseCount
          } = this.summaryData.boolean_stats_meta
          return {
            True: this.formatPercentage(trueCount / this.summaryData.total_count),
            False: this.formatPercentage(falseCount / this.summaryData.total_count)
          }
        }
        case 'NUMERIC': {
          const { avg, sum, stdev } = this.summaryData.numeric_stats_meta
          return {
            [this.$t('columnSummary.avg')]: this.formatNumeric(avg),
            [this.$t('columnSummary.sum')]: this.formatNumeric(sum),
            [this.$t('columnSummary.stdev')]: this.formatNumeric(stdev)
          }
        }
      }
    },
    additionalDescription () {
      const nullPercentage = this.summaryData.null_count / this.summaryData.total_count
      const constValue = this.summaryData.constant
      const showConst = constValue || constValue === ''
      return {
        ...(nullPercentage && { Null: this.formatPercentage(this.summaryData.null_count / this.summaryData.total_count) }),
        ...(showConst && { [this.$t('columnSummary.const')]: this.summaryData.constant || `(${this.$t('columnSummary.emptyString')})` })
      }
    }
  },
  methods: {
    formatNumeric (value) {
      if (typeof value === 'string') value = Number(value)
      if (Math.abs(value) < 0.01) return `${value}`
      return this.formatComma(this.roundNumber(value, 2))
    },
    formatPercentage (value) {
      if (value === 0) return value
      if (!value) return
      let valueInPercentage = value * 100
      if (Number.isInteger(valueInPercentage)) return this.formatComma(valueInPercentage) + '%'
      if (Math.abs(valueInPercentage) < 0.01) return '<' + Math.sign(valueInPercentage) * 0.01 + '%'
      return this.formatComma(this.roundNumber(valueInPercentage, 2)) + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
.column-summary {
  font-size: 12px;

  .data-block:not(:last-of-type) {
    margin-bottom: 12px;
  }

  .list {
    margin: 0;
    padding: 0;

    &__item {
      list-style-type: none;
      display: flex;
      padding: 0px 0;
      font-weight: normal;
      justify-content: space-between;

      &--name,
      &--value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &--name {
        width: 50%;
      }

      &--value {
        width: 50%;
        text-align: right;
      }

      &--date {
        .list__item--name {
          width: 18%;
        }
        .list__item--value {
          width: 82%;
          overflow: visible;
          text-overflow: clip;
          white-space: normal;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-tooltip__popper.column-summary__tooltip {
  max-width: 200px;
  box-shadow: 0px 4px 10px rgba(58, 178, 189, 0.5);
  line-height: 17px;
}

// .column-summary__tooltip.popper__arrow {
//   left: 0px;
// }
.el-tooltip__popper .popper__arrow {
  left: 0;
}
</style>
