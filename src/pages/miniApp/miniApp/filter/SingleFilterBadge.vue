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
            for="max">{{ `上限值(max: ${filter.dataMax}` }}</label>
          <input
            v-validate="upperBoundRules"
            id="max"
            ref="upperBound"
            v-model.trim="tempFilter.end"
            name="upperBound"
            placeholder="請填入數字" 
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
            for="min">{{ `下限值(min: ${filter.dataMin}` }}</label>
          <input 
            v-validate="lowerBoundRules"
            id="min"
            ref="lowerBound"
            v-model.trim="tempFilter.start"
            name="lowerBound" 
            placeholder="請填入數字"
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
            <label 
              :key="index"
              class="checkbox">
              <div class="checkbox-label">
                <input
                  :checked="checkValueIsChecked(value.name)"
                  type="checkbox"
                  @input="updateEnumFilteredColumnValue($event, value.name)"
                >
                <div class="checkbox-square"/>
              </div>
              <span>{{ value.name }}</span>
            </label>
          </template>
        </div>
      </template>
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
    }
  },
  data () {
    return {
      filter: {},
      isLoading: false,
      searchInput: '',
      isShowFilterPanel: false,
      isProcessing: false,
      tempFilter: {}
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
      if (this.isEditMode) return this.filter.columnName 
      if (this.filter.statsType === 'CATEGORY' || this.filter.statsType === 'BOOLEAN') {
        const selectedAmount = this.filter.datavalues.length
        return selectedAmount === 0 ? this.filter.columnName :`${this.filter.columnName} (${ this.filter.datavalues.length})`
      } else if (this.filter.statsType === 'NUMERIC') {
        return this.filter.start === null || this.filter.start === '' ? this.filter.columnName :`${this.filter.columnName} (${ this.filter.start} - ${this.filter.end})`
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
    fetchData () {
      this.isLoading = true
      getDataColumnValue(this.filter.columnId)
        .then(response => {
          const statsType = response.type
          const valueList = statsType === 'BOOLEAN' ? response['bool'] : response[statsType.toLowerCase()]

          if (statsType === 'NUMERIC') {
            this.filter.dataMin = valueList.min
            this.filter.dataMax = valueList.max
            return this.isLoading = false
          }

          if (statsType === 'CATEGORY' && !valueList) return this.searchValue()

          this.filter.dataValueOptionList = valueList.map(value => ({
            value: value,
            name: value,
            isSelected: this.initialFilter.dataValues.includes(value)
          }))
          return this.isLoading = false

          // TODO: 實作 date time
        })
        .catch(() => this.isLoading = false)
    },
    searchValue () {
      this.isLoading = true
      dataValueFuzzySearch(this.filter.columnId, this.searchInput)
        .then(response => {
          this.filter.dataValueOptionList = response.fuzzySearchResult.map(value => ({
            value: value,
            name: value,
            isSelected: this.initialFilter.dataValues.includes(value)
          }))
          this.isLoading = false
        })
    },
    toggleFilterPanel () {
      if (this.isEditMode) return
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
    createTempFilter () {
      this.tempFilter = JSON.parse(JSON.stringify(this.filter))
    },
    updateEnumFilteredColumnValue ({ target: { checked } }, columnValue) {
      const isInDataValueList = this.filter.dataValues.includes(columnValue)
      if (checked && !isInDataValueList) {
        this.filter.dataValues.push(columnValue)
      } else {
        this.filter.dataValues = this.filter.dataValues.filter(value => value !== columnValue)
      }
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