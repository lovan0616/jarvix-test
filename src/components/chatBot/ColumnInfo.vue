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
    class="column-info"
  >
    <div class="column-info__menu menu">
      <div class="menu__title">
        {{ $t('askHelper.columnCatalog') }}
      </div>
      <div class="menu__list">
        <div
          v-for="(columnInfo, index) in columnTypeList"
          :key="index"
          :class="{'menu__item--active': index === selectedIndex}"
          class="menu__item"
          @click="selectCatelog(index)"
        >
          {{ columnInfo }}
        </div>
      </div>
    </div>
    <div class="column-info__block block">
      <div class="block__title">
        <span>{{ $t('askHelper.columnCatalog') }}: </span>
        <span>{{ columnTypeList[selectedIndex] }}</span>
      </div>
      <div class="block__description">
        <span class="column-lamp">
          <svg-icon icon-class="lamp" />
          {{ $t('askHelper.description') }}:
        </span>
        {{ generateDescription(columnTypeList[selectedIndex]) }}
      </div>
      <table class="block__table">
        <tr>
          <th
            class="column-name"
            colspan="3"
          >
            {{ $t('askHelper.columnName') }}
          </th>
        </tr>
        <template
          v-if="columnInfoList.length > 0"
        >
          <tr
            v-for="row in columnInfoList.length / 3"
            :key="'row' + row"
            class="column-content"
          >
            <td
              v-for="column in 3"
              :key="'column' + column"
              class="single-column"
            >
              {{ columnInfoList[(row-1)*3+column-1] ? columnInfoList[(row-1)*3+column-1] : '-' }}
            </td>
          </tr>
        </template>
        <tr v-else>
          <td class="empty-column">
            {{ $t('askHelper.emptyColumn') }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters('dataFrameAdvanceSetting', ['askCondition'])
  },
  watch: {
    askCondition: {
      deep: true,
      handler (newValue, oldValue) {
        if (
          this.mode === 'popup' ||
          // 初次開啟設定時不觸發
          (oldValue.isInit === false && oldValue.columnList === null) ||
          // 切換 dataframe 清空設定時不觸發
          newValue.isInit === false
        ) return
        this.fetchColumnInfo()
      }
    }
  },
  mounted () {
    this.fetchColumnInfo()
  },
  methods: {
    ...mapActions('dataSource', ['getDataSourceColumnInfo', 'getDataSourceDataValue']),
    fetchColumnInfo () {
      Promise.all([this.getDataSourceColumnInfo({ shouldStore: false }), this.getDataSourceDataValue({ shouldStore: false })])
        .then(([columnInfo, dataValue]) => {
          this.dataSourceColumnInfoList = { ...columnInfo, ...dataValue }
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
      let emptyValue = this.columnInfoList.length % 3 === 0 ? 0 : 3 - this.columnInfoList.length % 3
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
  display: flex;
  height: 100%;
  position: relative;

  &__menu {
    height: 100%;
    margin-right: 20px;
    width: 200px;
  }

  .menu {
    &__title {
      background: #2b4a4e;
      border-radius: 5px 5px 0 0;
      font-size: 16px;
      height: 42px;
      line-height: 200%;
      padding: 5px 24px;

      &::before {
        background: #4de2f0;
        content: '';
        height: 6px;
        left: 12px;
        position: absolute;
        top: 18px;
        width: 4px;
      }
    }

    &__list {
      border-radius: 5px;
      height: calc(100% - 42px);
      overflow: hidden;
      &:hover { overflow: auto; }
    }

    &__item {
      background: rgba(35, 61, 64, 0.6);
      color: #999;
      cursor: pointer;
      font-size: 14px;
      line-height: 32px;
      padding: 4px 12px;
      position: relative;

      &:not(:last-of-type) {
        border-bottom: 1px solid rgba(50, 75, 78, 0.6);
      }

      &:last-child {
        border-radius: 5px;
      }

      &:hover,
      &.active,
      &--active {
        background-color: rgba(50, 75, 78, 0.6);
        color: #fff;

        &::after {
          border: 4px solid transparent;
          border-left-color: #fff;
          content: '';
          display: block;
          height: 0;
          position: absolute;
          right: 12px;
          top: calc(50% - 4px);
          width: 0;
        }
      }
    }
  }

  &__block {
    margin-left: auto;
    margin-right: 0;
    overflow: auto;
    padding-right: 10px;
    width: calc(100% - 224px);
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
      border: 1px solid #515959;
      border-collapse: collapse;
      width: 100%;

      .column-name {
        background: #2b4d51;
        border: 1px solid #515959;
        font-size: 14px;
        font-weight: 600;
        line-height: 32px;
        padding: 4px 16px;
        text-align: left;
      }

      .column-content {
        .single-column {
          background: rgba(50, 75, 78, 0.6);
          border: 1px solid #515959;
          color: #ddd;
          font-size: 14px;
          height: 34px;
          line-height: 32px;
          padding-left: 12px;
          width: 33.33%;
          word-break: break-all;
        }
      }

      .empty-column {
        border: 1px solid #515959;
        color: var(--gray-100);
        font-size: 13px;
        padding: 10px 0;
        text-align: center;
      }
    }
  }
}
</style>
