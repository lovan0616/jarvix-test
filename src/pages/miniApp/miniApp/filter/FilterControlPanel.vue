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
          :is-filter-list-need-update.sync="isFilterListNeedUpdate"
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
      filterSetInitList: {},
      isShowSeletor: false,
      isFilterListNeedUpdate: false,
      hasFilterSetNeedInit: false
    }
  },
  mounted () {
    if (this.isYAxisController || !this.isSingleChoiceFilter) return this.filterList = JSON.parse(JSON.stringify(this.initialFilterList))
    // 控制項有階層，且創立完後需要給定預設值，所以須額外處理
    this.filterList = this.initialFilterList.map((filterSet, setIndex) => {
      // 確認當前組是否剛被創出來，需要給 filter 預設值
      this.filterSetInitList[`${setIndex}`] = filterSet.some(filter => filter.dataValues.length > 0)
      return filterSet.map((filter, index) => ({ 
        ...filter,
        // 階層情況下，filter 需戴上前面所有 filter 的 restriction，因此由左至右每次只處理一個 filter 
        isNeedUpdate: index === 0 && filter.dataValues.length === 0,
        // 給定處理狀態，如果有 filter 在處理中，其以後的 filter 都需押處理中
        isProcessing: true
      }))
    })
    // 如果有剛創完的控制項須給定預設值時，代表設定完成後，filtet list 需傳出去更新
    this.isFilterListNeedUpdate = !Object.keys(this.filterSetInitList).every(filterSet => this.filterSetInitList[filterSet])
    // 如果有需要初始化的控制項，需在完成後告知外層，Dashboard 初始化狀態才會改變，讓 task 展開問問題流程
    this.hasFilterSetNeedInit = this.isFilterListNeedUpdate
  },
  methods: {
    updateFilter (updatedFilter, filterSetIndex, filterIndex) {
      // 可能遇到階層，所以需要先確認當前更新的 filter 是否為該組最後一個
      const isLastFilterInSet = filterIndex === this.filterList[filterSetIndex].length - 1

      // 更新 filter 中的狀態，並存到隸屬的組中
      let updatedFilterSet = this.filterList[filterSetIndex].map((filter, index) => {
        if (index < filterIndex) return filter
        if (index === filterIndex) return { 
          ...updatedFilter, 
          isNeedUpdate: false, 
          isProcessing: false
        }
        // 如果當前更新的 filter 不是該組最後一個時，繼續觸發下一個 filter 帶上最新 reestriction 重新取資料
        return {
          ...filter, 
          isNeedUpdate: index - filterIndex === 1, 
          isProcessing: true
        }
      })
      
      // 更新 filter 清單資料
      this.$set(this.filterList, filterSetIndex, updatedFilterSet)

      // 只有當前更新的 filter 為該組最後一個時，才考慮將更新後的 filter list 全部傳出去更新
      if (isLastFilterInSet) {
        if (this.isFilterListNeedUpdate) {
          const updatedFilterList = this.filterList.map(filterSet => {
            // 把只在這層使用的暫用資料刪除
            return filterSet.map(filter => {
              filter.isNeedInit = false
              const { isProcessing, isNeedUpdate, isNeedInit, ...otherData } = filter
              return otherData
            })
          })
          this.isFilterListNeedUpdate = false
          this.$emit('updateFilter', updatedFilterList)
          if (this.hasFilterSetNeedInit) {
            this.hasFilterSetNeedInit = false
            this.$emit('updateInit', true)
          }
          return
        }
      }
    },
    removeFilter (filterSetIndex, filterIndex) {
      // 可能遇到階層，所以需要先確認刪掉的選項是否為最後一個
      const isLastFilterInSet = filterIndex === this.filterList[filterSetIndex].length - 1

      // 找到要更新的組合
      const updatedFilterSet = this.filterList[filterSetIndex].filter((filter, index) => index !== filterIndex)
      let updatedFilterList = [...this.filterList]

      // 如果不是該組最後一個，則觸發下一個 filter 帶新的 restriction 去重新取資料
      if (!isLastFilterInSet) {
        updatedFilterList[filterSetIndex][filterIndex + 1].isNeedUpdate = true
        // 先把後面所有 filter 狀態更改成處理中
        for (let i = filterIndex + 1; i < updatedFilterList[filterSetIndex].length; i++) {
          updatedFilterList[filterSetIndex][i].isProcessing = true
        }
      }
      
      // 如果該組已經為空，則從清單中刪除該組，否則將更新完的組資料更新到清單中
      if (updatedFilterSet.length === 0) {
        updatedFilterList = this.filterList.filter((filterSet, index) => index !== filterSetIndex)
      } else {
        updatedFilterList = this.filterList.map((filterSet, index) => {
          if (index !== filterSetIndex) return filterSet
          return updatedFilterSet
        })
      }

      // 更新清單
      this.filterList = [...updatedFilterList]
      
      // 把所有 filter 資料更新到外層
      this.$emit('updateFilter', updatedFilterList.map(filterSet => {
        return filterSet.map(filter => {
          // 把只在這層使用的暫用資料刪除
          const { isProcessing, isNeedUpdate, isNeedInit, ...otherData } = filter
          return otherData
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