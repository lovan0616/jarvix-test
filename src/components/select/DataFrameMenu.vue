<template>
  <div
    class="data-frame-select-block"
    @mouseleave="isShowMenu = false"
  >
    <div
      class="data-frame-select__title"
      @mouseenter="isShowMenu = true"
    >
      <svg-icon
        v-show="selectedDataName"
        :icon-class="selectedIconType"
        class="data-frame-select__icon"
      />
      <span
        :class="selectedDataName ? null : 'is-empty'"
        class="data-source-title"
      >{{ dataFrameMenuTitle }}</span>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-show="isShowMenu"
        class="data-frame-select__menu"
      >
        <input-block
          v-show="availableDataSourceList.length > 0"
          v-model="filterText"
          :placeholder="$t('editing.searchDataSourceOrDataFrame')"
          class="data-frame-select__filter"
        />
        <!-- 資料源清單 -->
        <ul
          v-show="hasResult"
          class="data-frame-select__menu-datasource"
        >
          <li
            v-for="(dataSource, dataSourceIndex) in availableDataSourceList"
            v-show="dataSource.isShow"
            :key="`dataSource-${dataSourceIndex}`"
            :class="{'is-expanded': dataSource.isExpanded, 'is-current': dataSourceId === dataSource.id}"
            class="menu__item"
          >
            <!-- 資料源名稱 -->
            <div
              class="menu__item-label"
              @click="toggleDataSource(dataSourceIndex)"
            >
              <svg-icon icon-class="data-source" />
              <span class="data-title">{{ dataSource.name }}</span>
              <svg-icon
                icon-class="triangle"
                class="icon-arrow"
              />
            </div>
            <!-- 資料表清單 -->
            <ul
              v-show="dataSource.isExpanded"
              class="data-frame-select__menu-dataframe"
            >
              <li
                v-for="(dataFrame, dataFrameIndex) in dataSource.dataFrames"
                :key="`dataFrame-${dataFrameIndex}`"
                :class="{'is-current': dataSourceId === dataSource.id && dataFrameId === dataFrame.id}"
                class="menu__item"
                @click="handleSelect(dataSourceIndex, dataFrameIndex)"
              >
                <!-- 資料表名稱 -->
                <div class="menu__item-label">
                  <svg-icon
                    icon-class="table"
                    class="data-frame-select__icon"
                  />
                  <span class="data-title">{{ dataFrame.name }}</span>
                  <svg-icon
                    icon-class="checked"
                    class="icon-current"
                  />
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <div
          v-show="!hasResult"
          class="data-frame-select__empty-result"
        >
          {{ $t('editing.emptyKey') }}
        </div>
      </div>
    </transition>
    <button
      v-if="isShowPreviewEntry"
      :disabled="isDisablePreviewDataSource"
      class="preview-datasource-btn"
      @click="togglePreviewDataSource"
    >
      <el-tooltip
        slot="label"
        :content="previewDataSourceTooltipContent"
      >
        <svg-icon
          :class="{ 'preview-datasource-btn__icon--show': isShowPreviewDataSource, 'preview-datasource-btn__icon--disabled': isDisablePreviewDataSource }"
          icon-class="view-data"
          class="preview-datasource-btn__icon"
        />
      </el-tooltip>
    </button>
    <button
      v-if="isShowAdvanceSettingEntry"
      :disabled="isDisableDataFrameAdvanceSetting"
      class="dataframe-setting-btn"
      @click="toggleAdvanceDataFrameSetting"
    >
      <el-tooltip
        slot="label"
        :content="previewDataFrameSettingTooltipContent"
      >
        <svg-icon
          :class="{ 'dataframe-setting-btn__icon--show': isShowSettingBox, 'dataframe-setting-btn__icon--disabled': isDisableDataFrameAdvanceSetting }"
          icon-class="filter-setting"
          class="preview-datasource-btn__icon"
        />
      </el-tooltip>
    </button>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import InputBlock from '@/components/InputBlock'

