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
        </div>
        <div class="war-room__header--right button-container">
          <div class="button-container--top">
            <button 
              type="button"
              class="btn-m btn-default button-container__button"
            >{{ $t('warRoom.publish') }}</button>
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
            {{ number }}
          </div>
        </div>
        <div class="chart">
          <div class="chart__container">
            <div
              v-for="chart in chartFirstRow"
              :key="chart"
              class="chart__item"
            >
              {{ chart }}
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
              {{ chart }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <component-setting class="war-room__side-setting" />
  </section>
</template>

<script>
import ComponentSetting from './components/ComponentSetting'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'

const dummyNumbers = []
for (let i = 0; i < 4; i++) {
  dummyNumbers.push(i + 1)
}

const dummyChart = []
for (let i = 0; i < 7; i++) {
  dummyChart.push(i + 1)
}

export default {
  name: 'WarRoom',
  components: {
    ComponentSetting,
    CustomDropdownSelect
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
      ]
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
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.war-room {
  display: flex;
  width: 100%;

  &__content {
    flex: 1;
    padding: 32px 24px 64px 24px;
    min-height: calc(100vh - #{$header-height});
    border: 1px solid #464A50;
  }

  &__side-setting {
    border: 1px solid #464A50;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__title {
    margin: 16px 0 0 0;
    line-height: 32px;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    
    &--top,
    &--bottom {
      display: flex;
      justify-content: flex-end;
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
  }

  .number {
    display: flex;
    border: 1px solid rgb(255, 255, 255);
    height: 94px;
    width: 100%;

    &__item {
      border: 1px solid green;
      flex: 1;
      max-width: (100% / 3);
    }
  }

  .chart {
    display: flex;
    flex-direction: column;
    height: 474px;

    &__container {
      flex: 1;
      display: flex;
    }

    &__item {
      border: 1px solid green;
      flex: 1;
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
