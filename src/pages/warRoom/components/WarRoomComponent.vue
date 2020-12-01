<template>
  <div
    :class="{
      'card--focused': isFocusing,
      'card--no-bg': isError
    }"
    class="card"
  >
    <spinner
      v-if="isLoading"
      :title="$t('message.dataLoading')"
      class="task-spinner"
    />
    <div
      v-else-if="isError"
      class="card__error-message"
    >
      <svg-icon
        icon-class="alert" 
        class="icon"/>
      {{ errorMessage }}
    </div>
    <template v-else>
      <div class="card__header">
        <div class="card__title">{{ componentBasicInfo.config.displayName }}</div>
        <div
          v-if="isAboveUpperBound || isBelowLowerBound"
          class="card__message"
        >
          <svg-icon
            :icon-class="isAboveUpperBound ? 'arrow-solid-up' : 'arrow-solid-down'" 
            class="icon"/>
          {{ isAboveUpperBound ? $t('warRoom.reachedUpperBound') : $t('warRoom.reachedLowerBound') }}
        </div>
      </div>
      <div class="card__body">
        <component
          :is="componentName"
          :dataset="componentData.dataset"
          :title="componentData.title"
          :message="componentData.message"
          :segmentation="componentData.segmentation"
          :info="componentData.info || componentData.data"
          :features="componentData.features"
          :confidence="componentData.confidence"
          :formula="componentData.displayCoefficients"
          :coefficients="componentData.coeffs"
          :text="componentData.text"
          :chart-data="componentData.chart_data"
          :notes="componentData.notes"
          :causes="componentData.causes"
          :description="componentData.description"
          :total="componentData.total"
          :item-count="componentData.item_count"
          :key="componentId"
          :show-toolbox="showToolbox"
          :custom-chart-style="customChartStyle"
          :is-show-alert="isAboveUpperBound || isBelowLowerBound"
          :is-show-legend="false"
          :is-show-label-data="true"
          class="card__body-data"
        />
      </div>
      <div
        v-if="timeInterval"
        class="card__description"
      >
        {{ $t('warRoom.timeInterval') + '：' + timeInterval }}
      </div>
    </template>
    <div
      v-if="!isLoading && isEditable"
      class="card__control"
    >
      <a
        href="javascript:void(0);" 
        class="link action-link"
        @click="editSetting"
      >
        <svg-icon
          icon-class="filter-setting" 
          class="icon"/>
      </a>
      <a
        v-if="!isError"
        href="javascript:void(0);" 
        class="link action-link"
        @click="viewConstraint"
      >
        <svg-icon
          icon-class="filter" 
          class="icon"/>
      </a>
    </div>
  </div>
</template>

<script>
import {
  getComponentInfo,
  getPublishedComponentInfo,
  checkComponentUpdateStatus,
  checkPublishedComponentUpdateStatus
} from '@/API/WarRoom'
import moment from 'moment'