export default {
  name: 'DataFrameMenu',
  components: {
    InputBlock
  },
  props: {
    // 因應 Dashboard 問問題後不需要轉址
    redirectOnChange: {
      type: Boolean,
      default: true
    },
    isShowPreviewEntry: {
      type: Boolean,
      default: true
    },
    isShowAdvanceSettingEntry: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      isShowMenu: false,
      searchText: '',
      // 存放當前展開的 ds index
      expandDataSourceIndex: []
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList', 'getDataSourceName', 'getDataFrameName']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    },
    selectedDataName () {
      return this.dataFrameId === 'all'
        ? this.getDataSourceName
        : this.getDataFrameName
    },
    selectedIconType () {
      return this.dataFrameId === 'all'
        ? 'data-source'
        : 'table'
    },
    filterText: {
      get () {
        return this.searchText
      },
      set (val) {
        this.searchText = val
        if (val === '') {
          this.initDatasourceExpand()
        } else {
          this.availableDataSourceList.forEach((dataSource, index) => {
            let showDataFrames = dataSource.dataFrames.some(dataFrame => dataFrame.name.toLowerCase().includes(val))
            if (showDataFrames) {
              this.expandDataSourceIndex.push(index)
            }
          })
        }
      }
    },
    availableDataSourceList () {
      const defaultOption = {
        name: this.$t('editing.allDataFrames'),
        id: 'all'
      }

      return this.dataSourceList.filter(dataSource => {
        return dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount
      }).map((dataSource, index) => {
        let showDataSource = true
        let showDataFrames = true
        if (this.filterText !== '') {
          showDataSource = dataSource.name.toLowerCase().includes(this.filterText)
          showDataFrames = dataSource.dataFrames.some(dataFrame => dataFrame.primaryAlias.toLowerCase().includes(this.filterText))
        }

        return {
          ...dataSource,
          isShow: this.filterText === '' ? true : (showDataSource || showDataFrames),
          isExpanded: this.expandDataSourceIndex.includes(index),
          dataFrames: dataSource.dataFrames.reduce((acc, cur) => {
            acc.push({ name: cur.primaryAlias, id: cur.id })
            return acc
          }, [defaultOption])
        }
      })
    },
    dataFrameMenuTitle () {
      if (this.selectedDataName) return this.selectedDataName
      return this.availableDataSourceList.length === 0 ? this.$t('editing.emptyKey') : this.$t('message.switching') + '...'
    },
    getDataSourceIndex () {
      return this.availableDataSourceList.findIndex(dataSource => (
        dataSource.id === this.dataSourceId
      ))
    },
    getDataFrameIndex () {
      if (this.availableDataSourceList.length === 0) return -1
      return this.availableDataSourceList[this.getDataSourceIndex].dataFrames.findIndex(dataFrame => (
        dataFrame.id === this.dataFrameId
      ))
    },
    selectedMenuIndex () {
      if (this.getDataSourceIndex > -1 && this.getDataFrameIndex > -1) {
        return `${this.getDataSourceIndex}-${this.getDataFrameIndex}`
      }
      return null
    },
    isShowPreviewDataSource () {
      return this.$store.state.previewDataSource.isShowPreviewDataSource
    },
    isShowAskHelper () {
      return this.$store.state.isShowAskHelper
    },
    previewDataSourceTooltipContent () {
      return this.isShowPreviewDataSource ? this.$t('bot.closeDataSource') : this.$t('bot.previewDataSource')
    },
    previewDataFrameSettingTooltipContent () {
      if (this.isDisableDataFrameAdvanceSetting) return this.$t('bot.switchSpecificDataFrame')
      return this.isShowSettingBox ? this.$t('bot.closeDataFrameSetting') : this.$t('bot.openDataFrameSetting')
    },
    isDisablePreviewDataSource () {
      return this.availableDataSourceList.length === 0 || !this.dataSourceId
    },
    isDisableDataFrameAdvanceSetting () {
      return this.availableDataSourceList.length === 0 || this.dataFrameId === 'all' || this.dataFrameId === null
    },
    hasResult () {
      return this.availableDataSourceList.some(item => item.isShow)
    }
  },
  mounted () {
    this.initDatasourceExpand()
  },
  methods: {
    ...mapMutations('previewDataSource', ['togglePreviewDataSource']),
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox']),
    initDatasourceExpand () {
      let currentDataSourceIndex = this.availableDataSourceList.findIndex(element => element.id === this.dataSourceId)
      this.expandDataSourceIndex = [currentDataSourceIndex]
    },
    handleSelect (dataSourceIndex, dataFrameIndex) {
      let selectInfo = {
        dataSourceId: this.availableDataSourceList[dataSourceIndex].id,
        dataFrameId: this.availableDataSourceList[dataSourceIndex].dataFrames[dataFrameIndex].id
      }

      // To prevent NavigationDuplicated error
      if (
        selectInfo.dataSourceId === this.dataSourceId &&
        selectInfo.dataFrameId === this.dataFrameId
      ) return

      if (this.filterText) this.filterText = ''
      this.isShowMenu = false
      this.onDataFrameChange(selectInfo.dataSourceId, selectInfo.dataFrameId)
    },
    onDataFrameChange (dataSourceId, dataFrameId) {
      // 避免首頁和預覽的資料集介紹重複打 API 前一隻被取消導致 error
      if (this.isShowPreviewDataSource && this.redirectOnChange) this.togglePreviewDataSource(false)
      this.$store.dispatch('dataSource/changeDataSourceById', { dataSourceId, dataFrameId })
        .then(() => {
          if (!this.redirectOnChange) return
          this.$router.push({
            name: 'PageIndex',
            params: {
              group_id: this.getCurrentGroupId
            },
            query: {
              dataSourceId: dataSourceId,
              dataFrameId: dataFrameId
            }
          })
        })
    },
    togglePreviewDataSource () {
      if (this.isDisablePreviewDataSource) return
      if (this.isShowAskHelper) this.closeHelper()
      this.$store.commit('previewDataSource/togglePreviewDataSource', !this.isShowPreviewDataSource)
    },
    toggleAdvanceDataFrameSetting () {
      if (this.isDisableDataFrameAdvanceSetting) return
      this.toggleSettingBox(!this.isShowSettingBox)
    },
    closeHelper () {
      this.$store.commit('updateAskHelperStatus', false)
    },
    toggleDataSource (targetIndex) {
      if (this.filterText) {
        let expandIndex = this.expandDataSourceIndex.findIndex(el => el === targetIndex)
        if (expandIndex > -1) {
          this.expandDataSourceIndex.splice(expandIndex, 1)
        } else {
          this.expandDataSourceIndex.push(expandIndex)
        }
      } else {
        // accordian 模式
        this.expandDataSourceIndex = this.expandDataSourceIndex.includes(targetIndex) ? [] : [targetIndex]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.data-frame-select-block {
  background-color: rgba(0, 0, 0, 0.55);
  border: 1px solid #292c2e;
  border-radius: 5px;
  display: flex;
  height: 40px;
  line-height: 40px;
  position: relative;
  width: 100%;
  z-index: 1;

  .preview-datasource-btn,
  .dataframe-setting-btn {
    align-items: center;
    background-color: transparent;
    border: unset;
    border-left: 1px solid #292c2e;
    display: flex;
    justify-content: center;
    width: 40px;

    &__icon {
      fill: rgba(255, 255, 255, 0.8);
      font-size: 18px;

      &:hover {
        fill: rgba(255, 255, 255, 1);
      }

      &--show {
        fill: rgba(42, 210, 226, 0.8);

        &:hover {
          fill: #2ad2e2;
        }
      }

      &--disabled {
        fill: rgba(153, 153, 153, 0.8);

        &:hover {
          fill: rgba(153, 153, 153, 1);
        }
      }
    }
  }
}

.data-frame-select {
  &__filter {
    padding: 12px;

    ::v-deep .input {
      background-color: #141c1d;
      border-bottom: none;
      border-radius: 5px;
      font-size: 14px;
      height: 40px;
      padding-bottom: 0;
      padding-left: 12px;

      &::placeholder {
        color: #888;
      }
    }
  }

  &__title {
    align-items: center;
    background: #1d2424;
    display: flex;
    flex: 1;
    font-size: 14px;
    padding-left: 12px;
    width: 0;

    .data-source-title {
      @include text-hidden;

      &.is-empty {
        color: #888;
      }
    }
  }

  &__icon {
    flex-shrink: 0;
  }

  &__menu {
    background-color: #303435;
    border-radius: 5px;
    color: #ccc;
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, 0.5));
    left: -1px;
    position: absolute;
    top: calc(100% + 1px);
    width: 400px;

    &::before {
      border-color: #303435 transparent transparent;
      border-style: solid;
      border-width: 8.5px 6px 0;
      bottom: 100%;
      content: '';
      left: 78px;
      position: absolute;
      transform: rotateZ(-180deg);
    }

    &-datasource {
      max-height: 400px;
      overflow-x: hidden;
      overflow-y: overlay;
      padding-left: 0;
      white-space: nowrap;

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.45);
      }

      &::-webkit-scrollbar-track {
        background-color: #333;
      }

      & > .menu__item {
        line-height: 44px;
        padding-left: 12px;

        &:not(:first-child) {
          border-top: 1px solid #3f4546;
        }

        .icon-arrow {
          font-size: 7px;
          transition: all 0.3s ease;
        }

        &.is-current {
          & > .menu__item-label {
            color: $theme-color-primary;
          }
        }

        &.is-expanded {
          .icon-arrow {
            transform: rotate(180deg);
          }
        }
      }
    }

    &-dataframe {
      padding-left: 0;

      & > .menu__item {
        padding-left: 26px;

        .icon-current {
          visibility: hidden;
        }

        &.is-current {
          .menu__item-label {
            color: $theme-color-primary;

            .icon-current {
              visibility: visible;
            }
          }
        }
      }
    }

    &-datasource,
    &-dataframe {
      list-style: none;
      margin: 0;

      .menu__item {
        cursor: pointer;

        &-label {
          align-items: center;
          color: #ccc;
          display: flex;
          font-size: 14px;
          height: 100%;
          padding-right: 16px;
          width: 100%;

          &:hover {
            color: #fff;
          }

          .data-title {
            flex: 1;
            margin: 0 12px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .svg-icon {
            flex-shrink: 0;
          }
        }
      }
    }
  }

  &__empty-result {
    color: #aaa;
    font-size: 14px;
    line-height: 6;
    text-align: center;
  }
}

</style>
