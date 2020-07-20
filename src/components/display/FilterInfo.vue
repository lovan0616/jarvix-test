<template>
  <div class="filter-block">
    <div 
      :class="[tempFilterList.length > 0 ? 'filter-block__title--small' : 'filter-block__title--large']"
      class="filter-block__title"
    >
      <svg-icon 
        icon-class="filter" 
        class="filter-block__title-icon" />
      {{ $t('dataFrameAdvanceSetting.filterCriteria') + '(' + tempFilterList.length + ')' }}
    </div>
    <div 
      v-if="tempFilterList.length > 0" 
      class="filter-block__action-box"
    >
      <a 
        href="javascript:void(0);" 
        class="link filter-block__action-box-link"
        @click="onClearAll"
      >{{ $t('dataFrameAdvanceSetting.clearCriteria') }}</a>
    </div>
    <div class="filter-block__select-box">
      <div 
        v-if="tempFilterList.length === 0" 
        class="empty-message">
        {{ $t('dataFrameAdvanceSetting.noCriteriaYet') }}
      </div>
      <single-filter-block
        v-for="(filter, index) in tempFilterList"
        v-else
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
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'FilterInfo',
  components: {
    SingleFilterBlock,
    EmptyInfoBlock
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
    &--small {
      padding-bottom: 8px;
    }

    &--large {
      padding-bottom: 18px;
    }
  }

  &__title-icon {
    color: #4F93FF;
  }

  &__action-box {
    padding-bottom: 8px;
  }

  &__select-box {
    .empty-message {
      color: #AAAAAA;
      font-size: 12px;
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
