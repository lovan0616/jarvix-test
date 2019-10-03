<template>
  <div class="table-responsive">
    <template v-if="isDataLoading">
      <spinner></spinner>
    </template>
    <div v-else-if="isShowChart">
      <display-basic-chart
        :dataset="{
          index: chartIndex,
          data: chartData,
          columns: chartColumns
        }"
        height="450px"
        :title="{
          xAxis: rowFields.reduce((acc, item) => acc + item.label, ''),
          yAxis: valFields[0] + $t('resultDescription.of') + aggregateNaming(aggregate)
        }"
        :addons="{
          'seriesItem:bar': {
            'large': true
          },
          'color:10': {},
          'grid:default': {},
          'xAxis:default': {},
          'yAxis:default': {}
        }"
      ></display-basic-chart>
    </div>
    <table v-else class="table table-bordered">
      <!-- Table header -->
      <thead>
        <tr
          v-for="(colField, colFieldIndex) in colFields"
          :key="`head-${JSON.stringify(colField)}`"
          v-if="colField.showHeader === undefined || colField.showHeader"
          >
          <!-- Top left dead zone -->
          <th
            v-if="colFieldIndex === firstColFieldHeaderIndex && rowHeaderSize > 0"
            :colspan="rowHeaderSize"
            :rowspan="colHeaderSize"
            ></th>
          <!-- Column headers -->
          <th
            v-for="(col, colIndex) in sortedCols"
            :key="JSON.stringify(col)"
            :colspan="spanSize('col', sortedCols, colIndex, colFieldIndex)"
            v-if="spanSize('col', sortedCols, colIndex, colFieldIndex) !== 0"
            >
            <slot v-if="colField.headerSlotName" :name="colField.headerSlotName" v-bind:value="col[`col-${colFieldIndex}`]">
              Missing slot <code>{{ colField.headerSlotName }}</code>
            </slot>
            <template v-else>
              {{ col[`col-${colFieldIndex}`] }}
            </template>
          </th>
          <!-- Top right dead zone -->
          <th
            v-if="colFieldIndex === firstColFieldHeaderIndex && rowFooterSize > 0"
            :colspan="rowFooterSize"
            :rowspan="colFooterSize"
            ></th>
        </tr>
      </thead>

      <!-- Table body -->
      <tbody>
        <tr v-for="(row, rowIndex) in sortedRows" :key="JSON.stringify(row)">
          <!-- Row headers -->
          <th
            v-for="(rowField, rowFieldIndex) in rowFields"
            :key="`head-${JSON.stringify(rowField)}`"
            :rowspan="spanSize('row', sortedRows, rowIndex, rowFieldIndex)"
            v-if="(rowField.showHeader === undefined || rowField.showHeader) && spanSize('row', sortedRows, rowIndex, rowFieldIndex) !== 0"
            >
            <slot v-if="rowField.headerSlotName" :name="rowField.headerSlotName" v-bind:value="row[`row-${rowFieldIndex}`]">
              Missing slot <code>{{ rowField.headerSlotName }}</code>
            </slot>
            <template v-else>
              {{ row[`row-${rowFieldIndex}`] }}
            </template>
          </th>
          <!-- Values -->
          <td
            v-for="col in sortedCols"
            :key="JSON.stringify(col)"
            class="text-right"
            >
            <slot v-if="$scopedSlots.value" name="value" v-bind:value="value(row, col)" />
            <template v-else>{{ value(row, col) }}</template>
          </td>
          <!-- Row footers (if slots are provided) -->
          <th
            v-for="(rowField, rowFieldIndex) in rowFieldsReverse"
            :key="`foot-${JSON.stringify(rowField)}`"
            :rowspan="spanSize('row', rows, rowIndex, rowFields.length - rowFieldIndex - 1)"
            v-if="rowField.showFooter && spanSize('row', rows, rowIndex, rowFields.length - rowFieldIndex - 1) !== 0"
            >
            <slot v-if="rowField.footerSlotName" :name="rowField.footerSlotName" v-bind:value="row[`row-${rowFields.length - rowFieldIndex - 1}`]">
              Missing slot <code>{{ rowField.footerSlotName }}</code>
            </slot>
            <template v-else>
              {{ row[`row-${rowFields.length - rowFieldIndex - 1}`] }}
            </template>
          </th>
        </tr>
      </tbody>

      <!-- Table footer -->
      <tfoot>
        <tr
          v-for="(colField, colFieldIndex) in colFieldsReverse"
          :key="`foot-${JSON.stringify(colField)}`"
          v-if="colField.showFooter">
          <!-- Bottom left dead zone -->
          <th
            v-if="colFieldIndex === firstColFieldFooterIndex && rowHeaderSize > 0"
            :colspan="rowHeaderSize"
            :rowspan="colHeaderSize"></th>
          <!-- Column footers -->
          <th
            v-for="(col, colIndex) in sortedCols"
            :key="JSON.stringify(col)"
            :colspan="spanSize('col', sortedCols, colIndex, colFields.length - colFieldIndex - 1)"
            v-if="spanSize('col', sortedCols, colIndex, colFields.length - colFieldIndex - 1) !== 0">
            <slot v-if="colField.footerSlotName" :name="colField.footerSlotName" v-bind:value="col[`col-${colFields.length - colFieldIndex - 1}`]">
              Missing slot <code>{{ colField.footerSlotName }}</code>
            </slot>
            <template v-else>
              {{ col[`col-${colFields.length - colFieldIndex - 1}`] }}
            </template>
          </th>
          <!-- Bottom right dead zone -->
          <th
            v-if="colFieldIndex === firstColFieldFooterIndex && rowFooterSize > 0"
            :colspan="rowFooterSize"
            :rowspan="colFooterSize"
            ></th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import HashTable from '@/utils/HashTable'
