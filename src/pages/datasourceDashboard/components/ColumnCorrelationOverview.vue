<template>
  <section
    v-if="!isEmpty"
    class="column-correlation"
  >
    <div class="overview-section">
      <div class="overview-section__title">
        {{ $t('resultDescription.columnCorrelationOverview') }}
        <span class="nav-item nav-function tooltip-container">
          <svg-icon
            class="icon"
            icon-class="information-circle"
          />
          <div class="tooltip">{{ $t('resultDescription.filterColumnCorrelation') }}</div>
        </span>
      </div>
      <spinner
        v-if="isLoading"
      />
      <div
        v-else-if="!isLoading && componentData && !hasError"
        class="chart"
      >
        <display-heat-map-chart
          :dataset="componentData.dataset"
          class="chart__display"
          width="100%"
          height="100%"
        />
        <div class="chart__description description">
          <div class="description__container">
            <div class="description__item description__item--min">
              {{ $t('resultDescription.highlyNegativeCorrelated') }}
            </div>
            <div class="description__item description__item--zero">
              {{ $t('resultDescription.notCorrelated') }}
            </div>
            <div class="description__item description__item--max">
              {{ $t('resultDescription.highlyPositiveCorrelated') }}
            </div>
          </div>
        </div>
      </div>
      <empty-info-block
        v-else
        :msg="reminderMsg"
      />
    </div>
    <!--暫時不顯示高度關聯區塊-->
    <!-- <div class="overview-section">
      <div class="title">
        {{ $t('resultDescription.strongCorrelationColumns') }}
        <span class="nav-item nav-function tooltip-container">
          <svg-icon icon-class="information-circle" class="icon" />
          <div class="tooltip">{{$t('resultDescription.correlationRange', {min: degreeMin, max: degreeMax})}}</div>
        </span>
      </div>
      <spinner
        v-if="isLoading"
      ></spinner>
      <crud-table
        class="high-correlation-table"
        v-else
        :headers="tableHeaders"
        :data-list.sync="correlationData"
        :loading="isLoading"
        :empty-message="hasError ? $t('message.systemIsError') : $t('resultDescription.noStrongCorrelationColumns')"
      />
    </div> -->
  </section>
</template>

<script>
import DisplayHeatMapChart from '@/pages/datasourceDashboard/components/DisplayHeatMapChart'
import CrudTable from '@/components/table/CrudTable'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import { mapGetters } from 'vuex'

// const dummyData = {
//   overview: {
//     data: [[-1, 0.1, 0.4, -0.4], [0.7, 0.3, -0.2, 0.0], [0.3, 0.1, 0.3, 0.6], [-0.9, 0.5, 0.3, -0.6], [0.3, 0.1, 0.3, 0.6]],
//     columnNameList: ['apple22222222', 'dddddddddd', 'c', 'd']
//   },
//   top: [
//     {
//       degree: '0.88',
//       fistColumnName: 'column a erewrererererererwrewrewrewr',
//       secondColumnName: 'column bewrewrererererererewrewrewrrewr'
//     },
//     {
//       degree: '0.98',
//       fistColumnName: 'column a',
//       secondColumnName: 'column b'
//     }
//   ]
// }

