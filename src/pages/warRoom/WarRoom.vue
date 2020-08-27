<template>
  <section class="war-room">
    <section class="war-room__content">
      <div class="war-room__header">
        <div class="war-room__header--left">
          <a
            href="javascript:void(0);" 
            class="link action-link"
          >
            <svg-icon
              icon-class="arrow-left" 
              class="icon"/>
            {{ $t('warRoom.backToList') }}
          </a>
          <div
            v-if="!isEditingWarRoomName"
            class="war-room__title"
          >
            {{ warRoomConfig.publishName }}
            <a
              href="javascript:void(0);"
              class="link action-link" 
              @click="editWarRoomName"
            >
              <svg-icon
                icon-class="edit" 
                class="icon"/>
            </a>
          </div>
          <div
            v-else
            class="war-room__title-edit"
          >
            <div class="war-room__title-input">
              <input
                v-validate="'required'"
                v-model="tempWarRoomPublishedName"
                name="warRoomName"
                class="input war-room__title-input">
              <div 
                v-show="errors.has('warRoomName')"
                class="error-text"
              >{{ errors.first('warRoomName') }}</div>
            </div>
            <button 
              :disabled="isProcessing"
              type="button"
              class="btn btn-default"
              @click="updateWarRoomName"
            >{{ $t('button.save') }}</button>
            <button
              type="button"
              class="btn btn-outline"
              @click="stopEditingWarRoomName"
            >{{ $t('button.cancel') }}</button>
          </div>
        </div>
        <div class="war-room__header--right button-container">
          <div class="button-container--top">
            <span
              v-if="warRoomBasicInfo.publishUpdateTime"
              class="button-container__time"
            >
              {{ $t('warRoom.updateTime') + '：' + warRoomBasicInfo.publishUpdateTime }}
            </span>
            <span
              :class="{ 'button-container__status--active': warRoomBasicInfo.isPublishing }"
              class="button-container__status"
            >
              {{ warRoomBasicInfo.isPublishing ? $t('warRoom.hasPublished') : $t('warRoom.notPublished') }}
            </span>
            <button
              v-if="!warRoomBasicInfo.isPublishing"
              :disabled="isProcessing"
              type="button"
              class="btn-m btn-default button-container__button"
              @click="publishWarRoom"
            >{{ $t('warRoom.publish') }}</button>
            <template v-if="warRoomBasicInfo.isPublishing">
              <!--待確認是否使用重新發佈即可-->
              <button
                :disabled="isProcessing"
                type="button"
                class="btn-m btn-default button-container__button"
                @click="publishWarRoom"
              >{{ $t('button.update') }}</button>
              <button
                :disabled="isProcessing"
                type="button"
                class="btn-m btn-secondary button-container__button"
                @click="unpublishWarRoom"
              >{{ $t('warRoom.unpublish') }}</button>
            </template>
            <button 
              type="button"
              class="btn-m btn-secondary button-container__button"
            >{{ $t('warRoom.preview') }}</button>
          </div>
          <div class="button-container--bottom">
            <button
              type="button"
              class="btn-m btn-outline btn-has-icon button-container__button"
              @click="openWarRoomSetting"
            >
              <svg-icon 
                icon-class="filter-setting" 
                class="icon"/>
              {{ $t('warRoom.warRoomSetting') }}
            </button>
            <custom-dropdown-select
              :data-list="addComponentList"
              trigger="hover"
              @select="addComponent"
            >
              <template #display>
                <button
                  :disabled="addComponentList.length === 0"
                  type="button"
                  class="btn-m btn-outline btn-has-icon button-container__button"
                >
                  <svg-icon 
                    icon-class="plus" 
                    class="icon"/>
                  {{ $t('warRoom.add') }}
                </button>
              </template>
            </custom-dropdown-select>
          </div>
        </div>
      </div>
      <div class="war-room__display">
        <div class="number">
          <!--待補編輯狀態-->
          <war-room-component
            v-for="number in numberComponent"
            :key="number.componentId"
            :component-id="number.componentId"
            :is-editable="true"
            class="number__item"
            @check-constraint="viewComponentConstraint"
            @check-setting="editComponenSetting"
          />
        </div>
        <div class="chart">
          <div class="chart__container">
            <war-room-component
              v-for="chart in chartFirstRow"
              :key="chart.componentId"
              :component-id="chart.componentId"
              :is-editable="true"
              class="chart__item"
              @check-constraint="viewComponentConstraint"
              @check-setting="editComponenSetting"
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
              :is-editable="true"
              class="chart__item"
              @check-constraint="viewComponentConstraint"
              @check-setting="editComponenSetting"
            />
          </div>
        </div>
      </div>
    </section>
    <component-setting
      v-if="isShowComponentSetting"
      :component-type="createdComponentType"
      :data-source-pool="dataSourcePool"
      :original-component-data="selectedComponent"
      class="war-room__side-setting"
      @close="closeComponentSetting"
      @updated="fetchData"
    />
    <war-room-setting
      v-if="isShowWarRoomSetting"
      :config-data.sync="warRoomConfig"
      class="war-room__side-setting"
      @close="closeWarRoomSetting"
    />
    <component-constraint
      v-if="isShowComponentConstraint"
      :component-data="selectedComponent"
      class="war-room__side-setting"
      @close="closeComponentConstraint"
    />
  </section>
