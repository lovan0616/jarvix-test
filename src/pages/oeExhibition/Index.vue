<template>
  <div class="page-oe-exhibition">
    <div class="page__header">
      <img
        class="page__logo"
        src="@/assets/images/logo-green-x.svg"
      >
      <div class="page__title">
        太陽能案場 I-V 曲線
      </div>
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline refresh-btn"
        @click="getRandomChart"
      >
        更新資料
      </button>
    </div>
    <div class="page__content">
      <spinner
        v-if="loading"
        size="50"
        class="page__spinner"
      />
      <div
        v-for="(chart, index) in chartList"
        v-else
        :key="index"
        class="chart__item"
      >
        <div class="chart__title">
          {{ chart.question }}
        </div>
        <div class="chart__content">
          <display-line-chart
            :is-show-toolbox="false"
            :height="chartHeight"
            :dataset="chart.dataset"
            :title="chart.title"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomChart } from '@/API/OEExhibition'

export default {
  name: 'OEExhibition',
  data () {
    return {
      loading: false,
      chartList: [],
      chartHeight: 0
    }
  },
  mounted () {
    this.getRandomChart()
    this.getChartHeight()
    window.addEventListener('resize', () => {
      this.getChartHeight()
    })
  },
  destroyed () {
    window.removeEventListener('resize')
  },
  methods: {
    getRandomChart () {
      this.loading = true
      getRandomChart().then(chartList => {
        this.chartList = chartList
        this.loading = false
      }).catch(() => {})
    },
    getChartHeight () {
      this.chartHeight = (document.body.clientHeight - 360) / 2 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-oe-exhibition {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 32px;
  overflow: hidden;
  .page {
    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .refresh-btn {
        margin-left: auto;
      }
    }
    &__logo {
      height: 50px;
      margin-right: 24px;
    }
    &__title {
      font-size: 48px;
      letter-spacing: 4px;
      display: flex;
      &::before {
        content: '';
        display: inline-block;
        width: 1px;
        height: 30px;
        margin-right: 24px;
        background-color: #404949;
      }
    }
    &__content {
      height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      flex: 1;
    }
  }
  .chart {
    &__item {
      display: flex;
      flex-direction: column;
      flex: 0 0 calc(calc(100% - 16px) / 2);
      width: 0;
      padding: 16px;
      background: #192323;
      border-radius: 5px;
      height: 50%;
      &:first-child, &:nth-child(2) {
        margin-bottom: 16px;
      }
      &:nth-child(odd) {
        margin-right: 16px;
      }
    }
    &__title {
      font-size: 32px;
      letter-spacing: 3px;
      margin-bottom: 20px;
    }
    &__content {
      flex: 1;
      height: 0;
    }
  }
}
</style>
