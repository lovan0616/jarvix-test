<template>
  <div class="column-info">
    <div class="column-info__menu">
      <div class="column-info__menu__title">{{ $t('askHelper.columnCatalog') }}</div>
      <div 
        v-for="(columnInfo, index) in columnTypeList"
        :key="index"
        :class="{'column-info__menu__item--active': index === selectedIndex}"
        class="column-info__menu__item"
        @click="selectCatelog(index)"
      >{{ columnInfo }}</div>
    </div>
    <div class="column-info__block">
      <div class="column-info__block__title">
        <span>{{ $t('askHelper.catalog') }}: </span>
        <span>{{ columnTypeList[selectedIndex] }}</span>
      </div>
      <div class="column-info__block__description">
        <span class="column-lamp">
          <svg-icon icon-class="lamp"/>
          {{ $t('askHelper.description') }}:
        </span>
        {{ $t('askHelper.category') }}
      </div>
      <table class="column-info__block__table">
        <tr>
          <th 
            class="column-name" 
            colspan="3">{{ $t('askHelper.columnName') }}</th>
        </tr>
        <template
          v-if="columnInfoList.length > 0">
          <tr 
            v-for="row in columnInfoList.length / 3"
            :key="'row' + row"
            class="column-content">
            <td 
              v-for="column in 3"
              :key="'column' + column"
              class="single-column">
              {{ columnInfoList[(row-1)*3+column-1] ? columnInfoList[(row-1)*3+column-1] : '-' }}
            </td>
          </tr>
        </template>
        <tr v-else>
          <td class="empty-column">{{ $t('askHelper.emptyColumn') }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ColumnInfo',
  data () {
    return {
      activeName: null,
      selectedIndex: 0,
      columnTypeList: [
        'Category', 'Numeric', 'DateTime', 'Boolean', 'Unique', 'Value'
      ],
      columnInfoList: []
    }
  },
  computed: {
    dataSourceColumnInfoList () {
      return this.$store.state.dataSource.dataSourceColumnInfoList
    },
    dataSourceDataValueList () {
      return this.$store.state.dataSource.dataSourceDataValueList
    }
  },
  mounted () {
    this.selectCatelog(this.selectedIndex)
  },
  methods: {
    selectCatelog (index) {
      this.selectedIndex = index
      let key = this.columnTypeList[index].charAt(0).toLowerCase() + this.columnTypeList[index].slice(1)
      key = key === 'unique' ? 'uniqueList' : key
      key = key === 'boolean' ? 'booleanList' : key
      this.setColumnInfoList(key)
    },
    setColumnInfoList (key) {
      this.tmpColumnInfoList = JSON.parse(JSON.stringify(this.dataSourceColumnInfoList))
      this.tmpColumnInfoList['value'] = this.dataSourceDataValueList
      this.columnInfoList = this.tmpColumnInfoList[key]
      let emptyValue = this.columnInfoList.length % 3 ===  0 ? 0 : 3 - this.columnInfoList.length % 3
      while (emptyValue--) {
        this.columnInfoList.push('')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.column-info {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  
  &__menu {
    width: 200px;
    border-radius: 5px;
    margin-right: 24px;
    background: rgba(35, 61, 64, 0.6);
    
    &__title {
      height: 42px;
      padding: 5px 24px;
      border-radius: 5px 5px 0px 0px;
      font-size: 16px;
      line-height: 200%;
      background: #2B4A4E;

      &::before {
        position: absolute;
        top: 18px;
        left: 12px;
        content: "";
        width: 4px;
        height: 6px;
        background: #4DE2F0;
      }
    }

    &__item {
      position: relative;
      cursor: pointer;
      padding: 4px 12px;
      font-size: 14px;
      line-height: 32px;
      color: #999999;
      border-bottom: 1px solid rgba(50, 75, 78, 0.6);

      &:last-child {
        border-radius: 5px;
      }

      &:hover, &.active, &--active{
        background-color: rgba(50, 75, 78, 0.6);;
        color: #fff;

        &:after {
          position: absolute;
          right: 12px;
          top: calc(50% - 4px);
          content: "";
          display: block;
          width: 0;
          height: 0;
          border: 4px solid transparent;
          border-left-color: #fff;
        }
      }
    }
  }

  &__block {
    flex: 1;
    padding-right: 10px;
    
    &__title {
      font-size: 18px;
      line-height: 32px;
    }

    &__description {
      font-size: 12px;
      line-height: 32px;
      margin-bottom: 8px;
      word-break: keep-all;

      .column-lamp {
        color: $theme-color-warning;
      }
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #515959;

      .column-name {
        font-weight: 600;
        font-size: 14px;
        line-height: 32px;
        text-align: left;
        padding: 4px 16px;
        background: #2B4D51;
        border: 1px solid #515959;
      }

      .column-content {

        .single-column {
          width: 33.33%;
          height: 34px;
          font-size: 14px;
          line-height: 32px;
          padding-left: 12px;
          color: #DDD;
          background: rgba(50, 75, 78, 0.6);
          border: 1px solid #515959;
          word-break: break-all;
        }
      }

      .empty-column {
        color: var(--gray-100);
        padding: 10px 0;
        text-align: center;
        border: 1px solid #515959;
      }
    } 
  }
}
</style>
