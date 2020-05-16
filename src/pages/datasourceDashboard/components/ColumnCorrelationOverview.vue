<template>
  <section class="column-correlation">
    <div class="overview-section">
      <div class="title">{{ $t('resultDescription.columnCorrelationOverview') }}</div>
      <spinner
        v-if="isLoading"
      ></spinner>
      <display-heat-map-chart
        :dataset="componentData.dataset"
        v-else-if="!isLoading && componentData && !hasError"
      />
      <empty-info-block
        v-else
        :msg="hasError ? $t('message.systemIsError') : $t('message.noData')"
      ></empty-info-block>
    </div>
    <div class="overview-section">
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
    </div>
  </section>
</template>

<script>
import DisplayHeatMapChart from '@/pages/datasourceDashboard/components/DisplayHeatMapChart'
import CrudTable from '@/components/table/CrudTable'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

const dummyData = {
  overview: {
    data: [['apple22222222', 'apple22222222', 0.5], ['dddddddddd', 'apple22222222', 0.1], ['c', 'apple22222222', 0.4], ['d', 'apple22222222', 0.4], ['apple22222222', 'dddddddddd', 0.7], ['dddddddddd', 'dddddddddd', 0.3], ['c', 'dddddddddd', 0.2], ['d', 'dddddddddd', 0.0], ['apple22222222', 'c', 0.3], ['dddddddddd', 'c', 0.1], ['c', 'c', 0.3], ['d', 'c', 0.6], ['apple22222222', 'd', 0.9], ['dddddddddd', 'd', 0.5], ['c', 'd', 0.3], ['d', 'd', 0.6], ['apple22222222', 'e', 0.3], ['dddddddddd', 'e', 0.1], ['c', 'e', 0.3], ['d', 'e', 0.6]],
    index: [['apple22222222', 'dddddddddd', 'c', 'd'], ['apple22222222', 'dddddddddd', 'c', 'd', 'e']]
  },
  top: [
    {
      degree: '0.88',
      fistColumnName: 'column a erewrererererererwrewrewrewr',
      secondColumnName: 'column bewrewrererererererewrewrewrrewr'
    },
    {
      degree: '0.98',
      fistColumnName: 'column a',
      secondColumnName: 'column b'
    }
  ]
}

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
      degreeMax: 1
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.$store.dispatch('dataSource/getDataFrameColumnCorrelation', {id: this.dataFrameId})
        .then(response => {
          // TODO: 處理從 API 取得的資料
          this.componentData = {
            dataset: {
              data: dummyData.overview.data,
              index: dummyData.overview.index,
              range: [0, 1]
            }
          }
          this.correlationData = dummyData.top
          //  TODO: 增加關聯欄位間的正確 icon
          this.correlationData = this.correlationData.map(data => ({
            ...data,
            icon: 'arrow-right'
          }))
          this.isLoading = false
        })
        .catch(() => {
          this.hasError = true
          this.isLoading = false
        })
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
    font-size: 24px;
    line-height: 32px;
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
}
</style>
