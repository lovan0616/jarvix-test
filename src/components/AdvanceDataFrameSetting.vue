<template>
  <div class="setting__wrapper">
    <span 
      class="setting__close-icon" 
      @click="closeAdvanceDataFrameSetting">
      <svg-icon icon-class="close"/>
    </span>
    <el-collapse
      v-if="step === 1"
      :value="activeCollapseName"
      accordion
      @change="updateActiveCollapseName"
    >
      <el-collapse-item
        :disabled="activeCollapseName === 'column'"
        name="column"
      >
        <template slot="title">
          <div class="setting__collapse-title">
            <svg-icon 
              icon-class="column" 
              class="setting__collapse-title-icon setting__collapse-title-icon--light-blue" />
            {{ $t('dataFrameAdvanceSetting.columnList') + '(' + columnListSelectedStatus + ')' }}
          </div>
        </template>
        <column-select-info
          :temp-column-list.sync="tempColumnList"
          :is-loading="isLoading"
          class="setting__filter-block--top"
          @columnAdded="addColumnList"
        />
      </el-collapse-item>
      <el-collapse-item 
        :disabled="activeCollapseName === 'filter'"
        name="filter"
      >
        <template slot="title">
          <div class="setting__collapse-title">
            <svg-icon 
              icon-class="filter" 
              class="setting__collapse-title-icon setting__collapse-title-icon--dark-blue" />
            {{ $t('dataFrameAdvanceSetting.filterCriteria') + '(' + filterListStatus + ')' }}
            <join-logic-hints
              :hint="$t('dataFrameAdvanceSetting.ANDLogicHint')"
              icon-class="inner-join"
            />
          </div>
        </template>
        <filter-info 
          :temp-filter-list.sync="tempFilterList"
          class="setting__filter-block--bottom"
          @addRestriction="addRestriction"
          @editRestriction="editRestriction" 
        />
      </el-collapse-item>
    </el-collapse>
    <filter-restriction-setting 
      v-else-if="step === 2"
      :restriction="currentEditedFilter"
      @edit-restraint="editRestraint"
      @empty-restraint="emptyRestraint"
      @updated:restriction="updateRestriction"
      @prev="prevStep"
      @next="nextStep"
    />
    <filter-restraint-setting 
      v-else-if="step === 3"
      :restraint="currentEditedRestraint"
      @updated:restraint="updateRestraint"
      @prev="prevStep"
    />
    <div
      v-if="hasSettingChanged && step === 1"
      class="setting__button-block"
    >
      <button
        type="button"
        class="btn btn-default"
        @click="saveFilter"
      >{{ $t('button.update') }}</button>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
import { getDataFrameColumnInfoById } from '@/API/DataSource'
import ColumnSelectInfo from './display/ColumnSelectInfo'
import FilterInfo from './display/FilterInfo'
import FilterRestrictionSetting from './setting/FilterRestrictionSetting'
import FilterRestraintSetting from './setting/FilterRestraintSetting'
import JoinLogicHints from './setting/JoinLogicHints'

