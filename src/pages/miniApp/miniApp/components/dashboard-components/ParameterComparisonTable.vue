<template>
  <div class="parameter-comparison-table">
    <spinner 
      v-if="isLoading" 
    />
    <display-parallel-bar-chart
      v-else
      :dataset="parallelBarData.dataset"
      :title="parallelBarData.title"
      :is-show-label-data="true"
      :height="'420px'"
    />
    <div class="comparison-table table">
      <div class="table__header">
        <div
          v-for="(name, index) in comparisonTableData.columns" 
          :key="index"
          class="table__cell">
          {{ name }}
        </div>
      </div>
      <div class="table__body">
        <div
          v-for="(row, index) in comparisonTableData.data" 
          :key="index"
          class="table__body--row">
          <div
            v-for="(item, index) in row" 
            :key="index"
            :class="{'cell-highlight': index === 2 && isValueDifferent(row)}"
            class="table__cell">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DisplayParallelBarChart from '@/components/display/DisplayParallelBarChart.vue'

export default {
  name: 'ParametercomparisonTable',
  components: {
    DisplayParallelBarChart,
  },
  props: {
    parallelBarData: {
      type: Object,
      default: () => { 
        return {
          dataset: {
            columns: ['參數數值'],
            data: [[44.3], [46.4], [45.2], [46.1], [44.4], [46.2], [45.2], [46.5]],
            display_columns: ['參數數值'],
            display_index: [['x1', 'ori'], ['x1', 'opt'],['x2', 'ori'], ['x2', 'opt'], ['x3', 'ori'], ['x3', 'opt'], ['x4', 'ori'], ['x4', 'opt']],
            index: [['x1', 'ori'], ['x1', 'opt'],['x2', 'ori'], ['x2', 'opt'], ['x3', 'ori'], ['x3', 'opt'], ['x4', 'ori'], ['x4', 'opt']]
          },
          title: {
            xAxis: [
              {
                data_type: "string",
                dc_id: 92483,
                dc_name: "c2",
                display_name: "參數名稱",
                drillable: true,
                is_feature: null,
                lowerLimit: null,
                operator: null,
                stats_type: "category",
                upperLimit: null
              },
              {
                data_type: "string",
                dc_id: 92483,
                dc_name: "c2",
                display_name: "參數種類",
                drillable: true,
                is_feature: null,
                lowerLimit: null,
                operator: null,
                stats_type: "category",
                upperLimit: null
              }
            ],
            yAxis: [
              {
                data_type: null,
                dc_id: null,
                dc_name: "c2",
                display_name: "電壓值",
                drillable: true,
                is_feature: null,
                lowerLimit: null,
                operator: null,
                stats_type: null,
                upperLimit: null
              }
            ]
          },
        }
      }
    }
  },
	data () {
    return {
      isLoading: false
    }
  },
  computed: {
    comparisonTableData () {
      let columns =  [this.parallelBarData.title.xAxis[0]['display_name'], this.parallelBarData.dataset.display_index[0][1], this.parallelBarData.dataset.display_index[1][1]]
      let data = []
      for(let i=0; i<this.parallelBarData.dataset.data.length; i+=2) {
        data.push([this.parallelBarData.dataset.display_index[i][0], this.parallelBarData.dataset.data[i][0], this.parallelBarData.dataset.data[i+1][0]])
      }
      return {
        columns,
        data
      }
    }
  },
  mounted () {

  },
  methods: {
    isValueDifferent (data) {
      return data[1] !== data[2]
    }
  }
}
</script>

<style lang="scss" scoped>
.parameter-comparison-table {
  .comparison-table {
    width: 100%;
  }

  .table {
    &__header {
      display: flex;
      flex-direction: row;
      margin-bottom: 8px;
      padding: 10px 16px;
      font-weight: 600;
      color: #999999;
    }

    &__body { 

      &--row {
        display: flex;
        flex-direction: row; 
        margin-bottom: 8px;
        padding: 10px 16px;
        background-color: #1C292B;
        border-radius: 5px;
      }
    }

    &__cell {
      width: 33.3%;
      line-height: 20px;
    }

    .cell-highlight {
      position: relative;
      color: #2AD2E2;

      &:before {
        position: absolute;
        top: 6px;
        left: -14px;
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 4px 0 4px 6px;
        border-color: transparent transparent transparent #2AD2E2;
      }
    }
  } 
  
}
</style>