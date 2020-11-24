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
    <div class="filter__title">{{ filter.columnName }}</div>
    <div 
      v-if="isEditMode" 
      class="filter__close-icon-box">
      <svg-icon
        icon-class="close" 
        class="filter__close-icon"/>
    </div>
    <svg-icon
      v-else
      icon-class="dropdown" 
      class="filter__dropdown-icon"/>
    <div
      v-if="isShowFilterPanel && filter.statsType === 'NUMERIC'"
      class="filter__input-panel input-panel"
      @click.stop
    >
      <div class="input-panel__input-group">
        <label 
          class="input-panel__label" 
          for="max">{{ `上限值(max: ${filter.dataMax}` }}</label>
        <input
          v-validate="upperBoundRules"
          id="max"
          ref="upperBound"
          v-model.trim="tempFilter.start"
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
          v-model.trim="tempFilter.end"
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
  },
  watch: {
    initialFilter: {
      deep: true,
      handler (val) {
        this.filter = JSON.parse(JSON.stringify(val))
      }
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
      if (!this.$el.contains(evt.target))  this.isShowFilterPanel = false
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

          if (statsType === 'NUMERIC' && !valueList) return this.searchValue()

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
        })
      this.isLoading = false
    },
    toggleFilterPanel () {
      if (this.isEditMode) return
      if (!this.isShowFilterPanel) {
        this.createTempFilter()
      } else {
        this.tempFilter = {}
      }
      this.isShowFilterPanel = !this.isShowFilterPanel
    },
    updateRangeFilteredColumnValue () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.$emit('updateFilter', this.tempFilter)
        this.$validator.detach('upperBound')
        this.$validator.detach('lowerBound')
        this.$nextTick(() => this.toggleFilterPanel())
      })
    },
    createTempFilter () {
      this.tempFilter = JSON.parse(JSON.stringify(this.filter))
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

  &__close-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #A7A7A7;
    cursor: pointer;
  }

  &__close-icon,
  &__dropdown-icon {
    font-size: 4px;
  }

  &__input-panel {
    position: absolute;
    left: 0;
    top: 100%;
    width: 215px;
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

.filter-control {
  padding: 16px 19px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-right: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  &__filter-icon {
    margin-right: 11px;
  }

  &.has-background {
    background: #1C292B;
  }

  


  &__selector {
    position: absolute;
    top: 30px;
    left: 0;
    padding-top: 12px;
    width: 100%;
    border-radius: 5px;
    background-color: var(--color-bg-gray);
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
    z-index: 2;

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      right: 6px;
      border-bottom: 12px solid #2B3839;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
    }
  }

  .selector {
    &__input-block {
      margin: 0 12px 8px 12px;
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
        align-items: center;
        height: 32px;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, .6);
        }

        &--active {
          cursor: not-allowed;
        }

        &:not(:first-child) {
          border-top: 1px solid #3F4546;
        }

        &-label {
          margin: 0 8px 0 12px;

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
          line-height: 20px;
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
}
</style>