export default {
  name: 'WarRoomComponent',
  props: {
    componentId: {
      type: Number,
      default: null
    },
    isShowWarningMessage: {
      type: Boolean,
      default: false
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    isFocusing: {
      type: Boolean,
      default: false
    },
    isPreviewing: {
      type: Boolean,
      default: true
    },
    warRoomDefaultTime: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      question: '',
      isTaskComplete: true,
      showToolbox: false,
      customChartStyle: {
        width: '100%', 
        height: '100%',
      },
      diagram: null,
      isLoading: true,
      componentName: null,
      componentData: null,
      isError: false,
      errorMessage: '',
      timeoutFunction: null,
      autoRefreshFunction: null,
      componentBasicInfo: {},
      updateDate: null
    }
  },
  computed: {
    isAboveUpperBound () {
      if (this.isLoading || !this.isShowWarningMessage || !this.componentBasicInfo.config.boundSwitch || !this.componentBasicInfo.config.upperBound) return false
      return Number(this.componentData.dataset.data) > Number(this.componentBasicInfo.config.upperBound)
    },
    isBelowLowerBound () {
      if (this.isLoading || !this.isShowWarningMessage || !this.componentBasicInfo.config.boundSwitch || !this.componentBasicInfo.config.lowerBound) return false
      return Number(this.componentData.dataset.data) < Number(this.componentBasicInfo.config.lowerBound)
    },
    componentConfigTimeInterval () {
      if (
        this.isLoading
        || this.isError
        || this.isEditable
        || !this.componentBasicInfo.config
        || !this.componentBasicInfo.config.displayDateRangeSwitch
      ) return null

      const {
        recentTimeIntervalAmount, 
        recentTimeIntervalUnit, 
        customEndTime, 
        customStartTime 
      } = this.componentBasicInfo.config

      // 如果沒有選擇預設則為自訂區間
      if (!recentTimeIntervalAmount || !recentTimeIntervalUnit) {
        return customStartTime + ' - ' + (customEndTime || this.$t('warRoom.now'))
      }

      const timeInterval = `${recentTimeIntervalAmount}+${recentTimeIntervalUnit}`
      return this.warRoomTimeIntervalList.find(interval => interval.value === timeInterval).name
    },
    timeInterval () {
      if (
        this.isLoading
        || this.isError
        || this.isEditable
        || (!this.componentConfigTimeInterval && !this.warRoomDefaultTime)
      ) return null
      return this.componentConfigTimeInterval || this.warRoomDefaultTime
    }
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
    if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
  },
  mounted () {
    this.checkRefreshStatus()
  },
  methods: {
    checkRefreshStatus () {
      this.isLoading = true
      const promise = this.isPreviewing ? checkComponentUpdateStatus : checkPublishedComponentUpdateStatus
      const id = this.isPreviewing ? this.$route.params.war_room_id : this.$route.query.id
      // 第一次渲染拿當前時間作為給後端的前次更新時間，因為與 component 上的更新時間不同，所以一定會回傳 UPDATABLE
      const updateDate = this.updateDate || moment().toISOString()
      if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
      // 確認 component config 資料有無更新或需要重新計算，需要才去拿 component 資料
      promise(id, this.componentId, updateDate)
        .then(res => {
          // 第一次一定會是可更新狀態
          if (res === 'UPDATABLE') return this.fetchData()
          this.autoRefreshFunction = window.setTimeout(() => {
            this.checkRefreshStatus()
          }, this.convertRefreshFrequency(this.componentBasicInfo.config.refreshFrequency))
          this.isLoading = false
         })
        .catch(() => {
          // 若為 live 頁面，需確認是否有更新版本上線
          if (!this.isPreviewing) this.$emit('check-update')
          this.isLoading = false
          this.isError = true
          this.errorMessage = this.$t('message.systemIsError')
        })
    },
    fetchData () {
      window.clearTimeout(this.timeoutFunction)
      const promise = this.isPreviewing ? getComponentInfo : getPublishedComponentInfo
      const id = this.isPreviewing ? this.$route.params.war_room_id : this.$route.query.id
      promise(id, this.componentId)
        .then(response => {
          const { diagramData, updateDate, ...componentBasicInfo } = response
          switch (componentBasicInfo.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => { this.fetchData() }, 1000)
              break
            case 'Complete': {
              window.clearTimeout(this.timeoutFunction)
              this.diagram = componentBasicInfo.diagram
              this.componentName = this.getChartTemplate(this.diagram)
              this.updateDate = updateDate
              let responseData = diagramData.data

              // 定期更新 component 資料
              let isAutoRefresh = componentBasicInfo.config.isAutoRefresh
              if(isAutoRefresh && !this.isEditable) {
                this.autoRefreshFunction = window.setTimeout(() => {
                  this.checkRefreshStatus()
                }, this.convertRefreshFrequency(componentBasicInfo.config.refreshFrequency))
              }
              
              // 儲存圖表資料
              if (!responseData.dataset.data || responseData.dataset.data.length === 0) {
                this.isLoading = false
                this.isError = true
                this.errorMessage = this.$t('message.emptyResult')
              } else {
                this.componentData = responseData
              }

              this.componentBasicInfo = componentBasicInfo
              this.isLoading = false
              break
            }
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              window.clearTimeout(this.timeoutFunction)
              this.isLoading = false
              this.isError = true
              this.componentBasicInfo = {
                ...componentBasicInfo,
                componentId: this.componentId
              }
              this.errorMessage = componentBasicInfo.errorMessage || this.$t('message.systemIsError')
              break
          }
        }).catch((error) => {
          // 若為 live 頁面，需確認是否有更新版本上線
          if (!this.isPreviewing) this.$emit('check-update')
          window.clearTimeout(this.timeoutFunction)
          window.clearTimeout(this.autoRefreshFunction)
          this.componentBasicInfo = { componentId: this.componentId }
          this.isLoading = false
          this.isError = true
          this.errorMessage = error.error && error.error.message ? error.error.message : this.$t('message.systemIsError')
        })
    },
    viewConstraint() {
      this.$emit('check-constraint', this.componentBasicInfo)
    },
    editSetting() {
      this.$emit('check-setting', {
        ...this.componentBasicInfo,
        ...(this.isError && { isError: this.isError }),
        ...(this.errorMessage && { errorMessage: this.errorMessage }),
      })
    },
    convertRefreshFrequency (cronTab) {
      switch (cronTab) {
        case '* * * * *':
          return 60 * 1000
        case '*/5 * * * *':
          return 5 * 60 * 1000
        case '*/15 * * * *':
          return 15 * 60 * 1000
        case '*/30 * * * *':
          return 30 * 60 * 1000
        case '*/45 * * * *':
          return 45 * 60 * 1000
        case '0 * * * *':
          return 60 * 60 * 1000
        case '0 0 * * *':
          return 24 * 60 * 60 * 1000
        case '0 0 * * 0':
          return 7 * 24 * 60 * 1000
        case '0 0 1 * *':
          return 30 * 7 * 24 * 60 * 1000
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  height: 100%;
  width: 0; // 讓卡片能響應式縮小
  height: auto;
  border-radius: 5px;
  background: #1C2424;
  padding: 16px;
  display: flex;
  flex-direction: column;
  cursor: grab;
  border: 1px solid transparent;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    height: 20px;
  }

  &__title {
    width: calc(100% - 70px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    color: #DDDDDD;
    [lang="en"] & {
      width: calc(100% - 155px);
    }
  }

  &__message {
    color: #FF5C46;
    font-weight: 600;
    font-size: 12px;
  }

  &__control {
    position: absolute;
    top: 16px;
    right: 16px;
    display: none;
    line-height: 20px;
    .icon { color: #2AD2E2; }
  }

  &__body {
    flex: 1;
  }

  &__body-data {
    height: 100%;
  }

  &__error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999999;
    font-size: 14px;
  }

  &__description {
    color: #999999;
    font-size: 10px;
  }

  &--focused {
    border: 1px solid #2AD2E2;
  }

  &--no-bg {
    background: transparent;
    border: 2px solid #202D2D;
  }

  &.sortable-chosen,
  &.sortable-drag {
    cursor: grabbing;
  }

  &.sortable-ghost {
    opacity: .4;
  }

  &.disabled {
    cursor: no-drop;
  }

  &:hover {
    background: #202D2D;
    .card__control {
      display: block;
    }
  }

  .spinner-block {
    height: 100%;
    padding: 0;
  }
}
</style>