export default {
  components: {
    DisplayHeatMapChart,
    EmptyInfoBlock,
    CrudTable
  },
  props: {
    dataFrameId: {
      type: Number,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      componentData: null,
      isLoading: true,
      hasError: false,
      tableHeaders: [
        {
          text: this.$t('resultDescription.degreeOfCorrelation'),
          value: 'degree',
          width: '35%'
        },
        {
          text: this.$t('resultDescription.columnCorrelationName'),
          value: 'fistColumnName',
          width: '32%'
        },
        {
          text: '',
          value: 'icon',
          width: '1%',
          align: 'center'
        },
        {
          text: '',
          value: 'secondColumnName',
          width: '32%'
        }
      ],
      correlationData: [],
      // TODO: 待 DS 關聯度區間
      degreeMin: 0.3,
      degreeMax: 1,
      isEmpty: false,
      timeoutFunction: null
    }
  },
  computed: {
    ...mapGetters('dataFrameAdvanceSetting', ['selectedColumnList', 'askCondition']),
    reminderMsg () {
      return this.hasError ? this.$t('message.systemIsError') : this.$t('message.noData')
    },
    filterRestrictionList () {
      return this.$store.getters['dataSource/filterRestrictionList']
    }
  },
  watch: {
    askCondition: {
      deep: true,
      handler (newValue, oldValue) {
        if (
          this.mode === 'popup' 
          // 初次開啟設定時不觸發
          || (oldValue.isInit === false && oldValue.columnList === null)
          // 切換 dataframe 清空設定時不觸發
          || newValue.isInit === false
        ) return
        this.fetchData()
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed() {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    fetchData () {
       window.clearTimeout(this.timeoutFunction)

      // reset status
      this.isLoading = true
      this.hasError = false
      this.isEmpty = false

      let selectedColumnList = null
      let restrictions = []
      
      // 智能分析頁面需要帶入 column list
      if (this.mode === 'display') {
        selectedColumnList = this.selectedColumnList
        restrictions = this.filterRestrictionList
      }
      
      this.$store.dispatch('dataSource/getDataFrameColumnCorrelation', { 
        id: this.dataFrameId, 
        selectedColumnList, 
        restrictions 
      })
        .then(response => {
          switch (response.statusType) {
            // 處理舊資料或新資料需重新被計算的狀態
            case 'Process':
            case 'Ready': 
              this.timeoutFunction = window.setTimeout(() => this.fetchData(), 10000)
              return
            // 計算錯誤時，不顯示結果
            case 'Fail':
              this.isEmpty = true
              this.isLoading = false
              return
          }

          const columnNameList = response.columnNameList
          const columnDataList = response.data

          // 無資料時，不顯示結果
          if (!columnNameList || columnNameList.length === 0 || !columnDataList || columnDataList.length === 0) {
            this.isEmpty = true
            this.isLoading = false
            return
          }

          this.componentData = {
            dataset: {
              data: this.formatData(columnDataList, columnNameList),
              index: [columnNameList, columnNameList],
              range: [0, 1]
            }
          }

          this.isLoading = false

          // this.correlationData = dummyData.top
          // //  TODO: 增加關聯欄位間的正確 icon
          // this.correlationData = this.correlationData.map(data => ({
          //   ...data,
          //   icon: 'arrow-right'
          // }))
        })
        .catch(() => {
          this.isLoading = false
          this.hasError = true
        })
    },
    formatData (dataList, nameList) {
      const result = []
      dataList.forEach((row, yAxisIndex) => {
        row.forEach((column, xAxisIndex) => {
          const columnValue = column === null ? '-' : this.roundNumber(column, 2)
          result.push([nameList[xAxisIndex], nameList[yAxisIndex], columnValue])
        })
      })
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-section {
  &:not(:last-of-type) {
    margin-bottom: 1.3rem;
  }

  &__title {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 14px;
  }

  .chart {
    position: relative;
    width: 50%;
    /* 讓圖表盡量呈現正方形 */
    padding-top: 40%;
    margin: 0 auto;

    &__display {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    &__description {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
    }
  }

  .description {
    &__container {
      margin: 0 auto;
      width: 330px;
      font-size: 12px;
      color: #CCCCCC;
      display: flex;
      justify-content: space-between;
      padding-top: 15px;
    }

    &__item {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        border-top: 6px solid transparent;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid #CCCCCC;
      }

      &--min {
        transform: translateX(-50%);
      }

      &--max {
        transform: translateX(50%);
      }
    }
  }

  .tooltip-container {
    z-index: 1;
    .tooltip {
      width: 190px;
      text-align: center;
      white-space: normal;
      padding: 8px;
      line-height: 14px;
      color: #DDDDDD;
    }

    .icon {
      color: $theme-color-warning;
    }
  }
}

</style>
