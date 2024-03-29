<template>
  <section class="war-room">
    <spinner
      v-if="isLoading"
      :title="$t('editing.loading')"
      class="spinner"
      size="50"
    />
    <section
      v-else
      class="war-room__content"
    >
      <div class="war-room__header">
        <div class="war-room__header--left">
          <router-link
            :to="{ name: 'WarRoomList' }"
            class="link action-link"
          >
            <svg-icon
              icon-class="arrow-left"
              class="icon"
            />
            {{ $t('warRoom.backToList') }}
          </router-link>
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
                class="icon"
              />
            </a>
          </div>
          <div
            v-else
            class="war-room__title-edit"
          >
            <div class="war-room__title-input-wrapper">
              <input
                v-validate="'required'"
                v-model="tempWarRoomPublishedName"
                name="warRoomName"
                class="input war-room__title-input"
              >
              <div
                v-show="errors.has('warRoomName')"
                class="error-text"
              >
                {{ errors.first('warRoomName') }}
              </div>
            </div>
            <button
              :disabled="isProcessing"
              type="button"
              class="btn btn-default"
              @click="updateWarRoomName"
            >
              {{ $t('button.save') }}
            </button>
            <button
              type="button"
              class="btn btn-outline"
              @click="stopEditingWarRoomName"
            >
              {{ $t('button.cancel') }}
            </button>
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
            >
              {{ $t('warRoom.publish') }}
            </button>
            <template v-if="warRoomBasicInfo.isPublishing">
              <button
                :disabled="isProcessing"
                type="button"
                class="btn-m btn-default button-container__button"
                @click="publishWarRoom"
              >
                {{ $t('button.update') }}
              </button>
              <button
                :disabled="isProcessing"
                type="button"
                class="btn-m btn-secondary button-container__button"
                @click="unpublishWarRoom"
              >
                {{ $t('warRoom.unpublish') }}
              </button>
            </template>
            <button
              type="button"
              class="btn-m btn-secondary button-container__button"
              @click="previewWarRoom"
            >
              {{ $t('warRoom.preview') }}
            </button>
            <custom-dropdown-select
              v-if="warRoomBasicInfo.isPublishing"
              :data-list="otherFeatureList"
              trigger="hover"
              @select="doOtherFeature"
            >
              <template #display>
                <button
                  type="button"
                  class="btn-m btn-secondary button-container__button"
                >
                  <svg-icon
                    icon-class="more"
                    class="icon"
                  />
                </button>
              </template>
            </custom-dropdown-select>
          </div>
          <div class="button-container--bottom">
            <div class="button-container__description">
              <span class="question-lamp">
                <svg-icon icon-class="lamp" />
                {{ $t('warRoom.hint') }}:
              </span>
              {{ $t('warRoom.chartReminder') }}
            </div>
            <button
              type="button"
              class="btn-m btn-outline btn-has-icon button-container__button"
              @click="openWarRoomSetting"
            >
              <svg-icon
                icon-class="filter-setting"
                class="icon"
              />
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
                    class="icon"
                  />
                  {{ $t('warRoom.add') }}
                </button>
              </template>
            </custom-dropdown-select>
          </div>
        </div>
      </div>
      <div
        :class="{ 'war-room__display--disabled': isProcessing }"
        class="war-room__display"
      >
        <spinner
          v-if="isProcessing"
          :title="$t('message.componentLayoutUpdating')"
          class="spinner"
          size="50"
        />
        <div
          v-if="numberComponent && numberComponent.length > 0"
          class="number"
        >
          <draggable
            :value="numberComponent"
            group="index"
            class="chart__container"
            @end="updateIndexLayout"
          >
            <war-room-component
              v-for="number in numberComponent"
              :key="number.componentId"
              :component-id="number.componentId"
              :is-editable="true"
              :is-focusing="selectedComponent && selectedComponent.componentId === number.componentId"
              :is-show-warning-message="true"
              class="number__item"
              @check-constraint="viewComponentConstraint"
              @check-setting="editComponenSetting"
            />
          </draggable>
        </div>
        <div
          v-if="chartComponent && chartComponent.length > 0"
          class="chart"
        >
          <draggable
            :value="chartFirstRow"
            data-row="1"
            group="diagram"
            class="chart__container"
            @end="updateDiagramLayout"
          >
            <war-room-component
              v-for="chart in chartFirstRow"
              :key="chart.componentId"
              :component-id="chart.componentId"
              :is-editable="true"
              :is-focusing="selectedComponent && selectedComponent.componentId === chart.componentId"
              class="chart__item"
              @check-constraint="viewComponentConstraint"
              @check-setting="editComponenSetting"
            />
          </draggable>
          <draggable
            v-if="chartSecondRow.length > 0"
            :value="chartSecondRow"
            data-row="2"
            group="diagram"
            class="chart__container"
            @end="updateDiagramLayout"
          >
            <war-room-component
              v-for="chart in chartSecondRow"
              :key="chart.componentId"
              :component-id="chart.componentId"
              :is-editable="true"
              :is-focusing="selectedComponent && selectedComponent.componentId === chart.componentId"
              class="chart__item"
              @check-constraint="viewComponentConstraint"
              @check-setting="editComponenSetting"
            />
          </draggable>
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
      @updated="fetchData"
    />
    <component-constraint
      v-if="isShowComponentConstraint"
      :component-data="selectedComponent"
      class="war-room__side-setting"
      @close="closeComponentConstraint"
    />
    <writing-dialog
      v-if="isShowShare"
      :title="$t('warRoom.getPublishedUrl')"
      :button="$t('button.copy')"
      :show-both="false"
      @closeDialog="closeShare"
      @confirmBtn="copyLink"
    >
      <input
        ref="shareInput"
        v-model="shareLink"
        type="text"
        class="input war-room__dialog-input"
      >
    </writing-dialog>
  </section>
