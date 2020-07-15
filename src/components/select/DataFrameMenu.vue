<template>
  <div class="data-frame-select-block">
    <el-menu
      mode="horizontal"
      class="data-frame-select__menu"
      background-color="#1E2122"
      text-color="#CCC"
      @select="handleSelect">
      <el-submenu 
        v-if="buildDataSourceList.length > 0" 
        popper-class="data-frame-select__popper"
        index="1">
        <template slot="title" >
          <svg-icon 
            icon-class="data-source" 
            class="data-frame-select__icon"/>
          <span class="submenu__data-source-title">{{ selectedDataSource }}</span>
        </template>
        <div 
          v-for="(dataSource, idx) in buildDataSourceList"
          :key="idx">
          <el-submenu 
            :index="'1-'+idx" 
            class="data-frame-select__submenu">
            <template slot="title">
              <svg-icon 
                icon-class="data-source" 
                class="data-frame-select__icon"/>
              <span class="submenu__data-frame-title">{{ dataSource.name }}</span>
            </template>
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
    <a 
      href="javascript:void(0)" 
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
    </a>
    <a 
      href="javascript:void(0)" 
      class="filter-setting-btn"
      @click="toggleBasicDataFrameSetting"
    >
      <el-tooltip
        slot="label"
        :content="previewDataSourceTooltipContent"
      >
        <svg-icon 
          :class="{'preview-datasource-btn__icon--show': isShowBasicDataFrameSetting}"
          icon-class="filter-setting"
          class="preview-datasource-btn__icon"/>
      </el-tooltip>
    </a>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DataFrameMenu',
  components: {
    SySelect
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    },
    selectedDataSource () {
      return this.buildDataSourceList[0].name
    },
    buildDataSourceList () {
      return this.dataSourceList.filter(dataSource => {
        return dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount
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
    availableDataFrames () {
      const dataFrameList = this.$store.state.dataSource.dataFrameList
      if (dataFrameList.length === 0) return []
      const defaultOption = {
        name: this.$t('editing.allDataFrames'),
        id: 'all'
      }
      return dataFrameList.reduce((acc, cur) => {
        if (cur.state !== 'Enable') return acc
        acc.push({name: cur.primaryAlias, id: cur.id})
        return acc
      }, [defaultOption])
    }
  },
  methods: {
    ...mapMutations('previewDataSource', ['togglePreviewDataSource']),
    onDataFrameChange (dataFrameId) {
      // 避免首頁和預覽的資料集介紹重複打 API 前一隻被取消導致 error
      if (this.isShowPreviewDataSource) this.togglePreviewDataSource(false)
      this.$store.dispatch('dataSource/changeDataFrameById', dataFrameId)
      .then(() => {
        this.$router.push({ 
          name: 'PageIndex', 
          params: { 
            'group_id': this.getCurrentGroupId
          },
          query: {
            dataSourceId: this.$route.query.dataSourceId,
            dataFrameId
          }
        })
      })
    },
    handleSelect () {

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

  .preview-datasource-btn, .filter-setting-btn {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #292C2E;
  
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
    }
  }
  
  /deep/ .el-submenu {
    width: 100%;

    .el-submenu__title {
      display: flex;
      align-items: center;
      height: 40px;
      line-height: 40px;
      background-color: transparent !important;
    }

    .data-frame-select__icon {
      margin-right: 6px;
    }

    .submenu__data-source-title {
      flex: 1;
      width: 100%;
      @include text-hidden;
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