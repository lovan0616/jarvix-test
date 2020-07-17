<template>
  <div class="setting__wrapper">
    <span 
      class="setting__close-icon" 
      @click="closeAdvanceDataFrameSetting">
      <svg-icon icon-class="close"/>
    </span>
    <div class="filter-block filter-block--top">
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
              @keyup="searchColumn"
            >
          </div>
        </div>
        <div class="filter-block__action-box">
          <a 
            href="javascript:void(0);" 
            class="link filter-block__action-box--link"
            @click="selectAllColumns"
          >{{ $t('dataFrameAdvanceSetting.selectAll') }}</a>
          <a 
            href="javascript:void(0);" 
            class="link filter-block__action-box--link"
            @click="clearAllColumns"
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
    <filter-info 
      :temp-filter-list.sync="tempFilterList"
      class="filter-block--bottom" 
    />
    <div class="setting__button-block">
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
import FilterInfo from './display/FilterInfo'

export default {
  name: 'AdvanceDataFrameSetting',
  components: {
    FilterInfo,
    Message
  },
  data () {
    return {
      isLoading: true,
      tempColumnList: [],
      tempFilterList: [],
      searchedColumn: ''
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox', 'columnList', 'isInit']),
    ...mapState('dataSource', ['filterList']),
  },
  watch: {
    columnList (newList, oldList) {
      this.tempColumnList = newList
    },
    filterList (newList, oldList) {
      this.tempFilterList = newList
    },
    '$route.query.dataFrameId'(value) {
      if (!value) return
      if (value === 'all') return this.closeAdvanceDataFrameSetting()
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
    fetchDataColumns (dataFrameId) {
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
          const formatedColumnList = data.map(column => ({
            ...column,
            isSelected: true
          }))
          this.setColumnList(formatedColumnList)
          this.toggleIsInit(true)
          this.isLoading = false
        })
        .catch(error => this.isLoading = false)
    },
    closeAdvanceDataFrameSetting () {
      this.toggleSettingBox(false)
    },
    searchColumn () {
      
    },
    selectAllColumns () {
      this.tempColumnList = this.tempColumnList.map(column => {
        return ({
          ...column,
          isSelected: true
        })
      })
    },
    clearAllColumns () {
      this.tempColumnList = this.tempColumnList.map(column => {
        return ({
          ...column,
          isSelected: false
        })
      })
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
    isShowColumn (column) {
      const columnName = column.name.toLowerCase()
      const searchedColumn = this.searchedColumn.toLowerCase()
      return columnName.includes(searchedColumn)
    }
  },
}
</script>

<style lang="scss" scoped>
.setting__wrapper {
  position: absolute;
  top: $header-height + $chat-room-height;
  left: 0;
  min-height: calc(100vh - #{$header-height + $chat-room-height});
  width: $basic-df-setting-width;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.55);;
  border: 1px solid #2B3638;
  flex-direction: column;
  flex: 1;

  .setting {
    &__close-icon {
      position: absolute;
      top: 18px;
      right: 24px;
      color: #0CD1DE;
      cursor: pointer;
    }

    &__button-block {
      padding: 16px 24px;

      .btn {
        width: 100%;
      }
    }
  }

  /deep/ .filter-block {
    max-height: 350px;
    padding: 16px 24px;
    border-bottom: 1px solid #464A50;
    display: flex;
    flex-direction: column;

    &--top {
      flex: 6 6 auto;
      min-height: 400px
    }

    &--bottom {
      flex: 4 4 auto;
      min-height: 250px
    }

    &__title {
      padding-bottom: 18px;
      font-weight: 600;

      &--icon {
        color: #0CD1DE;
        margin-right: 6px;
      }
    }

    &__search-box {
      padding-bottom: 12px;
    }

    &__action-box {
      padding-bottom: 16px;
      &--link {
        font-weight: 600;
        &:not(:last-of-type) {
          margin-right: 8px;
        }
      }
    }

    &__select-box {
      overflow: auto;
      &--checkbox {
        margin-bottom: 8px;
      }

      &--checkbox-list {
        display: block;
        overflow: auto;
      }

      &--checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;

        .checkbox-group {
          margin-right: 11px;
        }
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
}
</style>