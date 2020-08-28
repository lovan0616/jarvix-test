<template>
  <section class="war-room">
    <div
      v-if="isPreviewing"
      class="war-room__reminder">
      此頁為預覽畫面
    </div>
    <header class="war-room__header">
      <div class="war-room__header--left">
        <div class="war-room__header-logo">
          <img src="@/assets/images/logo-light.svg">
        </div>
        <div
          v-if="warRoomBasicInfo.name"
          class="war-room__header-title"
        >
          {{ warRoomBasicInfo.name }}
        </div>
      </div>
      <div class="war-room__header--right">
        <span
          v-if="warRoomBasicInfo.dateRangeStart && warRoomBasicInfo.dateRangeEnd"
          class="war-room__header-time"
        >
          {{ $t('warRoom.updateTime') + '：' + warRoomBasicInfo.dateRangeStart + '-' + warRoomBasicInfo.dateRangeEnd }}
        </span>
      </div>
    </header>
    <section class="war-room__content">
      <div
        :class="{ 'war-room__display--disabled': isLoading }"
        class="war-room__display"
      >
        <spinner 
          v-if="isLoading"
          :title="$t('editing.loading')"
          class="spinner"
          size="50"
        />
        <div class="number">
          <war-room-component
            v-for="number in numberComponent"
            :key="number.componentId"
            :component-id="number.componentId"
            :is-editable="false"
            class="number__item"
          />
        </div>
        <div class="chart">
          <div class="chart__container">
            <war-room-component
              v-for="chart in chartFirstRow"
              :key="chart.componentId"
              :component-id="chart.componentId"
              :is-editable="false"
              class="chart__item"
            />
          </div>
          <div class="chart__container">
            <war-room-component
              v-for="chart in chartSecondRow"
              :key="chart.componentId"
              :component-id="chart.componentId"
              :is-editable="false"
              class="chart__item"
            />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import WarRoomComponent from './components/WarRoomComponent'
import {
  getWarRoomInfo,
  getPublishedWarRoomInfo
} from '@/API/WarRoom'

const dummyNumbers = []
for (let i = 0; i < 3; i++) {
  dummyNumbers.push(i + 1)
}

const dummyChart = []
for (let i = 0; i < 6; i++) {
  dummyChart.push(i + 1)
}

const dummyWarRoom =  {
  "config": {
    "customEndTime": null,
    "customStartTime": null,
    "displayDateRangeSwitch": true,
    "publishName": "string",
    "recentTimeIntervalAmount": null,
    "recentTimeIntervalUnit": null,
  },
  "diagramTypeComponents": [
    {
      "componentId": 0,
      "orderSequence": 1
    },
    {
      "componentId": 1,
      "orderSequence": 2
    },
    {
      "componentId": 2,
      "orderSequence": 3
    },
    {
      "componentId": 3,
      "orderSequence": 4
    },
    {
      "componentId": 4,
      "orderSequence": 5
    },
    {
      "componentId": 5,
      "orderSequence": 6
    },
    {
      "componentId": 6,
      "orderSequence": 7
    }
  ],
  "indexTypeComponents": [
    {
      "componentId": 8,
      "orderSequence": 1
    },
    {
      "componentId": 9,
      "orderSequence": 2
    },
    {
      "componentId": 10,
      "orderSequence": 3
    },
    {
      "componentId": 11,
      "orderSequence": 4
    }
  ],
  "isPublishing": true,
  "name": "string",
  "publishUpdateTime": "string",
  "publishUpdaterId": 0,
  "publishUpdaterName": "string",
  "urlIdentifier": "string",
  "warRoomId": 0
}

const dummyPool = {
  "diagramTypeItems": [
    {
      "itemId": 0,
      "question": "string"
    }
  ],
  "indexTypeItems": [
    {
      "itemId": 0,
      "question": "string"
    }
  ]
}

