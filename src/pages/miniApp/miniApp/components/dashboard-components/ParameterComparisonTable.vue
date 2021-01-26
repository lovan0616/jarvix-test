<template>
  <div class="parameter-comparison-table">
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

export default {
  name: 'ParameterComparisonTable',
  props: {
    dataset: {
      type: Object,
      default: () => { 
        return {
          data: [
            [
              "有折扣",
              "原始",
              "有折扣"
            ],
            [
              "有折扣",
              "推薦優化",
              "有折扣"
            ],
            [
              "業務人員",
              "原始",
              "陳俊仁"
            ],
            [
              "業務人員",
              "推薦優化",
              "周於倫"
            ],
            [
              "拜訪次數",
              "原始",
              "1"
            ],
            [
              "拜訪次數",
              "推薦優化",
              "1"
            ],
            [
              "報價時間",
              "原始",
              "8"
            ],
            [
              "報價時間",
              "推薦優化",
              "14"
            ],
            [
              "工程師支援",
              "原始",
              "沒有"
            ],
            [
              "工程師支援",
              "推薦優化",
              "沒有"
            ],
            [
              "提供試用",
              "原始",
              "沒有"
            ],
            [
              "提供試用",
              "推薦優化",
              "沒有"
            ],
            [
              "試用時長",
              "原始",
              "0"
            ],
            [
              "試用時長",
              "推薦優化",
              "14"
            ],
            [
              "執行時間",
              "原始",
              "0"
            ],
            [
              "執行時間",
              "推薦優化",
              "15"
            ]
          ],
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
      let columns =  ['欄位名稱', '原始', '推薦優化']
      let newData = []

      for(let i=0; i<this.dataset.data.length; i+=2) {
        newData.push([this.dataset.data[i][0], this.dataset.data[i][2], this.dataset.data[i+1][2]])
      }

      return {
        columns,
        data: newData
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
    height: 100%;
    overflow-y: auto;
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