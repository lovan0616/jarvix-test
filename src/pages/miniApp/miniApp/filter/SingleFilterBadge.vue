<template>
  <div
    ref="container"
    :class="{
      'grey-bg': isEditMode,
      'blue-bg': !isEditMode && isShowFilterPanel,
      'hoverable': !isEditMode 
    }"
    class="filter"
    @click="toggleFilterPanel"
  >
    <div class="filter__title">{{ displayName }}</div>
    <div
      v-if="isEditMode"
      class="filter__delete-icon-box" 
      @click="removeFilter">
      <svg-icon
        icon-class="close" 
        class="filter__delete-icon"/>
    </div>
    <svg-icon
      v-else
      icon-class="dropdown" 
      class="filter__dropdown-icon"/>
    <!--Range-->
    <div
      v-if="isShowFilterPanel && filter.statsType === 'NUMERIC'"
      class="filter__input-panel input-panel"
      @click.stop
    >
      <spinner 
        v-if="isLoading"
        class="filter-spinner"
      />
      <template v-else>
        <div class="input-panel__input-group">
          <label 
            class="input-panel__label" 
            for="max">{{ `${$t('miniApp.upperBound')}(max: ${filter.dataMax})` }}</label>
          <input
            v-validate="upperBoundRules"
            id="max"
            ref="upperBound"
            v-model.trim="tempFilter.end"
            :placeholder="$t('miniApp.pleaseEnterNumber')"
            name="upperBound" 
            class="input-panel__input input" 
            type="text">
          <div 
            v-show="errors.has('upperBound')"
            class="error-text"
          >{{ errors.first('upperBound') }}</div>
        </div>
        <div class="input-panel__input-group">
          <label 
            class="input-panel__label" 
            for="min">{{ `${$t('miniApp.lowerBound')}(min: ${filter.dataMin})` }}</label>
          <input 
            v-validate="lowerBoundRules"
            id="min"
            ref="lowerBound"
            v-model.trim="tempFilter.start"
            :placeholder="$t('miniApp.pleaseEnterNumber')" 
            name="lowerBound"
            class="input-panel__input input" 
            type="text">
          <div 
            v-show="errors.has('lowerBound')"
            class="error-text"
          >{{ errors.first('lowerBound') }}</div>
        </div>
        <div class="button__block">
          <button 
            class="btn btn-outline"
            @click="toggleFilterPanel"
          >{{ $t('button.cancel') }}</button>
          <button 
            :disabled="isProcessing"
            class="btn btn-default"
            @click="updateRangeFilteredColumnValue"
          >{{ $t('button.save') }}</button>
        </div>
      </template>
    </div>
    <!--Datetime-->
    <div 
      v-else-if="filter.statsType === 'DATETIME'"
      :class="{ 'hidden': isShowFilterPanel }"
      class="filter__datetime-picker-panel"
    >
      <el-date-picker
        ref="datepicker"
        :value="dateTimeRange"
        :format="'yyyy-MM-dd HH:mm'"
        :picker-options="pickerOptions"
        :editable="false"
        :clearable="false"
        :default-value="filter.dataMin"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm"
        @input="updateDateTimeFilteredColumnValue"
      />
    </div>
    <!--Enum-->
    <div
      v-if="isShowFilterPanel && (filter.statsType === 'CATEGORY' || filter.statsType === 'BOOLEAN')"
      class="filter__selector-panel selector"
      @click.stop>
      <input
        v-model.trim="searchInput"
        :placeholder="$t('dataFrameAdvanceSetting.searchColumn')"
        class="selector__input-block"
        type="text"
      >
      <spinner
        v-if="isLoading"
        class="filter-spinner"
        size="20"
      />
      <template v-else>
        <div 
          v-if="filter.dataValueOptionList.length === 0" 
          class="empty-message">
          {{ $t('message.emptyResult') }}
        </div>
        <div class="selector__list-block">
          <template v-for="(value, index) in filter.dataValueOptionList">
            <!--Control panel filter-->
            <label
              v-if="isSingleChoiceFilter"
              :key="index"
              name="control"
              class="radio">
              <input
                :checked="checkValueIsChecked(value.name)"
                class="radio__input"
                type="radio"
                @input="updateSingleEnumFilteredColumnValue($event, value.name)"
              >
              <span class="radio__name">{{ value.name }}</span>
            </label>
            <!--: Multiple choice Filter-->
            <label
              v-else
              :key="index"
              class="checkbox">
              <div class="checkbox-label">
                <input
                  :checked="checkValueIsChecked(value.name)"
                  type="checkbox"
                  @input="updateMultipleEnumFilteredColumnValue($event, value.name)"
                >
                <div class="checkbox-square"/>
              </div>
              <span class="radio__name">{{ value.name }}</span>
            </label>
          </template>
        </div>
      </template>
    </div>
    <!--Relative Datetime-->
    <div
      v-if="isShowFilterPanel && (filter.statsType === 'RELATIVEDATETIME')"
      class="filter__selector-panel selector"
      @click.stop>
      <div 
        v-if="filter.dataValueOptionList.length === 0" 
        class="empty-message">
        {{ $t('message.emptyResult') }}
      </div>
      <div class="selector__list-block">
        <template v-for="(option, index) in filter.dataValueOptionList">
          <label
            :key="index"
            name="control"
            class="radio">
            <input
              :checked="checkValueIsChecked(option.value)"
              class="radio__input"
              type="radio"
              @input="updateSingleEnumFilteredColumnValue($event, option.value)"
            >
            <span class="radio__name">{{ $t('miniApp.' + option.name) }}</span>
          </label>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataColumnValue, dataValueFuzzySearch } from '@/API/DataSource'

