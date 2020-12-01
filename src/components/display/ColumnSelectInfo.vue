<template>
  <div class="filter-block">
    <spinner 
      v-if="isLoading"
      :title="$t('editing.loading')"
      size="30"
    />
    <template v-else>
      <search-block
        v-model="searchedColumn"
        :placeholder="$t('dataFrameAdvanceSetting.searchColumn')"
        class="filter-block__search-box"
      />
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
          {{ column.aliasList.length > 0 ? column.aliasList[0] : column.name }}
        </label>
      </div>
      <div class="filter-block__button-block">
        <button 
          type="button"
          class="btn-m btn-outline"
          @click="editFeature"
        >{{ $t('button.featureManagement') }}</button>
      </div>
      <edit-feature-dialog
        v-if="showEditFeatureDialog"
        :edit-feature-info="editFeatureInfo"
        @update="updateTempColumnList"
        @cancel="closeEditDialog"
      />
    </template>
  </div>
</template>

<script>
import SearchBlock from '@/components/SearchBlock'
import EditFeatureDialog from '@/pages/dataManagement/components/feature/EditFeatureDialog'

export default {
  name: 'ColumnSelectInfo',
  components: {
    SearchBlock,
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
  methods: {
    toggleAllColumns (isTargetSelectAll) {
      const searchedColumn = this.searchedColumn.toLowerCase()
      const updatedTempColumnList = this.tempColumnList.map(column => {
        const columnName = column.name.toLowerCase()
        return ({
          ...column,
          ...(columnName.includes(searchedColumn) && { isSelected: isTargetSelectAll })
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
  &__search-box {
    width: 100%;
    margin-bottom: 12px;
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
    margin: auto 0 0 0;
    .btn-m {
      width: 100%;
      height: 28px;
    }
  }

}
</style>