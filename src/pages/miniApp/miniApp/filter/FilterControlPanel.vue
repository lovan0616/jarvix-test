<template>
  <section class="filter-control">
    <svg-icon
      :icon-class="isSingleChoiceFilter ? 'adjuster' : 'filter-outline'" 
      class="filter-control__filter-icon"/>
    <template v-if="filterList.length > 0" >
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
          :filter-set="filterSet"
          :is-need-update.sync="filter.isNeedUpdate"
          :is-processing.sync="filter.isProcessing"
          @updateFilter="updateFilter($event, setIndex, index)"
          @removeFilter="removeFilter(setIndex, index)"
        />
      </div>
    </template>
    
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
  mounted () {
    if (this.isYAxisController || !this.isSingleChoiceFilter) return this.filterList = JSON.parse(JSON.stringify(this.initialFilterList))
    this.filterList = this.initialFilterList.map(filterSet => {
      // const isNewFilterSet = filterSet.some(filter => filter.dataValues.length === 0)
      return filterSet.map((filter, index) => ({ 
        ...filter,
        isNeedUpdate: index === 0,
        isProcessing: true
      }))
    })
  },
  methods: {
    updateFilter (updatedFilter, filterSetIndex, filterIndex) {
      // 先確認是否為該 filter set 最後一個 filter, 如果不是需要等後面都完成再一起 emit 出去更新
      const isLastFilterInSet = filterIndex === this.filterList[filterSetIndex].length - 1
      const updatedFilterSet = this.filterList[filterSetIndex].map((filter, index) => {
        return index === filterIndex ? updatedFilter : filter
      })

      updatedFilterSet[filterIndex].isNeedUpdate = false
      updatedFilterSet[filterIndex].isProcessing = false
      this.filterList[filterSetIndex] = updatedFilterSet
      this.$set(this.filterList, filterSetIndex, updatedFilterSet)
      
      if (isLastFilterInSet) {
        const updatedFilterList = this.filterList.map(filterSet => {
          return filterSet.map(filter => {
            const { isProcessing, isNeedUpdate, ...otherData } = filter
            return otherData
          })
        })
        this.$emit('updateFilter', updatedFilterList)
        return
      }
      
      // 如果不是該 set 最後一個，則觸發下一個 filter 重新取資料
      const updatedFilterList = this.filterList
      updatedFilterList[filterSetIndex][filterIndex + 1].isNeedUpdate = true
      for (let i = filterIndex + 1; i < updatedFilterList[filterSetIndex].length; i++) {
        updatedFilterList[filterSetIndex][i].isProcessing = true
      }
      this.filterList = [...updatedFilterList]
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
      this.filterList = updatedFilterList
      this.$emit('updateFilter', updatedFilterList.map(filterSet => {
        return filterSet.map(filter => {
          delete filter.isProcessing
          delete filter.isNeedUpdate
          return filter
        })
      }))
    }
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