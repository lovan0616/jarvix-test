<template>
  <div class="display-pivot-table">
    <div class="button-block">
      <button class="btn btn-default"
        v-show="!isShowChart"
        @click="showChart"
      >显示图表</button>
      <button class="btn btn-default"
        v-show="isShowChart"
        @click="showData"
      >显示数据</button>
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
      <template slot="value" slot-scope="{ value }">
        <div class="empty-content" v-if="value == 0">--</div>
        <div class="td-content" v-else>{{ value }}</div>
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
  props: [
    'dataset',
    'availableFields',
    'rowFields',
    'colFields',
    'valFields',
    'aggregate',
    'defaultShowSettings'
  ],
  data () {
    return {
      isShowChart: false,
      tempArray: []
    }
  },
  methods: {
    showChart () {
      this.isShowChart = true
    },
    showData () {
      this.isShowChart = false
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
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid rgba(#fff, 0.3);
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

      .td-content {
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
