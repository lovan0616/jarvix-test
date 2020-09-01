<template>
  <section class="war-room-setting">
    <div class="war-room-setting__header">
      <div class="war-room-setting__title">
        <svg-icon 
          icon-class="filter-setting" 
          class="war-room-setting__header-icon"/>
        {{ $t('warRoom.setting') }}
      </div>
      <span
        class="war-room-setting__close-icon"
        @click="$emit('close')">
        <svg-icon 
          icon-class="close" 
          class="war-room-setting__header-icon"/>
      </span>
    </div>
    <section
      v-if="!isShowComponentDataSourceList"
      class="war-room-setting__content"
    >
      <div class="war-room-setting__block-container">
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.displayName') }}
          </div>
          <input
            v-validate="'required'"
            :disabled="isProcessing"
            v-model="componentData.config.displayName"
            name="displayName"
            class="input war-room-setting__block-text-input">
          <div 
            v-show="errors.has('displayName')"
            class="error-text"
          >{{ errors.first('displayName') }}</div>
        </div>
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.sourceData') }}
            <a
              v-if="!componentData.componentId"
              :disabled="isProcessing" 
              href="javascript:void(0);"
              class="link"
              @click="clearSelectedDataSource"
            >
              {{ $t('button.delete') }}
            </a>
          </div>
          <div
            class="war-room-setting__block-choose"
            @click="componentData.componentId ? null : showComponentDataSourceList()"
          >
            {{ selectedDataSource.question || $t('warRoom.notChosen') }}
            <svg-icon
              v-if="!componentData.componentId"
              icon-class="arrow-right" 
              class="icon"/>
          </div>
        </div>
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.updateFrequency') }}
            <el-switch
              v-model="componentData.config.isAutoRefresh"
              :disabled="isProcessing"
              :width="Number('32')"
              active-color="#2AD2E2"
              inactive-color="#324B4E"/>
          </div>
          <div
            v-if="componentData.config.isAutoRefresh"
            class="war-room-setting__block-select-field"
          >
            <default-select 
              v-validate="'required'"
              v-model="componentData.config.refreshFrequency"
              :option-list="updateFrequency.basicScheduleList"
              :placeholder="$t('warRoom.chooseUpdateFrequency')"
              :is-disabled="isProcessing"
              class="war-room-setting__block-select"
              name="updateFrequency"
            />
            <div 
              v-show="errors.has('updateFrequency')"
              class="error-text"
            >{{ errors.first('updateFrequency') }}</div>
          </div>
        </div>
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.timeIntervalConstraint') }}
            <el-switch
              v-model="componentData.config.displayDateRangeSwitch"
              :disabled="isProcessing"
              :width="Number('32')"
              active-color="#2AD2E2"
              inactive-color="#324B4E"/>
          </div>
          <div
            v-if="componentData.config.displayDateRangeSwitch"
            class="war-room-setting__block-select-field"
          >
            <default-select 
              v-validate="'required'"
              :value="selectedTimeInterval"
              :option-list="timeIntervalConstraint.timeIntervalList"
              :placeholder="$t('warRoom.chooseTimeInterval')"
              :is-disabled="isProcessing"
              class="war-room-setting__block-select"
              name="timeIntervalConstraint"
              @change="updateTimeInterval"
            />
            <div 
              v-show="errors.has('timeIntervalConstraint')"
              class="error-text"
            >{{ errors.first('timeIntervalConstraint') }}</div>
          </div>
          <div
            v-if="componentData.config.displayDateRangeSwitch && selectedTimeInterval === 'others'"
            class="war-room-setting__block-date-field date-picker"
          >
            <div class="date-picker__container">
              <el-date-picker
                v-validate="'required'"
                :disabled="isProcessing"
                v-model="componentData.config.customStartTime"
                :picker-options="timeIntervalConstraint.customTimeInterval.pickerOptions"
                :placeholder="'*' + $t('warRoom.startDate')"
                :clearable="true"
                :class="{ 'has-error': errors.first('startTime') }"
                class="date-picker__item"
                size="small"
                type="date"
                name="startTime"/>
              <div class="date-picker__seperator">-</div>
              <el-date-picker
                :disabled="isProcessing"
                v-model="componentData.config.customEndTime"
                :picker-options="timeIntervalConstraint.customTimeInterval.pickerOptions"
                :placeholder="$t('warRoom.endDate')"
                :clearable="true"
                class="date-picker__item"
                size="small"
                type="date"
                name="endTime"/>
            </div>
            <div
              v-show="errors.has('startTime')"
              class="error-text"
            >{{ errors.first('startTime') }}</div>
            <div class="date-picker__reminder">{{ '*' + $t('warRoom.timeIntervalReminder') }}</div>
          </div>
        </div>
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.thresholdSetting') }}
            <el-switch
              v-model="componentData.config.boundSwitch"
              :disabled="isProcessing"
              :width="Number('32')"
              active-color="#2AD2E2"
              inactive-color="#324B4E"/>
          </div>
          <div
            v-if="componentData.config.boundSwitch"
            class="war-room-setting__block-text"
          >
            <label class="input war-room-setting__block-text-label">
              {{ $t('warRoom.maxThreshold') }}
            </label>
            <input
              v-validate="'required'"
              :disabled="isProcessing"
              v-model="componentData.config.upperBound"
              :placeholder="$t('warRoom.pleaseEnterValue')"
              name="upperBound"
              class="input war-room-setting__block-text-input">
            <div 
              v-show="errors.has('upperBound')"
              class="error-text"
            >{{ errors.first('upperBound') }}</div>
            <label class="input war-room-setting__block-text-label">
              {{ $t('warRoom.minThreshold') }}
            </label>
            <input
              v-validate="'required'"
              :disabled="isProcessing"
              v-model="componentData.config.lowerBound"
              :placeholder="$t('warRoom.pleaseEnterValue')"
              name="lowerBound"
              class="input war-room-setting__block-text-input">
            <div 
              v-show="errors.has('lowerBound')"
              class="error-text"
            >{{ errors.first('lowerBound') }}</div>
          </div>
        </div>
      </div>
      <div class="war-room-setting__button-block">
        <button
          v-if="componentData.componentId"
          :disabled="isProcessing"
          type="button"
          class="btn btn-outline war-room-setting__button-block-button--left"
          @click="deleteComponent"
        >
          <svg-icon icon-class="delete" />
        </button>
        <button
          :disabled="isProcessing"
          type="button"
          class="btn btn-default war-room-setting__button-block-button--right"
          @click="componentData.componentId ? saveComponentSetting() : buildComponent()"
        >{{ $t('button.save') }}</button>
      </div>
    </section>
    <component-data-source-list
      v-if="isShowComponentDataSourceList"
      :component-type="componentType"
      :data-souce-list="dataSourcePool"
      @back="hideComponentDataSourceList"
      @select="updateSelectedDataSource"
    />
  </section>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import ComponentDataSourceList from './ComponentDataSourceList'
