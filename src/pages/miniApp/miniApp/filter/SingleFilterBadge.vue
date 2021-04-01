<template>
  <el-tooltip
    slot="label"
    :disabled="!isFailed"
    :enterable="false"
    class="tooltip">
    <div slot="content">
      <div class="tooltip__title">{{ $t('miniApp.pleaseCheckFollowingSituations') + '：' }}</div>
      <p class="tooltip__item">{{ '1.' + $t('miniApp.dataframeExistenceAndRebuild') }}</p>
      <p class="tooltip__item">{{ '2.' + $t('miniApp.connectionStatus') }}</p>
      <p class="tooltip__item">{{ '3.' + $t('miniApp.otherReasons') }}</p>
    </div>
    <div
      ref="container"
      :class="{
        'grey-bg': isSingleChoiceFilter,
        'blue-bg': !isEditMode && isShowFilterPanel,
        'hoverable': !isEditMode 
      }"
      class="filter"
      @click="toggleFilterPanel"
    >
      <spinner 
        v-if="isProcessing"
        size="10"
      />
      <template v-else>
        <div
          :class="{'filter__title--error': isFailed}"
          class="filter__title"
        >{{ displayName }}</div>
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
          icon-class="triangle"
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
      </template>
    </div>
  </el-tooltip>
</template>

