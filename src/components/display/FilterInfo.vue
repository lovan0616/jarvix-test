<template>
  <div class="filter-block">
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
        @filter-edit="editFilter(index)"
        @filter-delete="deleteFilter(index)"
      />
    </div>
    <div class="filter-block__button-block">
      <button 
        type="button"
        class="btn-m btn-outline"
        @click="$emit('addRestriction')"
      ><span>
        <svg-icon icon-class="plus" />
        {{ $t('dataFrameAdvanceSetting.addFilter') }}
      </span>
      </button>
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
    editFilter(index) {
      this.$emit('editRestriction', index)
    },
    deleteFilter (index) {
      this.$emit('update:tempFilterList', this.tempFilterList.filter((filter, i) => i !== index))
    },
    onClearAll () {
      this.$emit('update:tempFilterList', [])
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-block {
  &__action-box {
    padding-bottom: 8px;
  }

  &__select-box {
    margin-bottom: 15px;
    .empty-message {
      color: #AAAAAA;
      font-size: 12px;
    }
  }

  &__button-block {
    margin: auto 0 0 0;
    .btn-m {
      width: 100%;
      height: 28px;
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