export default {
  name: 'SingleFilterBadge',
  inject: ['$validator'],
  props: {
    initialFilter: {
      type: Object,
      required: true
    },
    isEditMode: {
      type: Boolean,
      required: true
    },
    isSingleChoiceFilter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filter: {},
      isLoading: false,
      searchInput: '',
      isShowFilterPanel: false,
      isProcessing: false,
      tempFilter: {},
      relativeDatetimeOptions: ['unset', 'today', '6hour', '3hour', '1hour']
    }
  },
  computed: {
    upperBoundRules () {
      return 'required|decimal|validUpperBound:lowerBound'
    },
    lowerBoundRules () {
      return 'required|decimal|validLowerBound:upperBound'
    },
    displayName () {
      if (this.filter.statsType === 'CATEGORY' || this.filter.statsType === 'BOOLEAN') {
        const selectedAmount = this.filter.dataValues.length
        if (selectedAmount === 0) return this.filter.columnName
        return this.isSingleChoiceFilter ? `${this.filter.columnName}: ${ this.filter.dataValues[0] }` : `${this.filter.columnName} (${ this.filter.dataValues.length })`
      } else if (this.filter.statsType === 'RELATIVEDATETIME') {
        if (this.filter.dataValues.length === 0) return this.filter.columnName
        return `${this.filter.columnName}: ${ this.$t('miniApp.' + this.filter.dataValues[0]) }`
      } else if (this.filter.statsType === 'NUMERIC') {
        return this.filter.start === null || this.filter.start === '' ? this.filter.columnName :`${this.filter.columnName} (${ this.filter.start} - ${this.filter.end})`
      } else if (this.filter.statsType === 'DATETIME') {
        return this.filter.start === null || this.filter.start === '' ? this.filter.columnName :`${this.filter.columnName}: ${ this.filter.start} - ${this.filter.end}`
      }
    },
    dateTimeRange () {
      if (!this.filter.start && !this.filter.end) return []
      return [this.filter.start, this.filter.end]
    },
    pickerOptions () {
      const vm = this
      return {
        disabledDate(time) {
          return time.getTime() < new Date(vm.filter.dataMin).getTime() || time.getTime() > new Date(vm.filter.dataMax).getTime()
        }
      }
    }
  },
  watch: {
    initialFilter: {
      deep: true,
      handler (val) {
        this.filter = JSON.parse(JSON.stringify(val))
      }
    },
    searchInput () {
      this.searchValue()
        .finally(() => this.isLoading = false)
    }
  },
  mounted () {
    this.filter = JSON.parse(JSON.stringify(this.initialFilter))
    this.fetchData()
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.isShowFilterPanel) return false
      if (!this.$el.contains(evt.target))  this.toggleFilterPanel()
    },
    async fetchData () {
      this.isLoading = true

      try {
        if (this.filter.statsType === 'RELATIVEDATETIME') return this.getRelativeDatetimeOption()
        if (this.filter.statsType === 'NUMERIC' || this.filter.statsType === 'DATETIME') return await this.getDataColumnValue()

        // category 和 boolean 欄位如果直接打 getDataColumnValue api 會取到 alias，所以直接打搜尋 api 就能避免
        await this.searchValue()

        // preview 和 view 模式下，控制項須確保至少選定其中一個項目，如果沒有則預設第一個選項
        const isNeedDefaultSelect = this.isSingleChoiceFilter && this.filter.dataValues.length === 0
        if (isNeedDefaultSelect) this.updateSingleEnumFilteredColumnValue(null, this.filter.dataValueOptionList[0].name)
      } finally {
        this.isLoading = false
      }
    },
    getRelativeDatetimeOption () {
      this.filter.dataValueOptionList = this.relativeDatetimeOptions.map(value => ({
        value: value,
        name: value,
        isSelected: this.filter.dataValues.includes(value)
      }))
    },
    getDataColumnValue () {
      return getDataColumnValue(this.filter.columnId)
        .then(response => {
          const statsType = response.type
          const valueList = response[statsType.toLowerCase()]

          if (statsType === 'NUMERIC') {
            this.filter.dataMin = valueList.min
            this.filter.dataMax = valueList.max
            return 
          }
          
          if (statsType === 'DATETIME') {
            // 目前後端有用到 13 種日期格式，先預設所有日期最小單位都到秒
            valueList.datePattern = 'yyyy-MM-dd HH:mm:ss'
            this.filter.dataMin = this.customerTimeFormatter(valueList.start, 'SECOND')
            this.filter.dataMax = this.customerTimeFormatter(valueList.end, 'SECOND')
          }
        })
    },
    searchValue () {
      // this.isLoading = true
      return dataValueFuzzySearch(this.filter.columnId, {
        page: 0,
        searchString: this.searchInput,
        size: 200,
        // TODO: 帶入父層級條件
        restrictions: null
      })
        .then((response, index) => {
          this.filter.dataValueOptionList = response.fuzzySearchResult.map(value => ({
            value: value,
            name: value,
            isSelected: this.filter.dataValues.includes(value)
          }))
        })
        // .finally(() => this.isLoading = false)
    },
    toggleFilterPanel () {
      if (!this.isShowFilterPanel) {
        this.createTempFilter()
      } else {
        if (this.filter.statsType === "NUMERIC") {
          this.$validator.detach('upperBound')
          this.$validator.detach('lowerBound')
          this.$nextTick(() => this.tempFilter = {})
        } else if (this.filter.statsType === 'CATEGORY' || this.filter.statsType === 'BOOLEAN') {
          this.searchInput = ''
        }
      }
      this.isShowFilterPanel = !this.isShowFilterPanel
    },
    updateRangeFilteredColumnValue () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.$emit('updateFilter', this.tempFilter)
        this.toggleFilterPanel()
      })
    },
    updateDateTimeFilteredColumnValue ([start, end]) {
      this.filter.start = start
      this.filter.end = end
      this.$emit('updateFilter', this.filter)
      this.toggleFilterPanel()
    },
    createTempFilter () {
      this.tempFilter = JSON.parse(JSON.stringify(this.filter))
    },
    updateMultipleEnumFilteredColumnValue ({ target: { checked } }, columnValue) {
      const isInDataValueList = this.filter.dataValues.includes(columnValue)
      if (checked && !isInDataValueList) {
        this.filter.dataValues.push(columnValue)
      } else {
        this.filter.dataValues = this.filter.dataValues.filter(value => value !== columnValue)
      }
      this.$emit('updateFilter', this.filter)
    },
    updateSingleEnumFilteredColumnValue (event, columnValue) {
      this.filter.dataValues = [columnValue]
      this.$emit('updateFilter', this.filter)
    },
    checkValueIsChecked (value) {
      return this.filter.dataValues.includes(value)
    },
    removeFilter () {
      this.$emit('removeFilter')
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  position: relative;
  border: 1px solid #DEDEDE;
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  user-select: none;

  &__title {
    font-size: 12px;
    line-height: 17px;
    margin-right: 4px;
  }

  &__delete-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #A7A7A7;
    cursor: pointer;
  }

  &__delete-icon,
  &__dropdown-icon {
    font-size: 4px;
  }

  &__input-panel,
  &__selector-panel {
    position: absolute;
    left: 0;
    top: 100%;
    width: 215px;
    background-color: var(--color-bg-gray);
    border-radius: 5px;
    overflow: hidden;
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
  }

  /*透過透明度隱藏預設的結果顯示，但仍保留點擊時要能被開啟的功能*/
  &__datetime-picker-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    overflow: hidden;

    /*大小為零時，使用找點任何一處可觸發選擇匡被關閉*/
    &.hidden {
      width: 0;
      height: 0;
    }
  }

  &:not(:last-of-type) {
    margin-right: 8px;
  }

  &.grey-bg {
    border: none;
    background: rgba(255, 255, 255, 0.2);
  }

  &.blue-bg {
    background: #2AD2E2;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &.hoverable {
    cursor: pointer;
  }

  .input-panel {
    background: #303435;
    border-radius: 5px;
    padding: 12px;

    &__input-group {
      margin-bottom: 8px;
    }

    &__label {
      color: #CCCCCC;
      font-size: 12px;
      margin-bottom: 4px;
      display: block;
    }

    &__input {
      background: #141C1D;
      opacity: 0.99;
      border-radius: 5px;
      border: none;
      width: 100%;
      height: 40px;
      padding: 8px;

      &::placeholder {
        color: #888888;
      }
    }

    &.error-text {
      margin-top: 5px;
    }
  }
}