<script>
import { getDataColumnValue, dataValueSearch } from '@/API/DataSource'

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
    },
    filterSet: {
      type: Array,
      default: () => []
    },
    isNeedUpdate: {
      type: Boolean,
      default: false
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    isFilterListNeedUpdate: {
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
      tempFilter: {},
      relativeDatetimeOptions: ['unset', 'today', '6hour', '3hour', '1hour'],
      isFailed: false
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
      if (this.isFailed) return this.filter.columnName + ': ' + this.$t('miniApp.fetchDataFailed')
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
        this.filter = {
          ...JSON.parse(JSON.stringify(val)),
          dataValueOptionList: this.filter.dataValueOptionList,
          dataMin: this.filter.dataMin,
          dataMax: this.filter.dataMax
        }
      }
    },
    searchInput (value) {
      this.isLoading = true
      this.searchValue(value)
        .then(response => {
          this.filter.dataValueOptionList = response.fuzzySearchResult.map(value => ({
            value: value,
            name: value,
            isSelected: this.filter.dataValues.includes(value)
          }))
        })  
        .finally(() => this.isLoading = false)
    },
    isNeedUpdate (val) {
      if (!val) return
      if (this.isShowFilterPanel) this.toggleFilterPanel()
      // 父層 filter 改變時，先清空此曾選擇的 data value
      this.filter.dataValues = []
      this.fetchData()
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
      this.$emit('update:isProcessing', true)
      try {
        if (this.filter.statsType === 'RELATIVEDATETIME') return this.getRelativeDatetimeOption()
        if (this.filter.statsType === 'NUMERIC' || this.filter.statsType === 'DATETIME') return await this.getDataColumnValue()

        const { fuzzySearchResult: tempOptionList } = await this.searchValue()

        // 如果當前 filter 有已選定的值，先確認是否有在 option 清單中
        if (this.filter.dataValues.length > 0) {
          const defaultSearchInput = this.filter.dataValues[0]
          const { fuzzySearchResult: checkedOptionList } = await this.searchValue(defaultSearchInput)
          // 如果沒有結果，則把之前選定的值清空
          if (checkedOptionList.length === 0) {
            this.filter.dataValues = []
          } else {
            // 確認有沒有在無搜尋字串時，至多 200 個選項當中
            const isInTempOptionList = tempOptionList.includes(defaultSearchInput)
            // 如果沒有，代表選定值在 200 個選項之外，因此把它加到第 201 個選項
            !isInTempOptionList && tempOptionList.push(defaultSearchInput)
          }
        }

        // 將值轉換成下拉選項
        this.filter.dataValueOptionList = tempOptionList.map(value => ({
          value: value,
          name: value,
          isSelected: this.filter.dataValues.includes(value)
        }))
      
        // 控制項須確保至少選定其中一個項目：如果當前沒有或之前選定的值在新取的選項中沒有，則預設為第一個選項
        const isNeedDefaultSelect = this.isSingleChoiceFilter 
          && (this.filter.dataValues.length === 0 || !this.filter.dataValueOptionList.find(option => option.isSelected))
          && this.filter.dataValueOptionList.length > 0
          
        //  將預設選項更新出去
        if (isNeedDefaultSelect) return this.updateSingleEnumFilteredColumnValue(null, this.filter.dataValueOptionList[0].name)
        // 如果是因為階層被觸發去重新取選單資料，須把取完後的結果更新出去，並由外層委派下一個 filter 去更新
        this.isNeedUpdate || this.filter.dataValues.length === 0 ? this.$emit('updateFilter', this.filter) : this.$emit('update:isProcessing', false)
      } catch (e) {
        this.isFailed = true
      } finally {
        this.$emit('update:isProcessing', false)
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
    searchValue (searchString = '') {
      return dataValueSearch(this.filter.columnId, {
        page: 0,
        searchString,
        size: 200,
        restrictions: this.restrictions()
      })
    },
    toggleFilterPanel () {
      if (this.isProcessing || this.isFailed) return
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
        this.$emit('update:isFilterListNeedUpdate', true)
        this.$emit('updateFilter', this.tempFilter)
        this.toggleFilterPanel()
      })
    },
    updateDateTimeFilteredColumnValue ([start, end]) {
      this.filter.start = start
      this.filter.end = end
      this.$emit('update:isFilterListNeedUpdate', true)
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
      this.$emit('update:isFilterListNeedUpdate', true)
      this.$emit('updateFilter', this.filter)
    },
    updateSingleEnumFilteredColumnValue (event, columnValue) {
      this.filter.dataValues = [columnValue]
      this.$emit('update:isFilterListNeedUpdate', true)
      this.$emit('updateFilter', this.filter)
    },
    checkValueIsChecked (value) {
      return this.filter.dataValues.includes(value)
    },
    removeFilter () {
      this.$emit('removeFilter')
    },
    restrictions () {
      const currentFilterIndex = this.filterSet.findIndex(filter => filter.columnId === this.initialFilter.columnId)
      const restrictions = this.filterSet
        .slice(0, currentFilterIndex)
        .filter(filter => this.checkShouldApplyMiniAppFilter(filter))
        .map(filter => {

          let type = ''
          let data_type = ''
          switch (filter.statsType) {
            case ('STRING'):
            case ('BOOLEAN'):
            case ('CATEGORY'):
              data_type = 'string'
              type = 'enum'
              break
            case ('FLOAT'):
            case ('NUMERIC'):
              data_type = 'int'
              type = 'range'
              break
            case ('DATETIME'):
            case ('RELATIVEDATETIME'):
              data_type = 'datetime'
              type = 'range'
              break  
          }

          // 相對時間 filter 需取當前元件所屬 dataframe 的預設時間欄位和當前時間來套用
          if (filter.statsType === 'RELATIVEDATETIME') return [{
            type,
            properties: {
              data_type,
              dc_id: this.componentData.dateTimeColumn.dataColumnId,
              display_name: this.componentData.dateTimeColumn.dataColumnPrimaryAlias,
              ...this.formatRelativeDatetime(filter.dataValues[0])
            }
          }]
          
          return [{
            type,
            properties: {
              data_type,
              dc_id: filter.columnId,
              display_name: filter.columnName,
              ...((filter.statsType === 'STRING' || filter.statsType === 'BOOLEAN' || filter.statsType === 'CATEGORY')  && {
                datavalues: filter.dataValues,
                display_datavalues: filter.dataValues
              }),
              ...((filter.statsType === 'NUMERIC' || filter.statsType === 'FLOAT' || filter.statsType === 'DATETIME') && {
                start: filter.start,
                end: filter.end
              }),
            }
          }]
        })
        return restrictions.length === 0 ? null : restrictions
    },
  }
}
</script>

<style lang="scss" scoped>
.filter {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  user-select: none;

  &__title {
    font-size: 12px;
    line-height: 17px;
    margin-right: 4px;
    &--error {
      color: #FFDF6F;
    }
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

  &__delete-icon {
    font-size: 4px;
  }

  &__dropdown-icon {
    transform: rotate(180deg);
    font-size: 6px;
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

  /deep/ .spinner-block {
    padding: 3.5px 0;
  }
}

.tooltip {
  &__title {
    font-size: 12px;
    font-weight: bold;
  }
  &__item {
    font-size: 12px;
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
