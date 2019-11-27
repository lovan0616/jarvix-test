<template>
  <div class="column-info-block">
    <div>
      <div class="column-title">{{$t('askHelper.column')}}（{{$t('askHelper.type')}}: Category）</div>
      <div class="column-subtitle">
        <span class="column-lamp">
          <svg-icon icon-class="lamp"></svg-icon>
          {{$t('askHelper.description')}}:
        </span>
        {{$t('askHelper.category')}}</div>
      <div>
        <div class="column-name">{{$t('askHelper.columnName')}}</div>
        <div class="single-column"
          v-for="(columnInfo, index) in dataSourceCloumnInfoList.category"
          :key="'category' + index"
        >{{ columnInfo ? columnInfo : '-' }}</div>
      </div>
      <div class="column-title">{{$t('askHelper.column')}}（{{$t('askHelper.type')}}: Numeric）</div>
      <div class="column-subtitle">
        <span class="column-lamp">
          <svg-icon icon-class="lamp"></svg-icon>
          {{$t('askHelper.description')}}:
        </span>
        {{$t('askHelper.numeric')}}</div>
      <div>
        <div class="column-name">{{$t('askHelper.columnName')}}</div>
        <div class="single-column"
          v-for="(columnInfo, index) in dataSourceCloumnInfoList.numeric"
          :key="'numeric' + index"
        >{{ columnInfo ? columnInfo : '-' }}</div>
      </div>
    </div>
    <div class="column-title">{{$t('askHelper.columnValue')}}（{{$t('askHelper.type')}}: Value）</div>
    <div class="column-subtitle">
      <span class="column-lamp">
        <svg-icon icon-class="lamp"></svg-icon>
        {{$t('askHelper.description')}}:
      </span>
      {{$t('askHelper.value')}}</div>
    <div class="category-list">
      <div class="column-name">{{$t('askHelper.datavalueTitle')}}</div>
      <div class="single-column"
        v-for="(columnInfo, index) in dataSourceDataValueList"
        :key="'datavalue' + index"
      >{{ columnInfo ? columnInfo : '-' }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ColumnInfo',
  computed: {
    dataSourceCloumnInfoList () {
      return this.$store.state.dataSource.dataSourceCloumnInfoList
    },
    dataSourceDataValueList () {
      return this.$store.state.dataSource.dataSourceDataValueList
    }
  }
}
</script>
<style lang="scss" scoped>
.column-info-block {
  .category-title {
    font-size: 14px;
    line-height: 32px;
    padding: 4px 16px;
  }

  .column-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 32px;

    &:not(:first-child) {
      padding: 28px 0px 0px;
    }
  }

  .column-subtitle {
    font-size: 12px;
    line-height: 32px;
    padding: 0px 0px 5px;
  }

  .column-lamp {
    color: #FFDF6F;
  }

  .column-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 32px;
    padding: 4px 16px;
    background: #2B4D51;
  }

  .category-list {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  .single-column {
    font-size: 14px;
    line-height: 32px;
    padding: 4px 16px;

    &:nth-child(odd) {
      background-color: rgba(50, 75, 78, 0.6);
    }
  }
}
</style>