import { createComponent, deleteComponent, updateComponent } from '@/API/WarRoom'
import { Message } from 'element-ui'

export default {
  name: 'ComponentSetting',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    ComponentDataSourceList,
    Message
  },
  props: {
    componentType: {
      type: String,
      default: 'diagram'
    },
    originalComponentData: {
      type: Object,
      default: () => ({
        componentId: null,
        config: {
          boundSwitch: false,
          customEndTime: null,
          customStartTime: null,
          displayDateRangeSwitch: false,
          displayName: null,
          isAutoRefresh: false,
          lowerBound: null,
          question: null,
          recentTimeIntervalAmount: null,
          recentTimeIntervalUnit: null,
          refreshFrequency: null,
          upperBound: null
        },
        diagramData: {},
        diagramName: null,
        orderSequence: null,
        restriction: {},
        selectedColumns: {}
      })
    },
    dataSourcePool: {
      type: Object,
      default: () => ({
        diagramTypeItems: [],
        indexTypeItems: []
      })
    }
  },
  data () {
    return {
      componentData: {
        componentId: null,
        config: {
          boundSwitch: false,
          customEndTime: null,
          customStartTime: null,
          displayDateRangeSwitch: false,
          displayName: null,
          isAutoRefresh: false,
          lowerBound: null,
          question: null,
          recentTimeIntervalAmount: null,
          recentTimeIntervalUnit: null,
          refreshFrequency: null,
          upperBound: null
        },
        diagramData: {},
        diagramName: null,
        orderSequence: null,
        restriction: {},
        selectedColumns: {}
      },
      isShowComponentDataSourceList: false,
      selectedDataSource: {},
      isProcessing: false,
      updateFrequency: {
        basicScheduleList: [
          {
            value: '*/5 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 5 })
          },
          {
            value: '*/15 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 15 })
          },
          {
            value: '*/30 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 30 })
          },
          {
            value: '*/45 * * * *',
            name: this.$t('warRoom.everyMinute', { number: 45 })
          },
          {
            value: '0 * * * *',
            name: this.$t('warRoom.everyHour')
          },
          {
            value: '0 0 * * *',
            name: this.$t('warRoom.everyDay')
          },
          {
            value: '0 0 * * 0',
            name: this.$t('warRoom.everyWeek')
          },
          {
            value: '0 0 1 * *',
            name: this.$t('warRoom.everyMonth')
          }
        ],
      },
      timeIntervalConstraint: {
        timeIntervalList: [
          {
            value: '1+Hour',
            name: this.$t('warRoom.inHours', { number: 1 })
          },
          {
            value: '1+Day',
            name: this.$t('warRoom.inDays', { number: 1 })
          },
          {
            value: '1+Week',
            name: this.$t('warRoom.inWeeks', { number: 1 })
          },
          {
            value: '1+Month',
            name: this.$t('warRoom.inMonths', { number: 1 })
          },
          {
            value: '1+Season',
            name: this.$t('warRoom.inSeasons', { number: 1 })
          },
          {
            value: '1+Year',
            name: this.$t('warRoom.inYears', { number: 1 })
          },
          {
            value: 'others',
            name: this.$t('warRoom.customize')
          }
        ],
        customTimeInterval: {
          startTime: '',
          endTime: '',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            firstDayOfWeek: 1
          }
        }
      }
    }
  },
  computed: {
    selectedTimeInterval () {
      if (!this.componentData || !this.componentData.config.displayDateRangeSwitch) return null
      
      // 確認是否選擇預設區間
      if (this.componentData.config.recentTimeIntervalAmount && this.componentData.config.recentTimeIntervalUnit) {
        return `${this.componentData.config.recentTimeIntervalAmount}+${this.componentData.config.recentTimeIntervalUnit}`
      }
      
      // 如果沒有選擇預設則為自訂區間
      return 'others'
    }
  },
  watch: {
    originalComponentData: {
      handler (newData) { this.componentData = JSON.parse(JSON.stringify(newData)) },
      deep: true
    }
  },
  mounted () {
    if (this.componentData) this.componentData = JSON.parse(JSON.stringify(this.originalComponentData))
  },
  methods: {
    buildComponent () {
      this.$validator.validate(this.validateFieldKey).then((isValidate) => {
        if (!isValidate) return
        if (!this.selectedDataSource.question) {
          return Message({
            message: this.$t('message.pleaseSelectQuestion'),
            type: 'error',
            duration: 3 * 1000,
            showClose: true
          })
        }
        const { war_room_id: warRoomId } = this.$route.params
        const { question, ...config } = this.componentData.config
        const componentData = { config, itemId: this.selectedDataSource.itemId }
        this.isProcessing = true
        createComponent(warRoomId, componentData)
          .then(response => {
            this.$emit('close')
            this.$emit('updated')
            Message({
              message: this.$t('message.addFilter'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
          })
          .catch(() => { this.isProcessing = false })
      })
    },
    saveComponentSetting () {
      this.$validator.validate(this.validateFieldKey).then((isValidate) => {
        if (!isValidate) return
        const { war_room_id: warRoomId } = this.$route.params
        const { question, ...config } = this.componentData.config
        this.isProcessing = true
        updateComponent(warRoomId, this.componentData.componentId, config)
          .then(() => {
            this.$emit('close')
            this.$emit('updated')
            Message({
              message: this.$t('message.addFilter'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
          })
          .catch(() => { this.isProcessing = false })
      })
    },
    deleteComponent () {
      const { war_room_id: warRoomId } = this.$route.params
      this.isProcessing = true
      deleteComponent(warRoomId, this.componentData.componentId)
        .then(() => {
          this.$emit('close')
          this.$emit('updated')
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => { this.isProcessing = false })
    },
    showComponentDataSourceList () {
      this.isShowComponentDataSourceList = true
    },
    hideComponentDataSourceList () {
      this.isShowComponentDataSourceList = false
    },
    clearSelectedDataSource () {
      this.selectedDataSource = {}
    },
    updateSelectedDataSource (item) {
      this.selectedDataSource = item
      this.hideComponentDataSourceList()
    },
    updateTimeInterval (value) {
      const isDefaultTimeInterval = value.indexOf('+') !== -1

      // 選擇自訂
      if (!isDefaultTimeInterval) {
        this.componentData.config.recentTimeIntervalAmount = null
        this.componentData.config.recentTimeIntervalUnit = null
        return
      }

      // 選擇預設時間區間
      // 避免自訂欄位資料被清空觸發重新驗證，但欄位已經被 v-if 移除產生錯誤
      this.$validator.detach('startTime')
      this.componentData.config.recentTimeIntervalAmount = value.split('+')[0]
      this.componentData.config.recentTimeIntervalUnit = value.split('+')[1]
      this.componentData.config.customEndTime = null
      this.componentData.config.customStartTime = null
    }
  }
}
</script>

<style lang="scss" scoped>
.war-room-setting {
  &__block-select {
    /deep/ .el-input__inner {
      border-bottom: 1px solid #FFFFFF;
    }
  }

  &__content {
    justify-content: space-between;
  }

  &__button-block-button {
    display: flex;
    &--left {
      min-width: 40px;
      padding: 0 2px;
      margin-right: 12px;
    }

    &--right {
      flex: 1 1 180px;
      font-weight: 600;
    }
  }
}
</style>