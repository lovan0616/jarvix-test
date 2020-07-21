<template>
  <div class="filter-block">
    <div class="filter-block__title">
      <svg-icon 
        icon-class="column" 
        class="filter-block__title-icon" />
      {{ $t('dataFrameAdvanceSetting.columnList') + '(' + columnListSelectedStatus + ')' }}
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
          class="link filter-block__action-box-link"
          @click="toggleAllColumns(true)"
        >{{ $t('dataFrameAdvanceSetting.selectAll') }}</a>
        <a 
          href="javascript:void(0);" 
          class="link filter-block__action-box-link"
          @click="toggleAllColumns(false)"
        >{{ $t('dataFrameAdvanceSetting.cancelSelect') }}</a>
      </div>
      <div class="filter-block__select-box">
        <label
          v-for="column in tempColumnList"
          v-show="!searchedColumn || (searchedColumn && isShowColumn(column))"
          :key="column.id"
          class="single-select"
        >
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
      <div class="filter-block__button-block">
        <button 
          type="button"
          class="btn-m btn-outline"
          @click="editFeature"
        >{{ $t('button.featureManagement') }}</button>
      </div>
    </template>
    <edit-feature-dialog
      v-if="showEditFeatureDialog"
      :edit-feature-info="editFeatureInfo"
      @update="updateTempColumnList"
      @cancel="closeEditDialog"
    />
  </div>
</template>

<script>
import EditFeatureDialog from '@/pages/dataManagement/components/feature/EditFeatureDialog'

export default {
  name: 'ColumnSelectInfo',
  components: {
    EditFeatureDialog
  },
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
      searchedColumn: '',
      showEditFeatureDialog: false,
      editFeatureInfo: null
    }
  },
  computed: {
    columnListSelectedStatus () {
      const selectedColumnList = this.tempColumnList.filter(column => column.isSelected)
      return `${selectedColumnList.length}/${this.tempColumnList.length}`
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
    },
    editFeature () {
      this.editFeatureInfo = {
        dataColumnIdList: [],
        dataFrameId: Number(this.$route.query.dataFrameId),
        dataSourceId: Number(this.$route.query.dataSourceId),
        name: null,
        description: '[]',
        operator: null
      }
      this.showEditFeatureDialog = true
    },
    closeEditDialog () {
      this.editFeatureInfo = null
      this.showEditFeatureDialog = false
    },
    updateTempColumnList (data) {
      this.$emit('columnAdded', data)
      this.closeEditDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-block {
  &__title {
    padding-bottom: 18px;
  }

  &__title-icon {
    color: #0CD1DE;
  }

  &__search-box {
    padding-bottom: 12px;
  }

  &__action-box {
    padding-bottom: 16px;
  }

  &__select-box {
    margin-bottom: 15px;
    .single-select {
      display: flex;
      align-items: center;
      cursor: pointer;

      .checkbox-square {
        border-radius: 3px;
      }

      .checkbox-group {
        margin-right: 11px;
      }
    }
  }

  &__button-block {
    .btn-m {
      width: 100%;
      height: 28px;
    }
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