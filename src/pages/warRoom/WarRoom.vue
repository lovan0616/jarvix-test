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
          <h1 class="war-room__title">未命名戰情室</h1>
          <!--TODO: 新增編輯功能-->
          <!-- <div class="war-room__title-edit">
            <input
              v-model="publishedName"
              class="input war-room__title-input">
            <button 
              type="button"
              class="btn btn-default"
            >{{ $t('button.save') }}</button>
            <button 
              type="button"
              class="btn btn-outline"
            >{{ $t('button.cancel') }}</button>
          </div> -->
        </div>
        <div class="war-room__header--right button-container">
          <div class="button-container--top">
            <span class="button-container__time">
              {{ $t('warRoom.updateTime') + '：' + '2020/08/22' }}
            </span>
            <!--判斷是否已發布，更改內容與燈號-->
            <span class="button-container__status">
              {{ $t('warRoom.notPublished') }}
            </span>
            <!--TODO: 未發布時顯示-->
            <button 
              type="button"
              class="btn-m btn-default button-container__button"
            >{{ $t('warRoom.publish') }}</button>
            <!--TODO: 已發布時顯示-->
            <button 
              type="button"
              class="btn-m btn-default button-container__button"
            >{{ $t('button.update') }}</button>
            <!--TODO: 未發布時顯示-->
            <button 
              type="button"
              class="btn-m btn-secondary button-container__button"
            >{{ $t('warRoom.unpublish') }}</button>
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
            <!--TODO: Disable button if number reaches max-->
            <custom-dropdown-select
              :data-list="addComponentList"
              trigger="hover"
              @select="addComponent"
            >
              <template #display>
                <button
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
          <div
            v-for="number in dummyNumbers"
            :key="number"
            class="number__item"
          >
            <div class="number__item-title">公司總銷售額</div>
            {{ 'number' + number }}
          </div>
        </div>
        <div class="chart">
          <div class="chart__container">
            <div
              v-for="chart in chartFirstRow"
              :key="chart"
              class="chart__item"
            >
              <div class="chart__item-title">公司總銷售額</div>
              {{ 'chart' + chart }}
            </div>
          </div>
          <div
            v-if="chartSecondRow.length > 0"
            class="chart__container"
          >
            <div
              v-for="chart in chartSecondRow"
              :key="chart"
              class="chart__item"
            >
              <div class="chart__item-title">公司總銷售額</div>
              {{ chart }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <component-setting
      v-if="isShowComponentSetting"
      :component-type="createdComponentType"
      class="war-room__side-setting"
      @close="closeComponentSetting"
    />
    <war-room-setting
      v-if="isShowWarRoomSetting"
      class="war-room__side-setting"
      @close="closeWarRoomSetting"
    />
    <component-constraint
      v-if="isShowComponentConstraint"
      :component-data="selectedComponent"
      @close="closeComponentConstraint"
    />
  </section>
</template>

<script>
import ComponentSetting from './components/ComponentSetting'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import WarRoomSetting from './components/WarRoomSetting'
import ComponentConstraint from './components/ComponentConstraint'

const dummyNumbers = []
for (let i = 0; i < 3; i++) {
  dummyNumbers.push(i + 1)
}

const dummyChart = []
for (let i = 0; i < 6; i++) {
  dummyChart.push(i + 1)
}

export default {
  name: 'WarRoom',
  components: {
    ComponentSetting,
    CustomDropdownSelect,
    WarRoomSetting,
    ComponentConstraint
  },
  data () {
    return {
      dummyChart: dummyChart,
      dummyNumbers: dummyNumbers,
      addComponentList: [
        {
          id: 'chart',
          name: this.$t('warRoom.addChartComponent')
        },
        {
          id: 'number',
          name: this.$t('warRoom.addNumberComponent')
        }
      ],
      createdComponentType: null,
      isShowComponentSetting: false,
      isShowWarRoomSetting: false,
      isShowComponentConstraint: false,
      selectedComponent: {}
    }
  },
  computed: {
    chartFirstRow () {
      if (this.dummyChart.length <= 3) return this.dummyChart
      const endChartIndex = Math.floor(this.dummyChart.length / 2)
      return this.dummyChart.slice(0, endChartIndex)
    },
    chartSecondRow () {
      if (this.dummyChart.length <= 3) return []
      const startChartIndex = Math.floor(this.dummyChart.length / 2)
      return this.dummyChart.slice(startChartIndex)
    }
  },
  methods: {
    addComponent (value) {
      if (this.isShowWarRoomSetting) this.closeWarRoomSetting()
      if (this.isShowComponentConstraint) this.closeComponentConstraint()
      // TODO: check if has reached max before creation
      this.createdComponentType = value
      this.isShowComponentSetting = true
    },
    closeComponentSetting () {
      this.isShowComponentSetting = false
      this.createdComponentType = null
    },
    openWarRoomSetting () {
      if (this.isShowComponentSetting) this.closeComponentSetting()
      if (this.isShowComponentConstraint) this.closeComponentConstraint()
      this.isShowWarRoomSetting = true
    },
    closeWarRoomSetting () {
      this.isShowWarRoomSetting = false
    },
    closeComponentConstraint () {
      this.isShowComponentConstraint = false
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
        background: #2FECB3;
        border-radius: 50%;
        margin: auto 0;
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
      background: #1C2424;
      border-radius: 5px;
      padding: 16px;
      &:not(:last-of-type) {
        margin-right: 20px;
      }
    }

    &__item-title {
      font-size: 14px;
      color: #999999;
      margin-bottom: 8px;
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
      border-radius: 5px;
      background: #1C2424;
      padding: 16px;
      &:not(:last-of-type) {
        margin-right: 20px;
      }
    }

    &__item-title {
      font-size: 14px;
      color: #999999;
      margin-bottom: 8px;
      &::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #2FECB3;
        border-radius: 50%;
        margin-right: 4px;
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