.selector {
  &__input-block {
    margin: 12px 12px 8px 12px;
    padding: 9px 12px;
    width: calc(100% - 24px);
    font-size: 14px;
    color: #888888;
    border: none;
    border-radius: 8px;
    background-color: #141C1D;

    &:focus {
      outline: none;
    }
      
    .placeholder {
      font-size: 14px;
      line-height: 22px;
      color: #888888;
    }
  }

  &__list-block {
    max-height: 220px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.7);
    }  

    .checkbox {
      display: flex;
      flex-direction: row;
      padding: 8px 12px;
      min-height: 32px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, .6);
      }

      &:not(:first-child) {
        border-top: 1px solid #3F4546;
      }

      &-label {
        margin: 0 22px 0 2px;

        & input:checked ~ .checkbox-square {
          background: #777777;
          border-color: #DCDFE6;
        }

        & input:disabled ~ .checkbox-square:after {
          border-color: #C0C4CC;
        }
      }

      & > span {
        font-size: 14px;
        line-height: 16px;
        color: #CCC;
      }
    }

    .radio {
      padding: 8px 12px;
      min-height: 32px;
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

  .empty-message {
    margin-bottom: 12px;
    padding: 0 12px;
    font-size: 12px;
    line-height: 20px;
    color: #CCC;
  }
}
</style>