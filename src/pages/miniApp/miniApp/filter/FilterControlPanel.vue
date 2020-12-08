<template>
  <section
    :class="{ 'editing': isEditMode }"
    class="filter-control"
  >
    <svg-icon
      :icon-class="isSingleChoiceFilter ? 'adjuster' : 'filter-outline'" 
      class="filter-control__filter-icon"/>
    <single-filter-badge
      v-for="(filter, index) in filterList"
      :key="index"
      :initial-filter="filter"
      :is-edit-mode="isEditMode"
      :is-single-choice-filter="isSingleChoiceFilter"
      @updateFilter="updateFilter($event, index)"
      @removeFilter="removeFilter(index)"
    />
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
    updateFilter (updatedFilter, filterIndex) {
      const updatedFilterList = this.filterList.map((filter, index) => {
        return index === filterIndex ? updatedFilter : filter
      })
      this.filterList = updatedFilterList
      this.$emit('update:initial-filter-list', updatedFilterList)
      this.$emit('updateFilter', updatedFilterList)
    },
    removeFilter (filterIndex) {
      const updatedFilterList = this.filterList.filter((filter, index) => index !== filterIndex)
      this.$emit('update:initial-filter-list', updatedFilterList)
      this.$emit('updateFilter', updatedFilterList)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-control {
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-right: 16px;
  display: flex;
  align-items: center;

  &__filter-icon {
    margin-right: 11px;
  }

  &.editing {
    padding: 16px 19px;
    background: #1C292B;
  }
}
</style>