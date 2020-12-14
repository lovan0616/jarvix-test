<template>
  <section class="filter-control">
    <svg-icon
      :icon-class="isSingleChoiceFilter ? 'adjuster' : 'filter-outline'" 
      class="filter-control__filter-icon"/>
    <div 
      v-for="(filterSet, setIndex) in filterList" 
      :key="setIndex" 
      class="filter-control__list">
      <single-filter-badge
        v-for="(filter, index) in filterSet"
        :key="index"
        :initial-filter="filter"
        :is-edit-mode="isEditMode"
        :is-single-choice-filter="isSingleChoiceFilter"
        :restrictions="restrictions(filterSet, index)"
        @updateFilter="updateFilter($event, setIndex, index)"
        @removeFilter="removeFilter(setIndex, index)"
      />
    </div>
  </section>
</template>

<script>
import SingleFilterBadge from './SingleFilterBadge'

export default {
  name: 'FilterControlPanel',
  components: {
    SingleFilterBadge
  },
  props: {
    initialFilterList: {
      type: Array,
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
    isYAxisController: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filterList: [],
      isShowSeletor: false
    }
  },
  watch: {
    initialFilterList: {
      deep: true,
      handler (updatedFilterList) {
        this.filterList = updatedFilterList
      }
    }
  },
  mounted () {
    this.filterList = JSON.parse(JSON.stringify(this.initialFilterList))
  },
  methods: {
    updateFilter (updatedFilter, filterSetIndex, filterIndex) {
      const updatedFilterSet = this.filterList[filterSetIndex].map((filter, index) => {
        return index === filterIndex ? updatedFilter : filter
      })
      this.filterList[filterSetIndex] = updatedFilterSet
      this.$emit('update:initial-filter-list', this.filterList)
      this.$emit('updateFilter', this.filterList)
    },
    removeFilter (filterSetIndex, filterIndex) {
      const updatedFilterSet = this.filterList[filterSetIndex].filter((filter, index) => index !== filterIndex)
      let updatedFilterList = []
      if (updatedFilterSet.length === 0) {
        updatedFilterList = this.filterList.filter((filterSet, index) => index !== filterSetIndex)
      } else {
        updatedFilterList = this.filterList.map((filterSet, index) => {
          if (index !== filterSetIndex) return filterSet
          return updatedFilterSet
        })
      }
      this.$emit('update:initial-filter-list', updatedFilterList)
      this.$emit('updateFilter', updatedFilterList)
    },
    restrictions (filterSet, index) {
      return filterSet
        .slice(0, index)
        .filter(filter => {
          // 相對時間有全選的情境，不需帶入限制中
          if (filter.statsType === 'RELATIVEDATETIME') return filter.dataValues.length > 0 && filter.dataValues[0] !== 'unset'
          if (
            filter.statsType === 'NUMERIC'
            || filter.statsType === 'FLOAT'
            || filter.statsType === 'DATETIME'
          ) return filter.start && filter.end
          // filter 必須有值
          if (filter.dataValues.length > 0) return true
          return false
        })
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
    },
  }
}
</script>

<style lang="scss" scoped>
.filter-control {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &__filter-icon {
    margin-right: 11px;
    margin-bottom: 16px;
  }

  &__list {
    display: flex;
    position: relative;
    margin-bottom: 16px;
    &:not(:last-of-type) {
      margin-right: 16px;
      &::after {
        position: absolute;
        content: '';
        left: calc(100% + 8px);
        background: rgba(255, 255, 255, 0.5);
        width: 1px;
        height: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    } 
  }

  /deep/ .filter {
    position: relative;
    &:not(:last-of-type) {
      margin-right: 20px;
      &::after {
        position: absolute;
        content: '';
        left: calc(100% + 5px);
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        border-right: 1px solid rgba(255, 255, 255, 0.3);
        transform: rotate(45deg);
        width: 5px;
        height: 5px;
      }
    }    
  }
}
</style>