</template>

<script>
import ComponentSetting from './components/ComponentSetting'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import WarRoomSetting from './components/WarRoomSetting'
import ComponentConstraint from './components/ComponentConstraint'
import WarRoomComponent from './components/WarRoomComponent'
import { Message } from 'element-ui'
import {
  getWarRoomInfo,
  getWarRoomPool,
  updateWarRoomSetting,
  publishWarRoom,
  unpublishWarRoom
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
    ComponentSetting,
    CustomDropdownSelect,
    WarRoomSetting,
    ComponentConstraint,
    WarRoomComponent,
    Message
  },
  data () {
    return {
      chartComponent: null,
      numberComponent: null,
      createdComponentType: null,
      isShowComponentSetting: false,
      isShowWarRoomSetting: false,
      isShowComponentConstraint: false,
      selectedComponent: {},
      isLoading: false,
      warRoomConfig: null,
      warRoomBasicInfo: {},
      isEditingWarRoomName: false,
      tempWarRoomPublishedName: null,
      isProcessing: false,
      dataSourcePool: {}
    }
  },
  computed: {
    addComponentList () {
      return [
        ...(this.chartComponent && this.chartComponent.length < 8) && {
          id: 'diagram',
          name: this.$t('warRoom.addChartComponent')
        },
        ...(this.numberComponent && this.numberComponent.length < 4) && {
          id: 'index',
          name: this.$t('warRoom.addNumberComponent')
        }
      ]
    },
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
    }
  },
  mounted () {
    const { war_room_id: warRoomId } = this.$route.params
    this.fetchData(warRoomId)
  },
  methods: {
    fetchData (id) {
      this.isLoading = true
      Promise.all([getWarRoomInfo(id), getWarRoomPool(id)])
        .then(([warRoomData, warRoomPoolData]) => {
          const { config, diagramTypeComponents, indexTypeComponents, ...warRoomBasicInfo } = dummyWarRoom
          this.warRoomConfig = config
          this.chartComponent = this.sortComponents(diagramTypeComponents)
          this.numberComponent = this.sortComponents(indexTypeComponents)
          this.warRoomBasicInfo = warRoomBasicInfo
          this.dataSourcePool = dummyPool
        })
        .catch(() => { this.isLoading = false })
    },
    sortComponents (componentList) {
      componentList.sort((a, b) => a.orderSequence - b.orderSequence)
      return componentList
    },
    addComponent (value) {
      if (this.isShowWarRoomSetting) this.closeWarRoomSetting()
      if (this.isShowComponentConstraint) this.closeComponentConstraint()
      // TODO: check if has reached max before creation
      this.createdComponentType = value
      this.isShowComponentSetting = true
    },
    editComponenSetting (data) {
      if (this.isShowWarRoomSetting) this.closeWarRoomSetting()
      if (this.isShowComponentConstraint) this.closeComponentConstraint()
      this.selectedComponent = data
      this.isShowComponentSetting = true
    },
    closeComponentSetting () {
      this.isShowComponentSetting = false
      this.createdComponentType = null
      this.selectedComponent = {}
    },
    openWarRoomSetting () {
      if (this.isShowComponentSetting) this.closeComponentSetting()
      if (this.isShowComponentConstraint) this.closeComponentConstraint()
      this.isShowWarRoomSetting = true
    },
    closeWarRoomSetting () {
      this.isShowWarRoomSetting = false
    },
    viewComponentConstraint (data) {
      if (this.isShowWarRoomSetting) this.closeWarRoomSetting()
      if (this.isShowComponentSetting) this.closeComponentSetting()
      this.selectedComponent = data
      this.isShowComponentConstraint = true
    },
    closeComponentConstraint () {
      this.selectedComponent = {}
      this.isShowComponentConstraint = false
    },
    editWarRoomName () {
      this.tempWarRoomPublishedName = this.warRoomConfig.publishName
      this.isEditingWarRoomName = true
    },
    stopEditingWarRoomName () {
      this.isEditingWarRoomName = false
      this.tempWarRoomPublishedName = null
    },
    updateWarRoomName () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        this.warRoomConfig.publishName = this.tempWarRoomPublishedName
        const { war_room_id: warRoomId } = this.$route.params
        updateWarRoomSetting(warRoomId, this.warRoomConfig)
          .then(() => this.stopEditingWarRoomName())
          .finally(() => { this.isProcessing = false })
      })
    },
    publishWarRoom () {
      const { war_room_id: warRoomId } = this.$route.params
      publishWarRoom(warRoomId)
        .then(() => {
          this.isProcessing = true
          this.warRoomBasicInfo.isPublishing = true
          Message({
            message: this.$t('message.publishSuccessfully'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => { this.isProcessing = false })
    },
    unpublishWarRoom () {
      const { war_room_id: warRoomId } = this.$route.params
      unpublishWarRoom(warRoomId)
        .then(() => {
          this.isProcessing = true
          this.warRoomBasicInfo.isPublishing = false
          Message({
            message: this.$t('message.unPublishSuccessfully'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => { this.isProcessing = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.war-room {
  display: flex;
  width: 100%;
  height: 100%;

  &__content {
    flex: 1;
    padding: 32px 24px 64px 24px;
    height: 100%;
    overflow: scroll;
    border: 1px solid #464A50;
  }

  &__side-setting {
    border: 1px solid #464A50;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title {
    font-weight: 600;
    font-size: 24px;
    margin: 16px 0 0 0;
    line-height: 32px;
  }

  &__title-edit {
    margin-top: 16px;
    display: flex;

    .btn {
      margin-right: 8px;
      min-width: 49px;
      padding: 0;
    }
  }

  &__title-input {
    line-height: 32px;
    margin-right: 12px;
    width: 400px;
  }

  &__display {
    display: flex;
    flex-direction: column;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    
    &--top,
    &--bottom {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    &--top {
      margin-bottom: 11px;
    }

    &__button {
      padding: 5px 10px;
      min-width: unset;
      line-height: 20px;
      &:not(:first-child) {
        margin-left: 8px;
      }
    }

    &__time {
      font-size: 12px;
      color: #DDDDDD;
    }

    &__status {
      display: inline-block;
      padding: 4px 8px;
      background: #333333;
      border-radius: 24px;
      margin-left: 16px;
      font-size: 12px;

      &::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border: 1px solid #999999;
        background: transparent;
        border-radius: 50%;
        margin: auto 0;
      }

      &--active {
        &::before {
          border: none;
          background: #2FECB3;
        }
      }
    }
  }

  .number {
    display: flex;
    height: 95px;
    width: 100%;
    margin-bottom: 24px;

    &__item {
      flex: 1;
      max-width: calc(calc(100% - 40px) / 3);
      &:not(:last-of-type) {
        margin-right: 20px;
      }
    }
  }

  .chart {
    display: flex;
    flex-direction: column;
    height: 490px;
    flex: 1;

    &__container {
      flex: 1;
      display: flex;
      &:not(:last-of-type) {
        margin-bottom: 20px;
      }
    }

    &__item {
      flex: 1;
      &:not(:last-of-type) {
        margin-right: 20px;
      }
    }
  }

  /deep/ .dropdown {
    margin-left: 8px;
    &__list-container {
      left: -83px;
      top: calc(100% + 10px);
      text-align: left;
      z-index: 1;
      width: 160px;

      &::before {
        position: absolute;
        content: "";
        bottom: 100%;
        left: 0;
        width: 100%;
        background-color: transparent;
        height: 12px;
      }

      &::after {
        position: absolute;
        content: "";
        bottom: 100%;
        left: 72%;
        border-bottom: 12px solid #2B3839;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
      }
    }

    &__link {
      font-size: 14px;
      line-height: 40px;
      &::before {
        display: none;
      }
    }
  }
}
</style>
