<template>
  <section
    v-if="!isEmpty"
    class="column-correlation"
  >
    <div class="overview-section">
      <div class="title">
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
        v-else-if="!isLoading && componentData && !hasError && !isCalculating"
      >
        <display-heat-map-chart
          :dataset="componentData.dataset"
        />
        <div class="descrtipion">
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
    }
  },
  data () {
    return {
      componentData: null,
      isLoading: true,
      isCalculating: false,
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
      isEmpty: false
    }
  },
  computed: {
    reminderMsg () {
      if (this.isCalculating) return this.$t('message.calculatingPleaseTryLater')
      return this.hasError ? this.$t('message.systemIsError') : this.$t('message.noData')
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.$store.dispatch('dataSource/getDataFrameColumnCorrelation', { id: this.dataFrameId })
        .then(response => {
          const columnNameList = response.columnNameList
          const columnDataList = response.data
          // 處理舊資料需被計算的狀態
          if (response.statusType === 'Process' || response.statusType === 'Ready') {
            this.isCalculating = true
            return
          }
          // 無資料或計算錯誤時，不顯示結果
          if (response.statusType === 'Fail' || !columnNameList.length || !columnDataList.length) {
            this.isEmpty = true
            return
          }

          if (!columnNameList || !columnDataList) return

          this.componentData = {
            dataset: {
              data: this.formatData(columnDataList, columnNameList),
              index: [columnNameList, columnNameList],
              range: [0, 1]
            }
          }

          // this.correlationData = dummyData.top
          // //  TODO: 增加關聯欄位間的正確 icon
          // this.correlationData = this.correlationData.map(data => ({
          //   ...data,
          //   icon: 'arrow-right'
          // }))
        })
        .catch(() => { this.hasError = true })
        .finally(() => { this.isLoading = false })
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

  .title {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 14px;
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
}

</style>
