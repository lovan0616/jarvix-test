<template>
  <div class="schedule-helper">
    <a
      href="javascript:void(0)"
      class="schedule-helper__close-btn"
      @click="closeScheduleHelper"
    ><svg-icon icon-class="close"/></a>
    <h1 class="schedule-helper__title">{{ $t('schedule.helper.columnDescription') }}</h1>
    <div class="schedule-helper__content">
      <div class="sample__menus">
        <!-- 共用資料設定 -->
        <div class="sample__menu">
          <div class="sample__menu__title">
            {{ $t('schedule.setting.commonDataSetting') }}
          </div>
          <div class="sample__menu__list">
            <div 
              v-for="(sample, index) in samples.rawData"
              :key="index"
              :class="{'sample__menu__item--active': isActive('rawData', index)}"
              class="sample__menu__item"
              @click="selectSample('rawData', index)"
            >{{ $t(`schedule.setting.commonData${sample.dataFrameCode}`) }}</div>
          </div>
        </div>
        <!-- 額外限制條件設定 -->
        <div class="sample__menu">
          <div class="sample__menu__title">
            {{ $t('schedule.setting.extraConstraintSetting') }}
          </div>
          <div class="sample__menu__list">
            <div 
              v-for="(sample, index) in samples.constraint"
              :key="index"
              :class="{'sample__menu__item--active': isActive('constraint', index)}"
              class="sample__menu__item"
              @click="selectSample('constraint', index)"
            >{{ $t(`schedule.setting.extraConstraint${sample.dataFrameCode}`) }}</div>
          </div>
        </div>
      </div>
      <div class="sample__content">
        <div class="sample__content__title">
          {{ $t('schedule.helper.fileName') }}：{{ pascalToSnake(currentSample.dataFrameCode) }}.csv
        </div>
        <div
          v-for="(column, index) in currentSample.columns"
          :key="index"
          class="column__block">
          <div class="column__block__title">
            <span>{{ $t('schedule.helper.columnName') }}：{{ column.columnName }}</span>
          </div>
          <div class="column__block__description">
            <div>
              {{ $t('schedule.helper.statsType') }}：{{ statsTypeMapper(column.columnDataType) }}
              <span v-if="statsTypeMapper(column.columnDataType) === 'Datetime'">({{ column.columnDataType }})</span>
            </div>
            <div>{{ $t('schedule.helper.columnDescription') }}：{{ $t(`schedule.helper.${pascalToCamel(currentSample.dataFrameCode)}.${column.columnName}`) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pascalToSnake, pascalToCamel } from '@/schedule/utils/mixins'

export default {
  name: 'ScheduleHelper',
  components: {
  },
  data: () => {
    return {
      selectedSample: {
        category: 'rawData',
        index: 0
      },
      samples: {
        rawData: [
          {
            dataFrameCode: 'Order',
            columns: [
              {
                columnName: 'Job',
                columnDataType: 'string'
              },
              {
                columnName: 'Order',
                columnDataType: 'string'
              },
              {
                columnName: 'Product',
                columnDataType: 'string'
              },
              {
                columnName: 'Quantity',
                columnDataType: 'int'
              },
              {
                columnName: 'Priority',
                columnDataType: 'int'
              },
              {
                columnName: 'Deadline',
                columnDataType: 'yyyy/MM/dd'
              }
            ]
          },
          {
            dataFrameCode: 'Equipment',
            columns: [
              {
                columnName: 'Operation',
                columnDataType: 'string'
              },
              {
                columnName: 'Equipment',
                columnDataType: 'string'
              },
              {
                columnName: 'Stage',
                columnDataType: 'string'
              },
              {
                columnName: 'Position',
                columnDataType: 'string'
              }
            ]
          },
          {
            dataFrameCode: 'Process',
            columns: [
              {
                columnName: 'Equipment',
                columnDataType: 'string'
              },
              {
                columnName: 'Operation',
                columnDataType: 'string'
              },
              {
                columnName: 'Product',
                columnDataType: 'string'
              },
              {
                columnName: 'Material',
                columnDataType: 'string'
              },
              {
                columnName: 'Time',
                columnDataType: 'double'
              },
              {
                columnName: 'Lot',
                columnDataType: 'int'
              },
              {
                columnName: 'OPOrder',
                columnDataType: 'int'
              }
            ]
          },
          {
            dataFrameCode: 'Group',
            columns: [
              {
                columnName: 'Group',
                columnDataType: 'string'
              },
              {
                columnName: 'Product',
                columnDataType: 'string'
              }
            ]
          },
          {
            dataFrameCode: 'SetupTime',
            columns: [
              {
                columnName: 'Stage',
                columnDataType: 'string'
              },
              {
                columnName: 'UpperGroup',
                columnDataType: 'string'
              },
              {
                columnName: 'LowerGroup',
                columnDataType: 'string'
              },
              {
                columnName: 'Time',
                columnDataType: 'int'
              }
            ]
          }
        ],
        constraint: [
          {
            dataFrameCode: 'CapacityConstraint',
            columns: [
              {
                columnName: 'Capacity',
                columnDataType: 'int'
              },
              {
                columnName: 'Stage',
                columnDataType: 'string'
              },
              {
                columnName: 'StartTime',
                columnDataType: 'yyyy-MM-dd HH:mm:ss'
              },
              {
                columnName: 'EndTime',
                columnDataType: 'yyyy-MM-dd HH:mm:ss'
              }
            ]
          },
          {
            dataFrameCode: 'Sjp',
            columns: [
              {
                columnName: 'Group',
                columnDataType: 'string'
              },
              {
                columnName: 'StartTime',
                columnDataType: 'yyyy-MM-dd HH:mm:ss'
              },
              {
                columnName: 'EndTime',
                columnDataType: 'yyyy-MM-dd HH:mm:ss'
              }
            ]
          },
          {
            dataFrameCode: 'Jig',
            columns: [
              {
                columnName: 'Group',
                columnDataType: 'string'
              },
              {
                columnName: 'Stage',
                columnDataType: 'string'
              },
              {
                columnName: 'OPOrder',
                columnDataType: 'int'
              },
              {
                columnName: 'Jig',
                columnDataType: 'string'
              }
            ]
          },
          {
            dataFrameCode: 'JigStorage',
            columns: [
              {
                columnName: 'Jig',
                columnDataType: 'string'
              },
              {
                columnName: 'Count',
                columnDataType: 'int'
              }
            ]
          },
          {
            dataFrameCode: 'Hoj',
            columns: [
              {
                columnName: 'UpperJob',
                columnDataType: 'string'
              },
              {
                columnName: 'LowerJob',
                columnDataType: 'string'
              }
            ]
          },
          {
            dataFrameCode: 'TransferTime',
            columns: [
              {
                columnName: 'Source',
                columnDataType: 'string'
              },
              {
                columnName: 'Destination',
                columnDataType: 'string'
              },
              {
                columnName: 'TransferTime',
                columnDataType: 'int'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    currentSample () {
      return this.samples[this.selectedSample.category][this.selectedSample.index]
    }
  },
  methods: {
    statsTypeMapper (dataType) {
      switch (dataType) {
        case 'string':
          return 'Category'
        case 'int':
        case 'float':
        case 'double':
          return 'Numeric'
        default:
          return 'Datetime'
      }
    },
    closeScheduleHelper () {
      this.$store.commit('scheduleSetting/setIsShowScheduleHelper', false)
    },
    selectSample (category, index) {
      this.selectedSample = { category, index }
    },
    isActive (category, index) {
      return this.selectedSample.category === category && this.selectedSample.index === index
    },
    pascalToSnake,
    pascalToCamel
  }
}
</script>

<style lang="scss" scoped>
.schedule-helper {
  display: flex;
  flex-direction: column;
  padding: 24px 40px;
  position: fixed;
  top: $header-height;
  left: $app-side-nav-closed-width;
  height: calc(100vh - #{$header-height});
  width: calc(100vw - #{$app-side-nav-closed-width});
  background-color: #171717;
  z-index: 1000;
  &__title {
    font-size: 24px;
  }
  &__close-btn {
    position: absolute;
    top: 32px;
    right: 40px;
    color: #fff;
    font-size: 14px;
  }
  &__content {
    display: flex;
    overflow: auto;
    
    .sample {
      position: relative;
      height: 100%;
      display: flex;

      &__menus {
        flex: 0 0 200px;
        margin-right: 20px;
      }

      &__menu {
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        
        &__title {
          position: relative;
          height: 42px;
          padding: 5px 24px;
          border-radius: 5px 5px 0px 0px;
          font-size: 16px;
          line-height: 200%;
          background: #2B4A4E;

          &::before {
            position: absolute;
            top: 18px;
            left: 12px;
            content: "";
            width: 4px;
            height: 6px;
            background: #4DE2F0;
          }
        }

        &__list {
          height: calc(100% - 42px);
          overflow: hidden;
          border-radius: 5px;
          &:hover { overflow: auto; }
        }

        &__item {
          position: relative;
          cursor: pointer;
          padding: 4px 12px;
          font-size: 14px;
          line-height: 32px;
          color: #999999;
          background: rgba(35, 61, 64, 0.6);
          
          &:not(:last-of-type) {
            border-bottom: 1px solid rgba(50, 75, 78, 0.6);
          }

          &:last-child {
            border-radius: 5px;
          }

          &:hover, &.active, &--active{
            background-color: rgba(50, 75, 78, 0.6);;
            color: #fff;

            &:after {
              position: absolute;
              right: 12px;
              top: calc(50% - 4px);
              content: "";
              display: block;
              width: 0;
              height: 0;
              border: 4px solid transparent;
              border-left-color: #fff;
            }
          }
        }
      }

      &__content {
        flex: 1;
        overflow: auto;
        padding-right: 10px;
        
        &__title {
          font-size: 18px;
          line-height: 32px;
        }
        .column__block {
          font-size: 14px;
          &__title {
            margin-top: 16px;
            padding: 12px;
            background-color: rgba(50, 75, 78, 0.6);
          }
          &__description {
            padding: 12px;
            line-height: 2;
          }
        }
      }
    }
  }
}
</style>
