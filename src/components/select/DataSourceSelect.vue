<template>
  <div class="data-source-select-block">
    <svg-icon
      icon-class="folder"
      class="data-source-select-icon"
    />
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
          class="preview-datasource-btn__icon"
        />
      </el-tooltip>
    </a>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'DataSourceSelect',
  components: {
    SySelect
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    ...mapState('previewDataSource', ['isShowPreviewDataSource']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    // 過濾掉正在 build 的 dataSource
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
    ...mapMutations('previewDataSource', ['togglePreviewDataSource']),
    onDataSourceChange (dataSourceId) {
      // 避免首頁和預覽的資料集介紹重複打 API 前一隻被取消導致 error
      if (this.isShowPreviewDataSource) this.togglePreviewDataSource(false)
      this.$store.dispatch('dataSource/changeDataSourceById', { dataSourceId })
        .then(() => {
          this.$router.push({
            name: 'PageIndex',
            params: {
              group_id: this.getCurrentGroupId
            },
            query: {
              dataSourceId: this.dataSourceId,
              dataFrameId: 'all'
            }
          })
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
    left: 14px;
  }

  .preview-datasource-btn {
    width: 40px;
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

  ::v-deep .el-select {
    flex: 1;
  }
}
</style>
<style lang="scss">
.data-source-select.sy-select.theme-default {
  .el-input__inner {
    padding-left: 42px;
  }
  .el-input__icon {
    width: 40px;
  }
}
</style>