import { firstBy } from 'thenby'
import naturalSort from 'javascript-natural-sort'
import Spinner from '@/components/Spinner'

export default {
  name: 'PivotTable',
  components: {
    Spinner
  },
  props: {
    aggregate: {
      type: String,
      default: 'mean'
    },
    valFields: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    rowFields: {
      type: Array,
      default () {
        return []
      }
    },
    colFields: {
      type: Array,
      default () {
        return []
      }
    },
    isDataLoading: {
      type: Boolean,
      default: false
    },
    isShowChart: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valuesHashTable: null,
      cols: null,
      rows: null,
      chartInfo: {
        dataset: {
          index: [],
          data: [],
          columns: []
        },
        title: {
          xAxis: null,
          yAxis: null
        }
      }
    }
  },
  created () {
    this.computeData()
  },
  computed: {
    chartColumns () {
      return this.sortedCols.map(element => element['col-0'])
    },
    chartIndex () {
      return this.sortedRows.map(element => {
        return Object.values(element).reduce((acc, item, index) => index === 0 ? item : acc + '-' + item, '')
      })
    },
    chartData () {
      let chartDataList = []
      for (let i = 0; i < this.sortedRows.length; i++) {
        chartDataList.push([])
        for (let j = 0; j < this.sortedCols.length; j++) {
          let objValue = this.value(this.sortedRows[i], this.sortedCols[j])
          chartDataList[i].push(objValue)
        }
      }
      return chartDataList
    },
    // Sort cols/rows using a composed function built with thenBy.js
    sortedCols () {
      let composedSortFunction
      this.colFields.forEach((colField, colFieldIndex) => {
        if (colFieldIndex === 0) {
          composedSortFunction = firstBy('col-0', { cmp: colField.sort || naturalSort })
        } else {
          composedSortFunction = composedSortFunction.thenBy(`col-${colFieldIndex}`, { cmp: colField.sort || naturalSort })
        }
      })

      return JSON.parse(JSON.stringify(this.cols)).sort(composedSortFunction)
    },
    sortedRows () {
      let composedSortFunction
      this.rowFields.forEach((rowField, rowFieldIndex) => {
        if (rowFieldIndex === 0) {
          composedSortFunction = firstBy('row-0', { cmp: rowField.sort || naturalSort })
        } else {
          composedSortFunction = composedSortFunction.thenBy(`row-${rowFieldIndex}`, { cmp: rowField.sort || naturalSort })
        }
      })

      return JSON.parse(JSON.stringify(this.rows)).sort(composedSortFunction)
    },
    // Compound property for watch single callback
    fields () {
      return [this.colFields, this.rowFields]
    },
    // Reversed props for footer iterators
    colFieldsReverse () {
      return this.colFields.slice().reverse()
    },
    rowFieldsReverse () {
      return this.rowFields.slice().reverse()
    },
    // Number of col header rows
    colHeaderSize () {
      return this.colFields.filter(colField => colField.showHeader === undefined || colField.showHeader).length
    },
    // Number of col footer rows
    colFooterSize () {
      return this.colFields.filter(colField => colField.showFooter).length
    },
    // Number of row header columns
    rowHeaderSize () {
      return this.rowFields.filter(rowField => rowField.showHeader === undefined || rowField.showHeader).length
    },
    // Number of row footer columns
    rowFooterSize () {
      return this.rowFields.filter(rowField => rowField.showFooter).length
    },
    // Index of the first column field header to show - used for table header dead zones
    firstColFieldHeaderIndex () {
      return this.colFields.findIndex(colField => colField.showHeader === undefined || colField.showHeader)
    },
    // Index of the first column field footer to show - used for table footer dead zones
    firstColFieldFooterIndex () {
      return this.colFieldsReverse.findIndex(colField => colField.showFooter)
    }
  },
  methods: {
    aggregateNaming (aggr) {
      return this.$t(`aggregation.${aggr}`)
    },
    // Get value from valuesHashTable
    value (row, col) {
      let data = this.valuesHashTable.get({...row, ...col}) || []
      let result = 0
      if (this.aggregate === 'sum') {
        result = data.reduce((a, b) => a + b, 0)
      } else if (this.aggregate === 'count') {
        result = data.length
      } else if (this.aggregate === 'max') {
        result = Math.max.apply(Math, data)
      } else if (this.aggregate === 'min') {
        result = Math.min.apply(Math, data)
      } else if (this.aggregate === 'std') {
        const usePopulation = false
        const mean = data.reduce((acc, val) => acc + val, 0) / data.length
        result = Math.sqrt(
          data.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) /
            (data.length - (usePopulation ? 0 : 1))
        )
      } else if (this.aggregate === 'median') {
        const mid = Math.floor(data.length / 2)
        const nums = [...data].sort((a, b) => a - b)
        result = data.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
      } else { // mean
        result = data.reduce((a, b) => a + b, 0) / data.length
      }
      result = Math.round(result * 100) / 100
      return result
    },
    // Get colspan/rowspan size
    spanSize (type, values, valueIndex, fieldIndex) {
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (valueIndex > 0 &&
        values[valueIndex - 1][`${type}-${fieldIndex}`] === values[valueIndex][`${type}-${fieldIndex}`] &&
        (fieldIndex === 0 || (this.spanSize(type, values, valueIndex, fieldIndex - 1) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = valueIndex
      while (i + 1 < values.length &&
        values[i + 1][`${type}-${fieldIndex}`] === values[i][`${type}-${fieldIndex}`] &&
        (fieldIndex === 0 || (i + 1 < values.length && this.spanSize(type, values, i + 1, fieldIndex - 1) === 0))) {
        i++
        size++
      }

      return size
    },
    // Called when fields have changed => recompute cols/rows/values
    computeData () {
      const cols = []
      const rows = []
      const valuesHashTable = new HashTable()
      const countTable = new HashTable()

      this.data.forEach((item, dataIndex) => {
        // Update cols/rows
        const colKey = {}
        this.colFields.forEach((field, index) => {
          colKey[`col-${index}`] = field.getter(item)
        })

        if (!cols.some(col => {
          return this.colFields.every((colField, index) => col[`col-${index}`] === colKey[`col-${index}`])
        })) {
          cols.push(colKey)
        }

        const rowKey = {}
        this.rowFields.forEach((field, index) => {
          rowKey[`row-${index}`] = field.getter(item)
        })

        if (!rows.some(row => {
          return this.rowFields.every((rowField, index) => row[`row-${index}`] === rowKey[`row-${index}`])
        })) {
          rows.push(rowKey)
        }

        // Update valuesHashTable
        const key = { ...colKey, ...rowKey }
        const previousValue = valuesHashTable.get(key) || []
        const previousCount = countTable.get(key) || 0

        valuesHashTable.set(key, this.collector(previousValue, item[this.valFields[0]], previousCount))
        countTable.set(key, previousCount + 1)
      })

      this.cols = cols
      this.rows = rows
      this.valuesHashTable = valuesHashTable
    },
    collector (previous, data, previousCount) {
      previous.push(data)
      return previous
    }
  },
  watch: {
    fields () {
      this.computeData()
    },
    data () {
      this.computeData()
    }
  }
}
</script>

<style scoped>
td {
  min-width: 100px;
}
</style>
