<template>
  <div class="data-source-select-block">
    <svg-icon 
      icon-class="folder" 
      class="data-source-select-icon"/>
    <sy-select 
      :selected="dataSourceId"
      :items="buildDataSourceList"
      :placeholder="$t('editing.chooseDataSource')"
      class="data-source-select"
      @update:selected="onDataSourceChange"
    />
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
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { mapGetters } from 'vuex'

export default {
  name: 'DataSourceSelect',
  components: {
    SySelect
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    ...mapGetters('dataSource', ['dataSourceList']),
    // 過濾掉正在 build 的 bookmark
    buildDataSourceList () {
      return this.dataSourceList.filter(dataSource => {
        return dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount
      })
    },
    isShowPreviewDataSource () {
      return this.$store.state.previewDataSource.isShowPreviewDataSource
    },
    previewDataSourceTooltipContent () {
      return this.isShowPreviewDataSource ? this.$t('bot.closeDataSource') : this.$t('bot.previewDataSource')
    }
  },
  methods: {
    onDataSourceChange (dataSourceId) {
      this.$store.dispatch('dataSource/changeDataSourceById', {dataSourceId})
        .then(() => {
          if (this.$route.name !== 'PageIndex') this.$router.push('/')
        })
    },
    togglePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', !this.isShowPreviewDataSource)
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-select-block {
  display: inline-block;
  position: relative;
  background-color: #233131;
  color: #fff;
  border-radius: 4px;

  .data-source-select-icon {
    position: absolute;
    top: 10px;
    left: 8px;
  }

  .preview-datasource-btn {
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #3E4B4B;

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

  /deep/ .el-select {
    flex: 1;
  }
}
</style>
<style lang="scss">
.data-source-select.sy-select.theme-default {
  .el-input__inner {
    padding-left: 36px;
  }
}
</style>
