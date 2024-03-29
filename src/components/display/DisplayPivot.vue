<template>
  <div class="display-pivot-table">
    <div class="button-block">
      <button
        v-show="!isShowChart"
        class="btn btn-default"
        @click="showChart"
      >
        {{ $t('resultDescription.displayChart') }}
      </button>
      <button
        v-show="isShowChart"
        class="btn btn-default"
        @click="showData"
      >
        {{ $t('resultDescription.displayData') }}
      </button>
    </div>
    <pivot-table
      :data="Object.freeze(dataset)"
      :fields="availableFields.map(field => ({
        getter: item => item[field],
        label: field
      }))"
      :row-fields="rowFields.map(field => ({
        getter: item => item[field],
        label: field
      }))"
      :col-fields="colFields.map(field => ({
        getter: item => item[field],
        label: field
      }))"
      :val-fields="valFields"
      :aggregate="aggregate"
      :is-show-chart="isShowChart"
    >
      <!-- Optional slots can be used for formatting table headers and values, see documentation below -->
      <template
        slot="value"
        slot-scope="{ value }"
      >
        <div
          v-if="value == 0"
          class="empty-content"
        >
          --
        </div>
        <div
          v-else
          class="td-content"
        >
          {{ roundDecimal(value, 3) }}
        </div>
      </template>
    </pivot-table>
  </div>
</template>
<script>
import PivotTable from '@/components/PivotTable'

export default {
  name: 'DisplayPivot',
  components: {
    PivotTable
  },
  props: {
    dataset: {
      type: Array,
      default: () => []
    },
    availableFields: {
      type: Array,
      default: () => []
    },
    rowFields: {
      type: Array,
      default: () => []
    },
    colFields: {
      type: Array,
      default: () => []
    },
    valFields: {
      type: Array,
      default: () => []
    },
    aggregate: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isShowChart: true,
      tempArray: []
    }
  },
  methods: {
    showChart () {
      this.isShowChart = true
    },
    showData () {
      this.isShowChart = false
    },
    roundDecimal (val, precision) {
      return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0))
    }
  }
}
</script>
<style lang="scss">
.display-pivot-table {
  .button-block {
    margin-bottom: 32px;
    text-align: right;
  }
  .table-responsive {
    overflow: auto;

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid rgba(#fff, 0.3);
      max-width: 100%;
      white-space: nowrap;
    }

    th {
      text-align: left;
      padding: 4px 8px;
    }

    td.font-weight-bold {
      font-weight: bold;
      padding: 0 12px;
    }

    td.text-right {
      min-width: 116px;
      padding: 8px;

      .empty-content {
        min-width: auto;
      }
    }
  }

  .btn-outline-primary {
    display: none;
    color: #65cfd9;
    background-color: rgba(255, 255, 255, .16);
    padding: 15px 12px;
    border-radius: 4px;
    border: 0;
    margin-bottom: 6px;
  }
}
</style>
