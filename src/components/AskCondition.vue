<template>
  <div 
    class="ask-condition" >
    <div class="ask-condition__item">
      <svg-icon
        icon-class="database" 
        class="ask-condition__icon"/>
      <span class="ask-condition__label">{{ getDataSourceName }}</span>
    </div>
    <div class="ask-condition__item">
      <svg-icon
        icon-class="table" 
        class="ask-condition__icon"/>
      <span class="ask-condition__label">{{ getDataFrameDisplayName }}</span>
    </div>
    <div 
      v-show="getDataFrameName !== 'all'" 
      class="ask-condition__item">
      <svg-icon
        icon-class="column" 
        class="ask-condition__icon"/>
      <span class="ask-condition__label">{{ selectedColumnCount }}</span>
    </div>
    <div 
      v-show="filterList.length > 0" 
      class="ask-condition__item">
      <svg-icon
        icon-class="filter" 
        class="ask-condition__icon filter"/>
      <span class="ask-condition__label">{{ $t('dataFrameAdvanceSetting.filterCriteria') }}({{ filterList.length }})</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'AskCondition',
  data () {
    return {}
  },
  computed: {
    ...mapGetters('dataSource', ['getDataSourceName', 'getDataFrameName']),
    ...mapGetters('dataFrameAdvanceSetting', ['selectedColumnList']),
    ...mapState('dataSource', ['filterList', 'dataSourceId', 'dataFrameId']),
    ...mapState('dataFrameAdvanceSetting', ['columnList']),
    getDataFrameDisplayName () {
      return this.getDataFrameName === 'all'
        ? this.$t('editing.allDataFrames')
        : this.getDataFrameName
    },
    selectedColumnCount () {
      return this.columnList
        ? `${this.$t('dataFrameAdvanceSetting.dataColumns')}(${this.selectedColumnList.length}/${this.columnList.length})`
        : this.$t('dataFrameAdvanceSetting.allColumns')
    }
  }
}
</script>

<style lang="scss" scoped>
.ask-condition {
  flex-basis: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  transition: height .3s;
  overflow: hidden;
  padding: 6px 24px;
  background: rgba(0, 0, 0, 0.55);
  border-top: 0.5px solid #232C2E;
  border-bottom: 0.5px solid #232C2E;

  &__label {
    margin-right: 10px;
  }
  &__icon {
    margin-right: 6px;
    fill: $theme-color-primary;
    &.filter {
      fill: $filter-color;
    }
  }
}
</style>