<template>
  <el-collapse v-model="activeName" accordion class="column-info-block">
    <el-collapse-item name="category">
      <template slot="title">
        <div class="column-title">{{$t('askHelper.column')}}（{{$t('askHelper.type')}}: Category）</div>
        <div class="column-subtitle">
          <span class="column-lamp">
            <svg-icon icon-class="lamp"></svg-icon>
            {{$t('askHelper.description')}}:
          </span>
          {{$t('askHelper.category')}}
        </div>
      </template>
      <div class="column-name">{{$t('askHelper.columnName')}}</div>
      <div class="single-column"
        v-for="(columnInfo, index) in dataSourceColumnInfoList.category"
        :key="'category' + index"
      >{{ columnInfo ? columnInfo : '-' }}
      </div>
    </el-collapse-item>
    <el-collapse-item name="numeric">
      <template slot="title">
        <div class="column-title">{{$t('askHelper.column')}}（{{$t('askHelper.type')}}: Numeric）</div>
        <div class="column-subtitle">
          <span class="column-lamp">
            <svg-icon icon-class="lamp"></svg-icon>
            {{$t('askHelper.description')}}:
          </span>
          {{$t('askHelper.numeric')}}
        </div>
      </template>
      <div class="column-name">{{$t('askHelper.columnName')}}</div>
      <div class="single-column"
        v-for="(columnInfo, index) in dataSourceColumnInfoList.numeric"
        :key="'numeric' + index"
      >{{ columnInfo ? columnInfo : '-' }}
      </div>
    </el-collapse-item>
    <el-collapse-item name="datetime">
      <template slot="title">
        <div class="column-title">{{$t('askHelper.column')}}（{{$t('askHelper.type')}}: Datetime）</div>
        <div class="column-subtitle">
          <span class="column-lamp">
            <svg-icon icon-class="lamp"></svg-icon>
            {{$t('askHelper.description')}}:
          </span>
          {{$t('askHelper.datetime')}}
        </div>
      </template>
      <div class="column-name">{{$t('askHelper.columnName')}}</div>
      <div class="single-column"
        v-for="(columnInfo, index) in dataSourceColumnInfoList.dateTime"
        :key="'category' + index"
      >{{ columnInfo ? columnInfo : '-' }}
      </div>
    </el-collapse-item>
    <el-collapse-item name="boolean">
      <template slot="title">
        <div class="column-title">{{$t('askHelper.column')}}（{{$t('askHelper.type')}}: Boolean）</div>
        <div class="column-subtitle">
          <span class="column-lamp">
            <svg-icon icon-class="lamp"></svg-icon>
            {{$t('askHelper.description')}}:
          </span>
          {{$t('askHelper.boolean')}}
        </div>
      </template>
      <div class="column-name">{{$t('askHelper.columnName')}}</div>
      <div class="single-column"
        v-for="(columnInfo, index) in dataSourceColumnInfoList.booleanList"
        :key="'category' + index"
      >{{ columnInfo ? columnInfo : '-' }}
      </div>
    </el-collapse-item>
    <el-collapse-item name="unique">
      <template slot="title">
        <div class="column-title">{{$t('askHelper.column')}}（{{$t('askHelper.type')}}: Unique）</div>
        <div class="column-subtitle">
          <span class="column-lamp">
            <svg-icon icon-class="lamp"></svg-icon>
            {{$t('askHelper.description')}}:
          </span>
          {{$t('askHelper.unique')}}
        </div>
      </template>
      <div class="column-name">{{$t('askHelper.columnName')}}</div>
      <div class="single-column"
        v-for="(columnInfo, index) in dataSourceColumnInfoList.uniqueList"
        :key="'category' + index"
      >{{ columnInfo ? columnInfo : '-' }}
      </div>
    </el-collapse-item>
    <el-collapse-item name="value">
      <template slot="title">
        <div class="column-title">{{$t('askHelper.columnValue')}}（{{$t('askHelper.type')}}: Value）</div>
        <div class="column-subtitle">
          <span class="column-lamp">
            <svg-icon icon-class="lamp"></svg-icon>
            {{$t('askHelper.description')}}:
          </span>
          {{$t('askHelper.value')}}
        </div>
      </template>
      <div class="category-list">
        <div class="column-name">{{$t('askHelper.datavalueTitle')}}</div>
        <div class="single-column"
          v-for="(columnInfo, index) in dataSourceDataValueList"
          :key="'datavalue' + index"
        >{{ columnInfo ? columnInfo : '-' }}
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
export default {
  name: 'ColumnInfo',
  data () {
    return {
      activeName: null
    }
  },
  computed: {
    dataSourceColumnInfoList () {
      return this.$store.state.dataSource.dataSourceColumnInfoList
    },
    dataSourceDataValueList () {
      return this.$store.state.dataSource.dataSourceDataValueList
    }
  }
}
</script>
<style lang="scss" scoped>
.el-collapse.column-info-block {
  /deep/ .el-collapse-item {
    .el-collapse-item__header {
      height: unset;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      padding: 8px 18px 8px 16px;
      .el-collapse-item__arrow.el-icon-arrow-right {
        position: absolute;
        right: -4px;
        top: 50%;
        transform: translateY(-50%);
        &.is-active {
          transform: translateY(-50%) rotate(90deg);
        }
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
        line-height: 20px;
        padding: 0px 0px 5px;
      }

      .column-lamp {
        color: $theme-color-warning;
      }
    }

    .el-collapse-item__content {
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
  }
}
</style>
