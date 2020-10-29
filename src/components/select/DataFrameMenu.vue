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
        :icon-class="selectedIconType"
        class="data-frame-select__icon"/>
      <span class="data-source-title">{{ selectedDataName }}</span>
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
              <svg-icon icon-class="data-source"/>
              <span class="data-title">{{ dataSource.name }}</span>
              <svg-icon
                icon-class="triangle"
                class="icon-arrow"/>
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
                    class="data-frame-select__icon"/>
                  <span class="data-title">{{ dataFrame.name }}</span>
                  <svg-icon
                    icon-class="checked"
                    class="icon-current"/>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <div
          v-show="!hasResult"
          class="data-frame-select__empty-result"
        >{{ $t('resultDescription.noData') }}</div>
      </div>
    </transition>
    <button 
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
          class="preview-datasource-btn__icon"/>
      </el-tooltip>
    </button>
    <button
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
          class="preview-datasource-btn__icon"/>
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
  data: () => {
    return {
      isShowMenu: false,
      filterText: '',
      availableDataSourceList: []
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
    getDataSourceIndex() {
      return this.availableDataSourceList.findIndex(dataSource => (
        dataSource.id === this.dataSourceId
      ))
    },
    getDataFrameIndex() {
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
  watch: {
    filterText (newVal, oldVal) {
      if (newVal === oldVal) return
      this.filterMenu()
    }
  },
  mounted () {
    this.formatMenuList()
  },
  methods: {
    ...mapMutations('previewDataSource', ['togglePreviewDataSource']),
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox']),
    formatMenuList () {
      const defaultOption = {
        name: this.$t('editing.allDataFrames'),
        id: 'all'
      }
      let buildDataSourceList = this.dataSourceList.filter(dataSource => {
        return dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount
      })

      this.availableDataSourceList = buildDataSourceList.map(dataSource => {
        return {
          ...dataSource,
          isShow: true,
          isExpanded: false,
          dataFrames: dataSource.dataFrames.reduce((acc, cur) => {
            acc.push({ name: cur.primaryAlias, id: cur.id })
            return acc
          }, [defaultOption])
        }
      })
    },
    handleSelect (dataSourceIndex, dataFrameIndex) {
      let selectInfo = {
        dataSourceId: this.availableDataSourceList[dataSourceIndex].id,
        dataFrameId: this.availableDataSourceList[dataSourceIndex].dataFrames[dataFrameIndex].id
      }
      
      // To prevent NavigationDuplicated error
      if (
        selectInfo.dataSourceId === this.dataSourceId
        && selectInfo.dataFrameId === this.dataFrameId
      ) return
      
      this.isShowMenu = false
      this.onDataFrameChange(selectInfo.dataSourceId, selectInfo.dataFrameId)
    },
    onDataFrameChange (dataSourceId, dataFrameId) {
      // 避免首頁和預覽的資料集介紹重複打 API 前一隻被取消導致 error
      if (this.isShowPreviewDataSource) this.togglePreviewDataSource(false)
      this.$store.dispatch('dataSource/changeDataSourceById', { dataSourceId, dataFrameId })
      .then(() => {
        this.$router.push({
          name: 'PageIndex', 
          params: { 
            'group_id': this.getCurrentGroupId
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
    filterMenu () {
      if (!this.filterText) return this.resetMenu()

      const loweredText = this.filterText
      this.availableDataSourceList.forEach(dataSource => {
        const showDataSource = dataSource.name.toLowerCase().includes(loweredText)
        const showDataFrames = dataSource.dataFrames.some(dataFrame => dataFrame.name.toLowerCase().includes(loweredText))

        dataSource.isShow = showDataSource || showDataFrames
        dataSource.isExpanded = showDataFrames
      })
    },
    resetMenu () {
      this.availableDataSourceList.forEach(item => {
        item.isShow = true
        item.isExpanded = false
      })
    },
    toggleDataSource (index) {
      this.availableDataSourceList[index].isExpanded = !this.availableDataSourceList[index].isExpanded
    }
  }
}
</script>
<style lang="scss" scoped>
.data-frame-select-block {
  display: flex;
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  border: 1px solid #292C2E;
  background-color: rgba(0, 0, 0, 0.55);

  .preview-datasource-btn, .dataframe-setting-btn {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: unset;
    border-left: 1px solid #292C2E;
    background-color: transparent;
  
    &__icon {
      font-size: 18px;
      fill: rgba(255, 255, 255, .8);

      &:hover {
        fill: rgba(255, 255, 255, 1);
      }

      &--show {
        fill: rgba(42, 210, 226, .8);

        &:hover {
          fill: #2AD2E2;
        }
      }

      &--disabled {
        fill: rgba(153, 153, 153, .8);

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
    /deep/ .input {
      height: 40px;
      font-size: 14px;
      background-color: #141C1D;
      padding-left: 12px;
      padding-bottom: 0;
      border-bottom: none;
      border-radius: 5px;
      &::placeholder {
        color: #888;
      }
    }
  }
  &__title {
    flex: 1;
    padding-left: 12px;
    font-size: 14px;
    display: flex;
    align-items: center;
    .data-source-title {
      @include text-hidden;
    }
  }
  &__icon {
    flex-shrink: 0;
  }
  &__menu {
    width: 300px;
    position: absolute;
    top: calc(100% + 1px);
    left: -1px;
    color: #CCC;
    background-color: #303435;
    border-radius: 5px;
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 78px;
      border-style: solid;
      border-width: 8.5px 6px 0 6px;
      border-color: #303435 transparent transparent transparent;
      transform: rotateZ(-180deg);
    }

    &-datasource {
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
      white-space: nowrap;
      padding-left: 0;
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, .45);
      }
      &::-webkit-scrollbar-track {
        background-color: #333;
      }
      &>.menu__item {
        line-height: 44px;
        padding-left: 12px;
        &:not(:first-child) {
          border-top: 1px solid #3F4546;
        }
        .icon-arrow {
          font-size: 10px;
          transition: all .3s ease;
        }
        &.is-current {
          &>.menu__item-label {
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
      &>.menu__item {
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
    &-datasource, &-dataframe {
      margin: 0;
      list-style: none;
      .menu__item {
        cursor: pointer;
        &-label {
          font-size: 14px;
          color: #CCC;
          display: flex;
          // justify-content: flex-start;
          align-items: center;
          padding-right: 12px;
          width: 100%;
          height: 100%;
          &:hover {
            color: #FFF;
          }
          .data-title {
            flex: 1;
            margin: 0 12px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .svg-icon {
            flex-shrink: 0;
          }
        }
      }
    }
  }
  &__empty-result {
    font-size: 14px;
    text-align: center;
    line-height: 6;
    margin-bottom: 12px;
    color: #AAA;
  }
}

</style>