</template>

<script>
import moment from 'moment-timezone'
import ComponentSetting from './components/ComponentSetting'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import WarRoomSetting from './components/WarRoomSetting'
import ComponentConstraint from './components/ComponentConstraint'
import WarRoomComponent from './components/WarRoomComponent'
import WritingDialog from '@/components/dialog/WritingDialog'
import draggable from 'vuedraggable'
import { Message } from 'element-ui'
import {
  getWarRoomInfo,
  getWarRoomPool,
  updateWarRoomSetting,
  publishWarRoom,
  unpublishWarRoom,
  updateWarRoomLayout
} from '@/API/WarRoom'

export default {
  name: 'WarRoom',
  inject: ['$validator'],
  components: {
    ComponentSetting,
    CustomDropdownSelect,
    WarRoomSetting,
    ComponentConstraint,
    WarRoomComponent,
    Message,
    WritingDialog,
    draggable
  },
  data () {
    return {
      chartComponent: null,
      numberComponent: null,
      createdComponentType: null,
      isShowComponentSetting: false,
      isShowWarRoomSetting: false,
      isShowComponentConstraint: false,
      selectedComponent: null,
      isLoading: false,
      warRoomConfig: null,
      warRoomBasicInfo: {},
      isEditingWarRoomName: false,
      tempWarRoomPublishedName: null,
      isProcessing: false,
      dataSourcePool: {},
      isShowShare: false,
      shareLink: null,
      otherFeatureList: [
        {
          id: 'shareUrl',
          name: this.$t('warRoom.getPublishedUrl')
        },
        {
          id: 'viewLivePage',
          name: this.$t('warRoom.goToLivePage')
        }
      ],
      defaultComponentData: {
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
          upperBound: null,
          alertSwitch: null,
          maxDataCount: null
        },
        canAlert: null,
        diagramData: {},
        diagramName: null,
        orderSequence: null,
        restriction: {},
        selectedColumns: {}
      }
    }
  },
  computed: {
    addComponentList () {
      return [
        ...(this.chartComponent && this.chartComponent.length < 8) ? [{
          id: 'diagram',
          name: this.$t('warRoom.addChartComponent')
        }] : [],
        ...(this.numberComponent && this.numberComponent.length < 4) ? [{
          id: 'index',
          name: this.$t('warRoom.addNumberComponent')
        }] : []
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
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      const { war_room_id: id } = this.$route.params
      Promise.all([getWarRoomInfo(id), getWarRoomPool(id)])
        .then(([warRoomData, warRoomPoolData]) => {
          const { config, diagramTypeComponents, indexTypeComponents, ...warRoomBasicInfo } = warRoomData
          this.warRoomConfig = config
          if (this.warRoomConfig && !this.warRoomConfig.timeZone) {
            this.warRoomConfig.timeZone = moment.tz.guess()
          }
          this.chartComponent = this.sortComponents(diagramTypeComponents)
          this.numberComponent = this.sortComponents(indexTypeComponents)
          this.warRoomBasicInfo = warRoomBasicInfo
          this.dataSourcePool = warRoomPoolData
        })
        .finally(() => { this.isLoading = false })
    },
    sortComponents (componentList) {
      componentList.sort((a, b) => a.orderSequence - b.orderSequence)
      return componentList.map((component, index) => ({ ...component, orderSequence: index + 1 }))
    },
    addComponent (value) {
      if (this.isShowWarRoomSetting) this.closeWarRoomSetting()
      if (this.isShowComponentConstraint) this.closeComponentConstraint()
      // 再次點擊或切換新增不同類型元件時，重開一個新設定視窗，避免資料變化觸發驗證錯誤
      if (this.isShowComponentSetting) this.closeComponentSetting()
      this.$nextTick(() => {
        if (
          (value === 'index' && this.numberComponent.length === 4) ||
          (value === 'diagram' && this.chartComponent.length === 8)
        ) {
          return Message({
            message: this.$t('message.componentAmountReachedLimit'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
        }
        this.selectedComponent = this.defaultComponentData
        this.createdComponentType = value
        this.isShowComponentSetting = true
      })
    },
    editComponenSetting (data) {
      if (this.isShowWarRoomSetting) this.closeWarRoomSetting()
      if (this.isShowComponentConstraint) this.closeComponentConstraint()
      // 切換不同元件時，重開一個新的編輯視窗，避免資料變化觸發驗證錯誤
      if (this.isShowComponentSetting) this.closeComponentSetting()
      this.$nextTick(() => {
        this.selectedComponent = data
        this.isShowComponentSetting = true
      })
    },
    closeComponentSetting () {
      this.isShowComponentSetting = false
      this.createdComponentType = null
      this.selectedComponent = null
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
      this.selectedComponent = null
      this.isShowComponentConstraint = false
    },
    editWarRoomName () {
      this.tempWarRoomPublishedName = this.warRoomConfig.publishName
      this.isEditingWarRoomName = true
    },
    stopEditingWarRoomName () {
      // 避免名稱欄位資料被清空觸發重新驗證，但欄位已經被 v-if 移除產生錯誤
      this.$validator.detach('warRoomName')
      this.$nextTick(() => {
        this.isEditingWarRoomName = false
        this.tempWarRoomPublishedName = null
      })
    },
    updateWarRoomName () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        this.warRoomConfig.publishName = this.tempWarRoomPublishedName
        const { war_room_id: id } = this.$route.params
        updateWarRoomSetting(id, this.warRoomConfig)
          .then(() => {
            Message({
              message: this.$t('message.editNameSuccess'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.stopEditingWarRoomName()
          })
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
    },
    updateLayout (newLayout) {
      const { war_room_id: warRoomId } = this.$route.params
      this.isProcessing = true
      return updateWarRoomLayout(warRoomId, newLayout)
        .then(() => {
          Message({
            message: this.$t('message.componentLayoutUpdated'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
    },
    async updateIndexLayout (e) {
      const { oldIndex, newIndex } = e
      // 位置如果沒改變就不處理
      if (oldIndex === newIndex) return
      let tempNumberComponent = [...this.numberComponent]
      const tempDraggedComponent = tempNumberComponent.splice(oldIndex, 1)[0]
      tempNumberComponent.splice(newIndex, 0, tempDraggedComponent)
      tempNumberComponent = tempNumberComponent.map((component, index) => ({
        ...component,
        orderSequence: index + 1
      }))

      try {
        await this.updateLayout({
          diagramTypeComponents: this.chartComponent,
          indexTypeComponents: tempNumberComponent
        })
        // 確保透過 API 更新成功才在頁面上變換位置
        this.numberComponent = tempNumberComponent
        this.isProcessing = false
      } catch (e) { return this.isProcessing = false }
    },
    async updateDiagramLayout (e) {
      const oldRow = Number(e.from.dataset.row)
      const newRow = Number(e.to.dataset.row)
      // 位置如果沒改變就不處理
      if ((oldRow === newRow) && (e.oldIndex === e.newIndex)) return
      // 如果為第二列，要處理的 index 需加上第一列的元件數量
      const oldIndex = oldRow === 1 ? e.oldIndex : this.chartFirstRow.length + e.oldIndex
      const newIndex = newRow === 1 ? e.newIndex : this.chartFirstRow.length + e.newIndex

      let tempChartComponent = [...this.chartComponent]
      const tempDraggedComponent = tempChartComponent.splice(oldIndex, 1)[0]
      tempChartComponent.splice(newIndex, 0, tempDraggedComponent)
      tempChartComponent = tempChartComponent.map((chart, index) => ({
        ...chart,
        orderSequence: index + 1
      }))

      try {
        await this.updateLayout({
          diagramTypeComponents: tempChartComponent,
          indexTypeComponents: this.numberComponent
        })
        // 確保透過 API 更新成功才在頁面上變換位置
        this.chartComponent = tempChartComponent
        this.isProcessing = false
      } catch (e) { return this.isProcessing = false }
    },
    previewWarRoom () {
      const { war_room_id: warRoomId } = this.$route.params
      const routeData = this.$router.resolve({ name: 'WarRoomPreviewPage', params: { war_room_id: warRoomId } })
      window.open(routeData.href, '_blank')
    },
    showShareDialog () {
      this.isShowShare = true
      this.shareLink = `${window.location.origin}/war-room?id=${this.warRoomBasicInfo.urlIdentifier}`
    },
    closeShare () {
      this.isShowShare = false
    },
    copyLink () {
      let input = this.$refs.shareInput
      input.select()
      /* For mobile devices */
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
      this.isShowShare = false
    },
    doOtherFeature (action) {
      if (action === 'shareUrl') return this.showShareDialog()
      if (action === 'viewLivePage') {
        const routeData = this.$router.resolve({ name: 'WarRoomLivePage', query: { id: this.warRoomBasicInfo.urlIdentifier } })
        return window.open(routeData.href, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.war-room {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  &__content {
    flex: 1;
    padding: 32px 24px 64px 24px;
    height: 100%;
    overflow: auto;
    border: 1px solid #464a50;
  }

  &__side-setting {
    border: 1px solid #464a50;
    height: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    &--left {
      max-width: 50%;
    }
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

      [lang="en"] & {
        min-width: 60px;
      }
    }
  }

  &__title-input {
    line-height: 32px;
    margin-right: 12px;
    width: 400px;
  }

  &__display {
    position: relative;
    // display: flex;
    // flex-direction: column;

    &--disabled {
      .number,
      .chart {
        opacity: 0.4;
        pointer-events: none;
      }
    }

    .spinner {
      position: absolute;
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

  &__dialog-input {
    margin: 24px 0;
    padding-bottom: 8px;
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

      ::v-deep .dropdown__list-container {
        left: -126px;
        &::after { left: 82%; }
      }
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
      color: #ddd;
    }

    &__status {
      display: inline-block;
      padding: 4px 8px;
      background: #333;
      border-radius: 24px;
      margin-left: 16px;
      font-size: 12px;

      &::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border: 1px solid #999;
        background: transparent;
        border-radius: 50%;
        margin: auto 0;
      }

      &--active {
        &::before {
          border: none;
          background: #2fecb3;
        }
      }
    }

    &__description {
      font-size: 14px;
      line-height: 32px;

      [lang="en"] & {
        text-align: right;
        line-height: 24px;
      }

      .question-lamp {
        color: $theme-color-warning;
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
    height: 680px;
    // flex: 1;

    &__container {
      flex: 1;
      display: flex;
      min-height: 0;

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

  ::v-deep .dropdown {
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
        border-bottom: 12px solid #2b3839;
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
