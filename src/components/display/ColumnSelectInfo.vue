<template>
  <div class="filter-block">
    <div class="filter-block__title">
      <svg-icon 
        icon-class="column" 
        class="filter-block__title--icon" />
      {{ $t('dataFrameAdvanceSetting.columnList') }}
    </div>
    <spinner 
      v-if="isLoading"
      :title="$t('editing.loading')"
      size="30"
    />
    <template v-else>
      <div class="filter-block__search-box">
        <div class="input-group">
          <svg-icon 
            icon-class="search" 
            class="input-group__icon" />
          <input
            ref="columnSearchInput"
            v-model.trim="searchedColumn"
            :placeholder="$t('dataFrameAdvanceSetting.searchColumn')"
            :disabled="false"
            class="input input-group__field"
            autocomplete="off"
          >
        </div>
      </div>
      <div class="filter-block__action-box">
        <a 
          href="javascript:void(0);" 
          class="link filter-block__action-box--link"
          @click="toggleAllColumns(true)"
        >{{ $t('dataFrameAdvanceSetting.selectAll') }}</a>
        <a 
          href="javascript:void(0);" 
          class="link filter-block__action-box--link"
          @click="toggleAllColumns(false)"
        >{{ $t('dataFrameAdvanceSetting.cancelSelect') }}</a>
      </div>
      <div class="filter-block__select-box">
        <div
          v-for="column in tempColumnList"
          v-show="!searchedColumn || (searchedColumn && isShowColumn(column))"
          :key="column.id"
          class="filter-block__select-box--checkbox"
        >
          <label class="filter-block__select-box--checkbox-label">
            <div class="checkbox-group">
              <div class="checkbox-label">
                <input
                  v-model="column.isSelected"
                  :checked="column.isSelected"
                  type="checkbox"
                >
                <div class="checkbox-square"/>
              </div>
            </div>
            {{ column.name }}
          </label>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ColumnSelectInfo',
  props: {
    tempColumnList: {
      type: Array,
      default: () => ([])
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      searchedColumn: ''
    }
  },
  methods: {
    toggleAllColumns (isTargetSelectAll) {
      const updatedTempColumnList = this.tempColumnList.map(column => {
        return ({
          ...column,
          isSelected: isTargetSelectAll
        })
      })
      this.$emit('update:tempColumnList', updatedTempColumnList)
    },
    isShowColumn (column) {
      const columnName = column.name.toLowerCase()
      const searchedColumn = this.searchedColumn.toLowerCase()
      return columnName.includes(searchedColumn)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-block {
  &__title {
    padding-bottom: 18px;
    &--icon {
      color: #0CD1DE;
    }
  }

  &__search-box {
    padding-bottom: 12px;
  }

  &__action-box {
    padding-bottom: 16px;
  }

  .input-group {
    background: rgba(35, 61, 64, 0.6);
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 5px;

    &__icon {
      margin-right: 6px;
    }

    &__field {
      line-height: 22px;
      border-bottom: none;
        
      &::placeholder {
        color: #888888;
        font-size: 14px;
      }
    }
  }
}
</style>