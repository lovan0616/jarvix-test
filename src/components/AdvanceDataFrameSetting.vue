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
      class="filter-block--top"
    />
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
      font-weight: 600;

      &--icon {
        margin-right: 6px;
      }
    }

    &__action-box {
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
  }
}
</style>