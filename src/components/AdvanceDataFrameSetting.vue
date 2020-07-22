<template>
  <div class="setting__wrapper">
    <span 
      class="setting__close-icon" 
      @click="closeAdvanceDataFrameSetting">
      <svg-icon icon-class="close"/>
    </span>
    <column-select-info
      :temp-column-list.sync="tempColumnList"
      :is-loading="isLoading"
      class="setting__filter-block--top"
      @columnAdded="addColumnList"
    />
    <filter-info 
      :temp-filter-list.sync="tempFilterList"
      class="setting__filter-block--bottom" 
    />
    <div
      v-if="hasSettingChanged"
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

export default {
  name: 'AdvanceDataFrameSetting',
  components: {
    FilterInfo,
    ColumnSelectInfo,
    Message
  },
  data () {
    return {
      isLoading: true,
      tempColumnList: [],
      tempFilterList: []
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['columnList', 'isInit']),
    ...mapState('dataSource', ['filterList']),
    hasSettingChanged () {
      const isColumnListUntouched = this.tempColumnList.every(tempColumn => {
        const storedColumn = this.columnList.find(column => column.id === tempColumn.id)
        return storedColumn.isSelected === tempColumn.isSelected
      })
      const isFilterListLengthUntouched = this.tempFilterList.length === this.filterList.length
      const isFilterListConditionUntouched = this.tempFilterList.every((tempFilter, index) => {
        return tempFilter.status === this.filterList[index].status
      })
      return !isColumnListUntouched || !isFilterListLengthUntouched || !isFilterListConditionUntouched
    }
  },
  watch: {
    columnList (newList = [], oldList) {
      this.tempColumnList = JSON.parse(JSON.stringify(newList))
    },
    filterList (newList, oldList) {
      this.tempFilterList = JSON.parse(JSON.stringify(newList))
    },
    '$route.query.dataFrameId'(value) {
      if (!value || value === 'all') return this.closeAdvanceDataFrameSetting()
      this.fetchDataColumns(value)
    },
  },
  mounted () {
    const { dataFrameId } = this.$route.query
    this.fetchDataColumns(dataFrameId)
    this.tempFilterList = JSON.parse(JSON.stringify(this.filterList))
  },
  methods: {
    ...mapActions('dataSource', ['updateFilterList']),
    ...mapActions('dataFrameAdvanceSetting', ['clearColumnList']),
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox', 'setColumnList', 'toggleIsInit']),
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
        })
        .catch(error => this.isLoading = false)
    },
    closeAdvanceDataFrameSetting () {
      this.toggleSettingBox(false)
    },
    saveFilter () {
      this.setColumnList(this.tempColumnList)
      const updatedFilterList = this.tempFilterList.filter(filter => filter.status)
      this.updateFilterList(updatedFilterList)
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
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.55);;
  border: 1px solid #2B3638;

  .setting {
    &__close-icon {
      position: absolute;
      top: 18px;
      right: 24px;
      color: #0CD1DE;
      cursor: pointer;
    }

    &__filter-block {
      &--top {
        flex: 6 6 400px;
        border-bottom: 1px solid #464A50;
      }
      
      &--bottom {
        flex: 4 4 250px;
      }
    }

    &__button-block {
      padding: 12px 24px;
      height: 60px;
      background: rgba(35, 61, 64, 0.6);
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

    &__title {
      font-weight: 600;
      &--icon {
        margin-right: 6px;
      }
    }

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
}
</style>