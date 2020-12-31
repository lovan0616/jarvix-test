<template>
  <div class="warning-log__filter">
    <div class="single-filter">
      <svg-icon 
        icon-class="clock" 
        class="icon-clock"/>
      <div class="filter__title">
        {{ $t('miniApp.filterCondition') }}
      </div>
      <div class="filter__label">
        <span @click="isShowStateOptions = !isShowStateOptions">
          {{ activenessFilterDisplayName }}
        </span>
        <div
          v-if="isShowStateOptions"
          class="selector__list-block"
        >
          <template v-for="(option, index) in stateOptions">
            <label
              :key="index"
              class="radio">
              <input
                :checked="filterSetting.activenessValue === option.value"
                class="radio__input"
                type="radio"
                @input="OnStateSelected(index, option.value)"
              >
              <span class="radio__name">{{ option.name }}</span>
            </label>
          </template>
        </div>
        <div
          v-if="filterSetting.activenessValue !== null"
          class="filter__delete-icon-box"
          @click.stop="resetActivenessFilter"
        >
          <svg-icon
            icon-class="close" 
            class="filter__delete-icon"/>
        </div>
      </div>
    </div>
    <div class="single-filter">
      <svg-icon 
        icon-class="clock" 
        class="icon-clock"/>
      <div class="filter__title">
        {{ $t('miniApp.timeScope') }}
      </div>
      <div class="filter__label">
        {{ timeFilterDisplayName }}
        <el-date-picker
          v-model="filterSetting.createdTimeRangeValue"
          :picker-options="pickerOptions"
          class="filter__editor-panel"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          @input="onFilterCriteriaChanged"
        />
        <div
          v-if="timeFilterSelected"
          class="filter__delete-icon-box"
          @click.stop="resetTimeFilter"
        >
          <svg-icon
            icon-class="close" 
            class="filter__delete-icon"/>
        </div>
        <svg-icon
          v-else
          icon-class="triangle"
          class="filter__dropdown-icon"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'WarningLogFilter',
  props: {
    filterSetting: {
      type: Object,
      default: () => {}
    },
    stateOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isShowStateOptions: false,
      pickerOptions: {
        shortcuts: [{
          text: this.$t('miniApp.today'),
          onClick(picker) {
            const start = moment().startOf('day').format('YYYY-MM-DD HH:mm')
            const end = moment().endOf('day').format('YYYY-MM-DD HH:mm')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('miniApp.6hour'),
          onClick(picker) {
            const start = moment().subtract(6, 'hours').format('YYYY-MM-DD HH:mm');
            const end = moment().format('YYYY-MM-DD HH:mm');
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('miniApp.3hour'),
          onClick(picker) {
            const start = moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm');
            const end = moment().format('YYYY-MM-DD HH:mm');
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('miniApp.1hour'),
          onClick(picker) {
            const start = moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm');
            const end = moment().format('YYYY-MM-DD HH:mm');
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    timeFilterSelected () {
      return this.filterSetting.createdTimeRangeValue.length === 2
    },
    timeFilterDisplayName () {
      return this.timeFilterSelected ? `${this.filterSetting.createdTimeRangeValue[0]} - ${this.filterSetting.createdTimeRangeValue[1]}` : '時間條件'
    },
    activenessFilterDisplayName () {
      switch (this.filterSetting.activenessValue) {
        case ('inactive'):
          return this.$t('alert.unfinished')
        case ('active'):
          return this.$t('alert.finished')
        default:
          return this.$t('alert.state')
      }
    }
  },
  created () {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    OnStateSelected (index, name) {
      this.filterSetting.activenessValue = name
      this.isShowStateOptions = false
      this.onFilterCriteriaChanged()
    },
    resetTimeFilter () {
      this.filterSetting.createdTimeRangeValue = []
      this.onFilterCriteriaChanged()
    },
    resetActivenessFilter () {
      this.filterSetting.activenessValue = null
      this.onFilterCriteriaChanged()
    },
    onFilterCriteriaChanged () {
      this.$emit('changed')
    },
    autoHide (evt) {
      if (!this.$el.contains(evt.target)) {
        this.isShowStateOptions = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-log__filter {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 11; // 避免被下方的 el-table loading mask 遮住

  .single-filter {
    display: inline-flex;
    align-items: center;
    user-select: none;
    & + .single-filter {
      margin-left: 16px;
    }
  }
  .filter {
    &__title {
      font-size: 12px;
      margin-left: 6px;
    }
    &__label {
      position: relative;
      line-height: 17px;
      margin-left: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 6px 12px;
      display: flex;
      font-size: 12px;
      align-items: center;
      white-space: nowrap;
      cursor: pointer;
    }
    &__delete-icon-box {
      margin-left: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #A7A7A7;
      cursor: pointer;
      z-index: 1000;
    }
    &__delete-icon {
      font-size: 4px;
    }
    &__dropdown-icon {
      transform: rotate(60deg);
      font-size: 4px;
      margin-left: 4px;
    }
    &__editor-panel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      overflow: hidden;
    }
  }

  .selector__list-block {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100px;
    background-color: var(--color-bg-gray);
    border-radius: 5px;
    overflow: hidden;
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
    max-height: 220px;
    overflow-y: auto;
    z-index: 1;

    .radio {
      padding: 8px 12px;
      min-height: 37px;
      cursor: pointer;
      display: block;
      font-size: 14px;
      color: #CCCCCC;

      &__input {
        display: none;
        &:checked {
          & + .radio__name {
            color: #2AD2E2;
          }
        }
      }

      &:hover {
        color: #2AD2E2;
      }
    }
  }
}
</style>