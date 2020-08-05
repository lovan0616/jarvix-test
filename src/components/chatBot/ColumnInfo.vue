<template>
  <spinner
    v-if="isLoading"
    class="spinner"
  />
  <empty-info-block
    v-else-if="hasError"
    :msg="$t('message.systemIsError')"
  />
  <div 
    v-else 
    class="column-info">
    <div class="column-info__menu menu">
      <div class="menu__title">{{ $t('askHelper.columnCatalog') }}</div>
      <div class="menu__list">
        <div 
          v-for="(columnInfo, index) in columnTypeList"
          :key="index"
          :class="{'menu__item--active': index === selectedIndex}"
          class="menu__item"
          @click="selectCatelog(index)"
        >{{ columnInfo }}</div>
      </div>
    </div>
    <div class="column-info__block block">
      <div class="block__title">
        <span>{{ $t('askHelper.columnCatalog') }}: </span>
        <span>{{ columnTypeList[selectedIndex] }}</span>
      </div>
      <div class="block__description">
        <span class="column-lamp">
          <svg-icon icon-class="lamp"/>
          {{ $t('askHelper.description') }}:
        </span>
        {{ generateDescription(columnTypeList[selectedIndex]) }}
      </div>
      <table class="block__table">
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
import { mapActions } from 'vuex'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'ColumnInfo',
  components: {
    EmptyInfoBlock
  },
  data () {
    return {
      activeName: null,
      selectedIndex: 0,
      columnTypeList: [
        'Category', 'Numeric', 'DateTime', 'Boolean', 'Value'
      ],
      columnInfoList: [],
      dataSourceColumnInfoList: [],
      isLoading: true,
      hasError: false
    }
  },
  mounted () {
    this.fetchColumnInfo()
  },
  methods: {
    ...mapActions('dataSource', ['getDataSourceColumnInfo', 'getDataSourceDataValue']),
    fetchColumnInfo () {
      Promise.all([this.getDataSourceColumnInfo(false), this.getDataSourceDataValue(false)])
        .then(([columnInfo, dataValue]) => {
          this.dataSourceColumnInfoList = {...columnInfo, ...dataValue}
          this.selectCatelog(this.selectedIndex)
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
          this.hasError = true
        })
    },
    columnTypeSwitch (value) {
      switch (value) {
        case 'Category':
          return 'category'
        case 'Numeric':
          return 'numeric'
        case 'DateTime':
          return 'dateTime'
        case 'Boolean':
          return 'booleanList'
        case 'Value':
          return 'values'
      }
    },
    selectCatelog (index) {
      this.selectedIndex = index
      let key = this.columnTypeSwitch(this.columnTypeList[index])
      this.setColumnInfoList(key)
    },
    setColumnInfoList (key) {
      const tmpColumnInfoList = JSON.parse(JSON.stringify(this.dataSourceColumnInfoList))
      this.columnInfoList = tmpColumnInfoList[key]
      // Number of columns must be multiples of 3
      let emptyValue = this.columnInfoList.length % 3 ===  0 ? 0 : 3 - this.columnInfoList.length % 3
      while (emptyValue--) {
        this.columnInfoList.push('')
      }
    },
    generateDescription (category) {
      switch (category) {
        case 'Category':
          return this.$t('askHelper.category')
        case 'Numeric':
          return this.$t('askHelper.numeric')
        case 'DateTime':
          return this.$t('askHelper.datetime')
        case 'Boolean':
          return this.$t('askHelper.boolean')
        case 'Unique':
          return this.$t('askHelper.unique')
        case 'Value':
          return this.$t('askHelper.value')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.column-info {
  position: relative;
  height: 100%;
  display: flex;
  
  &__menu {
    width: 200px;
    height: 100%;
    margin-right: 20px;
  }
  
  .menu {
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

    &__list {
      height: calc(100% - 42px);
      overflow: hidden;
      border-radius: 5px;
      &:hover { overflow: auto; }
    }

    &__item {
      position: relative;
      cursor: pointer;
      padding: 4px 12px;
      font-size: 14px;
      line-height: 32px;
      color: #999999;
      background: rgba(35, 61, 64, 0.6);

      &:not(:last-of-type) {
        border-bottom: 1px solid rgba(50, 75, 78, 0.6);
      }

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
    width: calc(100% - 224px);
    margin-left: auto;
    margin-right: 0;
    padding-right: 10px;
    overflow: auto;
  }

  .block {
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
        font-size: 13px;
        color: var(--gray-100);
        padding: 10px 0;
        text-align: center;
        border: 1px solid #515959;
      }
    } 
  }
}
</style>
