<template>
  <div class="data-frame-select-block">
    <el-menu
      mode="horizontal"
      class="data-frame-select__menu"
      background-color="#1E2122"
      text-color="#CCC"
      @select="handleSelect">
      <el-submenu 
        v-if="availableDataSourceList.length > 0" 
        popper-class="data-frame-select__popper"
        index="1">
        <template slot="title" >
          <svg-icon 
            :icon-class="selectedIconType" 
            class="data-frame-select__icon"/>
          <span class="data-source-title">{{ selectedDataName }}</span>
        </template>
        <div 
          v-for="(dataSource, dataSourceIndex) in availableDataSourceList"
          :key="'dataSource' + dataSourceIndex">
          <el-submenu 
            :index="'1-' + dataSourceIndex" 
            class="data-frame-select__submenu">
            <template slot="title">
              <svg-icon 
                icon-class="data-source" 
                class="data-frame-select__icon"/>
              <span class="data-source-title">{{ dataSource.name }}</span>
            </template>
            <div 
              v-for="(dataFrame, dataFrameIndex) in dataSource.dataFrames"
              :key="'dataFrame' + dataFrameIndex">
              <el-menu-item :index="dataSourceIndex + '-' + dataFrameIndex">
                <template slot="title">
                  <svg-icon 
                    icon-class="table" 
                    class="data-frame-select__icon"/>
                  <span class="data-frame-title">{{ dataFrame.name }}</span>
                </template>
              </el-menu-item>
            </div>
          </el-submenu>
        </div>
      </el-submenu>
      <el-submenu 
        v-else 
        index="2">
        <template slot="title" >
          <span class="submenu__data-source-title">{{ $t('editing.emptyKey') }}</span>
        </template>
      </el-submenu>
    </el-menu>
    <button 
      class="preview-datasource-btn"
      @click="togglePreviewDataSource"
    >
      <el-tooltip
        slot="label"
        :content="previewDataSourceTooltipContent"
      >
        <svg-icon 
          :class="{'preview-datasource-btn__icon--show': isShowPreviewDataSource}"
          icon-class="view-data"
          class="preview-datasource-btn__icon"/>
      </el-tooltip>
    </button>
    <button
      :disabled="isSelectedAllDataFrame" 
      class="dataframe-setting-btn"
      @click="toggleBasicDataFrameSetting"
    >
      <el-tooltip
        slot="label"
        :content="previewDataFrameSettingTooltipContent"
      >
        <svg-icon 
          :class="{'dataframe-setting-btn__icon--show': isShowBasicDataFrameSetting, 'dataframe-setting-btn__icon--disabled': isSelectedAllDataFrame}"
          icon-class="filter-setting"
          class="preview-datasource-btn__icon"/>
      </el-tooltip>
    </button>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DataFrameMenu',
  data () {
    return {
      selectInfo: {}
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList', 'getDataSourceName', 'getDataFrameName']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    },
    selectedDataName () {
      return this.getDataFrameName === 'all' 
        ? this.getDataSourceName
        : this.getDataFrameName
    },
    selectedIconType () {
      return this.selectInfo.dataFrameId === 'all' || Object.entries(this.selectInfo).length === 0
        ? 'data-source' 
        : 'table'
    },
    buildDataSourceList () {
      return this.dataSourceList.filter(dataSource => {
        return dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount
      })
    },
    availableDataSourceList () {
      const defaultOption = {
        name: this.$t('editing.allDataFrames'),
        id: 'all'
      }
      return this.buildDataSourceList.map(dataSource => {
        return {
          ...dataSource,
          dataFrames: dataSource.dataFrames.reduce((acc, cur) => {
            acc.push({name: cur.primaryAlias, id: cur.id})
            return acc
          }, [defaultOption])
        }
      })
    },
    isShowPreviewDataSource () {
      return this.$store.state.previewDataSource.isShowPreviewDataSource
    },
    isShowBasicDataFrameSetting () {
      return this.$store.state.isShowBasicDataFrameSetting
    },
    previewDataSourceTooltipContent () {
      return this.isShowPreviewDataSource ? this.$t('bot.closeDataSource') : this.$t('bot.previewDataSource')
    },
    previewDataFrameSettingTooltipContent () {
      if (this.isSelectedAllDataFrame) return this.$t('bot.switchSpecificDataFrame') 
      return this.isShowBasicDataFrameSetting ? this.$t('bot.closeDataFrameSetting') : this.$t('bot.openDataFrameSetting')
    },
    isSelectedAllDataFrame () {
      return this.selectInfo.dataFrameId === 'all'
    },
  },
  methods: {
    ...mapMutations('previewDataSource', ['togglePreviewDataSource']),
    handleSelect (key, keyPath) {
      let selectKey = keyPath[2].split('-')
      const dataSourceIndex = selectKey[0]
      const dataFrameIndex = selectKey[1]
      this.selectInfo = {
        dataSourceId: this.availableDataSourceList[dataSourceIndex].id,
        dataFrameId: this.availableDataSourceList[dataSourceIndex].dataFrames[dataFrameIndex].id
      }
      this.onDataFrameChange(this.selectInfo.dataSourceId, this.selectInfo.dataFrameId)
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
      this.$store.commit('previewDataSource/togglePreviewDataSource', !this.isShowPreviewDataSource)
    },
    toggleBasicDataFrameSetting () {
      this.$store.commit('updateBasicDataFrameSettingStatus', !this.isShowBasicDataFrameSetting)
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

  /deep/ .el-submenu {
    width: 100%;

    .el-submenu__title {
      display: flex;
      align-items: center;
      height: 38px;
      line-height: 38px;
      padding: 0 30px 0 10px;
      border-radius: 5px 0 0 5px;
    }

    .data-frame-select__icon {
      margin-right: 6px;
    }

    .data-source-title {
      flex: 1;
      width: 100%;
      @include text-hidden;
    } 
  }

  /deep/ .is-opened {
    .el-submenu__title {
      background-color: #1D2424 !important; 
    }
  }
}

.el-menu--horizontal {
  flex: auto;
  border-bottom: unset;
  border-radius: 5px;
  max-width: 162px;
}

</style>