<template>
  <section class="war-room">
    <div
      v-if="isPreviewing"
      class="war-room__reminder">
      {{ $t('warRoom.previewPageReminder') }}
    </div>
    <header class="war-room__header">
      <div class="war-room__header--left">
        <div class="war-room__header-logo">
          <img src="@/assets/images/logo-light.svg">
        </div>
        <div
          v-if="!hasError"
          class="war-room__header-title"
        >
          {{ warRoomBasicInfo.name }}
        </div>
      </div>
      <div
        v-if="warRoomStartTime"
        class="war-room__header--right"
      >
        {{ $t('warRoom.timeInterval') + '：' + warRoomStartTime + ' - ' + warRoomEndTime }}
      </div>
    </header>
    <section
      :class="{ 'war-room__content--disabled': isLoading }"
      class="war-room__content"
    >
      <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="spinner"
        size="50"
      />
      <div
        v-else-if="isEmptyData || hasError"
        class="war-room__error-message"
      >
        <svg-icon
          v-if="hasError"
          icon-class="alert" 
          class="icon"/>
        <div class="war-room__error-message-title">{{ isEmptyData ? $t('warRoom.emptyComponentMessage') : $t('warRoom.warRoomDisplayErrorMessage') }}</div>
      </div>
      <template v-else>
        <div class="number">
          <war-room-component
            v-for="number in numberComponent"
            :key="number.componentId"
            :component-id="number.componentId"
            :is-editable="false"
            :is-previewing="isPreviewing"
            :is-show-warning-message="true"
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
              :is-previewing="isPreviewing"
              class="chart__item"
            />
          </div>
          <div
            v-if="chartSecondRow.length > 0"
            class="chart__container"
          >
            <war-room-component
              v-for="chart in chartSecondRow"
              :key="chart.componentId"
              :component-id="chart.componentId"
              :is-editable="false"
              :is-previewing="isPreviewing"
              class="chart__item"
            />
          </div>
        </div>
      </template>
    </section>
  </section>
</template>

<script>
import WarRoomComponent from './components/WarRoomComponent'
import {
  getWarRoomInfo,
  getPublishedWarRoomInfo
} from '@/API/WarRoom'

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
      autoRefreshFunction: null,
      hasError: false,
      isEmptyData: false
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
    },
    warRoomStartTime () {
      if (this.isLoading || this.hasError) return
      return this.isPreviewing ? this.warRoomBasicInfo.config.customStartTime : this.warRoomBasicInfo.dateRangeStart
    },
    warRoomEndTime () {
      if (this.isLoading || this.hasError) return
      const endTime = this.isPreviewing ? this.warRoomBasicInfo.config.customEndTime : this.warRoomBasicInfo.dateRangeEnd
      return (this.warRoomStartTime && endTime) ? endTime : this.$t('warRoom.now')
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
          const { diagramTypeComponents, indexTypeComponents, ...warRoomBasicInfo } = response
          this.chartComponent = this.sortComponents(diagramTypeComponents)
          this.numberComponent = this.sortComponents(indexTypeComponents)
          this.warRoomBasicInfo = warRoomBasicInfo
          if (diagramTypeComponents.length === 0 && indexTypeComponents.length === 0) {
            this.isEmptyData = true
          }

          // 每小時自動刷新頁面資料
          this.autoRefreshFunction = window.setTimeout(() => {
            this.fetchData()
          }, 3600 * 1000)
        })
        .catch(() => {
          window.clearTimeout(this.autoRefreshFunction)
          this.hasError = true
         })
        .finally(() => { this.isLoading = false })
    },
    sortComponents (componentList) {
      if (componentList.length === 0) return componentList
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
  height: 100vh;

  &__reminder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 20px;
    font-weight: 600;
    font-size: 12px;
    color: #fff;
    background: #2AD2E2;
    text-align: center;
  }

  &__error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999999;
    font-size: 18px;
    .icon { font-size: 60px; }
  }

  &__error-message-title {
    margin-top: 16px;
    white-space: pre-wrap;
    text-align: center;
  }

  &__content {
    position: relative;
    height: calc(100% - 52px);
    overflow: auto;
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

  &__side-setting {
    border: 1px solid #464A50;
    height: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 22px;
    line-height: 30px;

    &--left {
      display: flex;
    }

    &--right {
      line-height: 30px;
      font-size: 12px;
      color: #DDDDDD;
    }
  }

  &__header-logo {
    height: 30px;
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
