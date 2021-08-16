<template>
  <div
    v-show="isShow"
    class="ask-condition"
  >
    <div class="ask-condition__item">
      <svg-icon
        icon-class="data-source"
        class="ask-condition__icon"
      />
      <span class="ask-condition__label">{{ getDataSourceName }}</span>
    </div>
    <div class="ask-condition__item">
      <svg-icon
        icon-class="table"
        class="ask-condition__icon"
      />
      <span class="ask-condition__label">{{ getDataFrameDisplayName }}</span>
    </div>
    <div
      v-show="getDataFrameName !== 'all'"
      class="ask-condition__item"
    >
      <svg-icon
        icon-class="column"
        class="ask-condition__icon"
      />
      <span class="ask-condition__label">{{ selectedColumnCount }}</span>
    </div>
    <div
      v-show="filterList.length > 0"
      class="ask-condition__item"
    >
      <svg-icon
        icon-class="filter"
        class="ask-condition__icon filter"
      />
      <span class="ask-condition__label">{{ $t('dataFrameAdvanceSetting.filterCriteria') }}({{ selectedFilterCount }})</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AskCondition',
  data () {
    return {}
  },
  computed: {
    ...mapGetters('dataSource', ['getDataSourceName', 'getDataFrameName']),
    ...mapState('dataSource', ['dataSourceId']),
    ...mapState('dataFrameAdvanceSetting', ['filterList', 'columnList']),
    isShow () {
      return this.dataSourceId !== null
    },
    getDataFrameDisplayName () {
      return this.getDataFrameName === 'all'
        ? this.$t('editing.allDataFrames')
        : this.getDataFrameName
    },
    selectedColumnCount () {
      if (!this.columnList) return this.$t('dataFrameAdvanceSetting.allColumns')
      const selectedColumnListLength = this.columnList.filter(column => column.isSelected).length
      return `${this.$t('dataFrameAdvanceSetting.dataColumns')}(${selectedColumnListLength}/${this.columnList.length})`
    },
    selectedFilterCount () {
      return this.filterList.filter(filterItem => filterItem.status).length
    }
  }
}
</script>

<style lang="scss" scoped>
.ask-condition {
  align-items: center;
  background: rgba(0, 0, 0, 0.55);
  border-bottom: 0.5px solid #232c2e;
  border-top: 0.5px solid #232c2e;
  display: flex;
  flex-basis: 100%;
  font-size: 12px;
  justify-content: flex-start;
  overflow: hidden;
  padding: 6px 24px;
  transition: height 0.3s;

  &__label {
    margin-right: 10px;
  }

  &__icon {
    color: $theme-color-primary;
    margin-right: 6px;

    &.filter {
      fill: $filter-color;
    }
  }
}
</style>