export default {
  name: 'WarRoom',
  inject: ['$validator'],
  components: {
    WarRoomComponent
  },
  data () {
    return {
      chartComponent: null,
      numberComponent: null,
      isLoading: false,
      warRoomBasicInfo: {},
      autoRefreshFunction: null
    }
  },
  computed: {
    chartFirstRow () {
      if (!this.chartComponent || this.chartComponent.length === 0) return []
      if (this.chartComponent.length <= 3) return this.chartComponent
      const endChartIndex = Math.floor(this.chartComponent.length / 2)
      return this.chartComponent.slice(0, endChartIndex)
    },
    chartSecondRow () {
      if (!this.chartComponent || this.chartComponent.length <= 3) return []
      const startChartIndex = Math.floor(this.chartComponent.length / 2)
      return this.chartComponent.slice(startChartIndex)
    },
    isPreviewing () {
      const { war_room_id: warRoomId = null } = this.$route.params
      return warRoomId !== null
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
  },
  methods: {
    fetchData () {
      this.isLoading = true
      if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
      const promise = this.isPreviewing ? getWarRoomInfo : getPublishedWarRoomInfo
      const id = this.isPreviewing ? this.$route.params.war_room_id : this.$route.query.id

      promise(id)
        .then(response => {
          const { diagramTypeComponents, indexTypeComponents, ...warRoomBasicInfo } = dummyWarRoom
          this.chartComponent = this.sortComponents(diagramTypeComponents)
          this.numberComponent = this.sortComponents(indexTypeComponents)
          this.warRoomBasicInfo = warRoomBasicInfo
          this.dataSourcePool = dummyPool

          // 每小時自動刷新頁面資料
          this.autoRefreshFunction = window.setTimeout(() => {
            this.fetchData()
          }, 3600 * 1000)
        })
        .finally(() => { this.isLoading = false })

        const { diagramTypeComponents, indexTypeComponents, ...warRoomBasicInfo } = dummyWarRoom
        this.chartComponent = this.sortComponents(diagramTypeComponents)
        this.numberComponent = this.sortComponents(indexTypeComponents)
        this.warRoomBasicInfo = warRoomBasicInfo
    },
    sortComponents (componentList) {
      componentList.sort((a, b) => a.orderSequence - b.orderSequence)
      return componentList
    }
  }
}
</script>

<style lang="scss" scoped>
.war-room {
  position: relative;
  padding: 32px;
  width: 100%;
  height: 100%;

  &__reminder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 20px;
    font-weight: 600;
    font-size: 12px;
    color: #CCCCCC;
    background: #192323;
    text-align: center;
  }

  &__content {
    height: 100%;
    overflow: auto;
  }

  &__side-setting {
    border: 1px solid #464A50;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
    height: 30px;

    &--left {
      display: flex;
    }
  }

  &__header-logo {
    line-height: 30px;
    padding-right: 24px;
  }

  &__header-title {
    padding-left: 24px;
    line-height: 30px;
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 4px;
    border-left: 1px solid #404949;
  }

  &__header-time {
    line-height: 30px;
    font-size: 12px;
    color: #DDDDDD;
  }

  &__display {
    position: relative;
    display: flex;
    flex-direction: column;
    &--disabled {
      .number,
      .chart {
        opacity: .4;
        pointer-events: none;
      }
    }

    .spinner {
      position: absolute;;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /* 避免點擊文字 */
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
  }

  .number {
    display: flex;
    height: 103px;
    width: 100%;
    margin-bottom: 20px;

    &__item {
      flex: 1;
      max-width: calc(calc(100% - 40px) / 3);
      &:not(:last-of-type) {
        margin-right: 16px;
      }
    }
  }

  .chart {
    display: flex;
    flex-direction: column;
    height: 552px;
    flex: 1;

    &__container {
      flex: 1;
      display: flex;
      &:not(:last-of-type) {
        margin-bottom: 16px;
      }
    }

    &__item {
      flex: 1;
      &:not(:last-of-type) {
        margin-right: 16px;
      }
    }
  }
}
</style>