export default {
  name: 'AdvanceDataFrameSetting',
  components: {
    FilterInfo,
    ColumnSelectInfo,
    Message,
    FilterRestrictionSetting,
    FilterRestraintSetting,
    JoinLogicHints
  },
  data () {
    return {
      step: 1,
      isLoading: true,
      tempColumnList: [],
      tempFilterList: [],
      currentEditedFilter: [],
      currentEditedRestraint: [],
      currentEditedFilterIndex: null,
      currentEditedRestraintIndex: null
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['columnList', 'isInit', 'displaySection']),
    ...mapState('dataSource', ['filterList', 'shouldAdvanceDataFrameSettingRefetchDataColumn']),
    hasSettingChanged () {
      const isColumnListUntouched = this.tempColumnList.every(tempColumn => {
        if (this.columnList === null) return true
        const storedColumn = this.columnList.find(column => column.id === tempColumn.id)
        return storedColumn.isSelected === tempColumn.isSelected
      })
      // 處理當清除所有條件時 tempFilterList 會是空陣列：比較長度
      const isFilterListLengthUntouched = this.tempFilterList.length === this.filterList.length
      const isFilterListConditionUntouched = this.tempFilterList.every((tempFilter, index) => {
        return tempFilter.status === this.filterList[index].status
      })
      return !isColumnListUntouched || !isFilterListLengthUntouched || !isFilterListConditionUntouched
    },
    columnListSelectedStatus () {
      const selectedColumnList = this.tempColumnList.filter(column => column.isSelected)
      return `${selectedColumnList.length}/${this.tempColumnList.length}`
    },
    activeCollapseName () {
      return this.displaySection
    },
    filterListStatus () {
      return this.tempFilterList.filter(filter => filter.status).length
    }
  },
  watch: {
    columnList (newList = [], oldList) {
      this.tempColumnList = JSON.parse(JSON.stringify(newList))
    },
    filterList (newList, oldList) {
      this.tempFilterList = JSON.parse(JSON.stringify(newList))
    },
    '$route.query.dataFrameId'(newValue, oldValue) {
      if (!newValue || !oldValue|| Number(newValue) === Number(oldValue)) return
      this.closeAdvanceDataFrameSetting()
    },
    shouldAdvanceDataFrameSettingRefetchDataColumn: {
      handler (value) {
        if (!value) return
        this.toggleIsInit(false)
        const { dataFrameId } = this.$route.query
        this.fetchDataColumns(dataFrameId, this.columnList)
      },
      immediate: true
    }
  },
  mounted () {
    const { dataFrameId } = this.$route.query
    this.fetchDataColumns(dataFrameId, this.shouldAdvanceDataFrameSettingRefetchDataColumn ? this.columnList : [])
    this.tempFilterList = JSON.parse(JSON.stringify(this.filterList))
  },
  destroyed () {
    this.setDisplaySection('column')
  },
  methods: {
    ...mapActions('dataSource', ['updateFilterList']),
    ...mapActions('dataFrameAdvanceSetting', ['clearColumnList']),
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox', 'setColumnList', 'toggleIsInit', 'setDisplaySection']),
    fetchDataColumns (dataFrameId, existingColumnList = []) {
      this.isLoading = true
      
      // fetch existing list from store
      if (this.isInit) {
        this.tempColumnList = JSON.parse(JSON.stringify(this.columnList))
        this.isLoading = false
        return
      }

      // fetch column list from backend
      getDataFrameColumnInfoById(dataFrameId)
        .then(data => {
          const formatedColumnList = data.map(newColumn => {
            const existingColumn = existingColumnList.find(oldColumn => oldColumn.id === newColumn.id)
            return {
              ...newColumn,
              isSelected: existingColumn ? existingColumn.isSelected : true
            }
          })
          this.setColumnList(formatedColumnList)
          this.toggleIsInit(true)
          this.isLoading = false
          this.$store.commit('dataSource/setShouldAdvanceDataFrameSettingRefetchDataColumn', false)
        })
        .catch(error => this.isLoading = false)
    },
    closeAdvanceDataFrameSetting () {
      this.toggleSettingBox(false)
    },
    saveFilter () {
      this.setColumnList(this.tempColumnList)
      this.updateFilterList(this.tempFilterList)
      Message({
        message: this.$t('message.addFilter'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
    },
    addColumnList ({ dataFrameId: updatedDataFrameId }) {
      // 如果使用者在其他表新增自定義欄位則不更新當前表的 column list
      const { dataFrameId: queryDataFrameId } = this.$route.query
      if (Number(queryDataFrameId) !== updatedDataFrameId) return
      this.toggleIsInit(false)
      this.fetchDataColumns(updatedDataFrameId, this.columnList)
    },
    updateActiveCollapseName (section) {
      if (!section) return
      this.setDisplaySection(section)
    },
    prevStep () {
      this.step -= 1
    },
    nextStep () {
      this.step += 1
    },
    editRestriction (index) {
      this.currentEditedFilterIndex = index
      this.currentEditedFilter = this.tempFilterList[index].restriction
      this.nextStep()
    },
    editRestraint (index) {
      this.currentEditedRestraintIndex = index
      this.currentEditedRestraint = this.currentEditedFilter[index]
      this.nextStep()
    },
    emptyRestraint () {
      this.tempFilterList.splice(this.currentEditedFilterIndex, 1)
      this.currentEditedFilterIndex = null
      this.currentEditedFilter = []
      this.prevStep()
      this.saveFilter()
    },
    addRestriction () {
      this.currentEditedFilterIndex = this.tempFilterList.length
      this.currentEditedFilter = []
      this.nextStep()
    },
    updateRestriction (updatedRestriction) {
      this.tempFilterList[this.currentEditedFilterIndex].restriction = JSON.parse(JSON.stringify(updatedRestriction))
      this.currentEditedFilter = JSON.parse(JSON.stringify(updatedRestriction))
      this.saveFilter()
    },
    updateRestraint (updatedRestraint) {
      this.currentEditedFilter[this.currentEditedRestraintIndex] = JSON.parse(JSON.stringify(updatedRestraint))
      this.currentEditedRestraint = JSON.parse(JSON.stringify(updatedRestraint))
      if(this.currentEditedFilterIndex > this.tempFilterList.length - 1) {
        // 表示為新加入的 restriction
        let newRestriction = {
          status: true,
          restriction: this.currentEditedFilter,
          questionId: this.currentQuestionId
        }
        this.tempFilterList.push(newRestriction)
      } else {
        this.tempFilterList[this.currentEditedFilterIndex].restriction = JSON.parse(JSON.stringify(this.currentEditedFilter))
      }
      this.saveFilter()
      this.prevStep()
    }
  },
}
</script>

<style lang="scss" scoped>
.setting__wrapper {
  position: absolute;
  top: $header-height + $chat-room-height;
  left: 0;
  height: calc(100vh - #{$header-height + $chat-room-height});
  width: $basic-df-setting-width;
  display: flex;
  flex-direction: column;
  // 調整限制調整欄位選單的時候註解掉的，沒看出來當初的用途
  // overflow: hidden;
  background-color: rgba(0, 0, 0, 0.55);
  border: 1px solid #2B3638;

  .setting {
    &__close-icon {
      position: absolute;
      top: 16px;
      right: 24px;
      z-index: 1;
      color: #0CD1DE;
      font-size: 12px;
      cursor: pointer;
    }

    &__collapse-title {
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      /deep/ .join-logic-hints__icon {
        margin-left: 8px;
      }
    }

    &__collapse-title-icon {
      margin-right: 6px;

      &--light-blue {
        color: #0CD1DE;
      }

      &--dark-blue {
        color: #4F93FF;
      }
    }

    &__filter-block {
      &--top {
        flex: 6 6 400px;
      }
      
      &--bottom {
        flex: 4 4 250px;
      }
    }

    &__button-block {
      padding: 12px 24px;
      height: 60px;
      background: rgba(0, 0, 0, .55);
      .btn {
        width: 100%;
      }
    }
  }

  /deep/ .filter-block {
    overflow: hidden;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    height: 100%;

    &__action-box-link {
      font-weight: 600;
      &:not(:last-of-type) {
        margin-right: 8px;
      }
    }

    &__select-box {
      overflow: auto;
      .single-select {
        margin-bottom: 8px;
      }
    }
  }

  /deep/ .el-collapse {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    border-top: none;
    border-bottom: none;
    overflow: hidden;
  }

  /deep/ .el-collapse-item {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #464A50;
    overflow: hidden;
    transition: flex 0.3s ease-out;

    &+.el-collapse-item {
      margin-top: 0;
    }

    &.is-disabled {
      .el-collapse-item__header {
        color: #ffffff;
        background: rgba(0, 0, 0, .55);
      }
    }

    &.is-active {
      flex: 1 1 48px;
    }

    &__wrap {
      flex: 1 1 auto;
      padding: 0;
      border-radius: 0;
      border-bottom: none;
      background: rgba(0, 0, 0, .55);
    }

    &__header {
      opacity: .5;
      cursor: pointer;
      border-radius: 0;
      border-bottom: none;
      background: rgba(0, 0, 0, .55);

      &:hover {
        opacity: .7;
      }

      &.is-active {
        opacity: 1;
        border-radius: 0;
      }
    }

    &__content {
      padding-bottom: 0;
      height: 100%;
    }

    &__arrow {
      display: none;
    }
  } 
}
</style>