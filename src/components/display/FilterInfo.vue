<template>
  <div class="filter-block">
    <div class="filter-block__title">
      <svg-icon 
        icon-class="filter" 
        class="filter-block__title--icon" />
      {{ $t('dataFrameAdvanceSetting.filterCriteria') + '(' + tempFilterList.length + ')' }}
    </div>
    <div 
      v-if="tempFilterList.length > 0" 
      class="filter-block__action-box"
    >
      <a 
        href="javascript:void(0);" 
        class="link filter-block__action-box--link"
        @click="onClearAll"
      >{{ $t('dataFrameAdvanceSetting.clearCriteria') }}</a>
    </div>
    <div class="filter-block__select-box">
      <single-filter-block
        v-for="(filter, index) in tempFilterList"
        :key="index"
        :restriction="filter.restriction"
        :status="filter.status"
        @status-change="onFilterStatusChange(index, $event)"
      />
    </div>
  </div>
</template>
<script>
import SingleFilterBlock from './SingleFilterBlock'

export default {
  name: 'FilterInfo',
  components: {
    SingleFilterBlock
  },
  props: {
    tempFilterList: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    onFilterStatusChange (index, updated) {
      const updatedTempFilterList = this.tempFilterList.map((filter, i) => {
        if (updated) {
          if (index >= i) return { ...filter, status: true }
          else return filter
        } else {
          if (index <= i) return { ...filter, status: false }
          else return filter
        }
      })
      this.$emit('update:tempFilterList', updatedTempFilterList)
    },
    onClearAll () {
      this.$emit('update:tempFilterList', [])
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-block {
  &__title {
    &--icon {
      color: #4F93FF;
    }
  }

  /deep/ .single-filter-block {
    &:last-of-type {
      .single-filter-block {
        &__description {
          &:before {
           display: none;
          }
        }
      }
    }
  }
}
</style>
