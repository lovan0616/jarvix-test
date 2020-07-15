<template>
  <div class="data-frame-select">
    <el-menu 
      class="data-frame-select__menu"
      @select="handleSelect">
      <el-submenu index="1">
        <template slot="title" >
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
    </el-menu>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'DataFrameMenu',
  components: {
    SySelect
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    ...mapState('previewDataSource', ['isShowPreviewDataSource']),
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

    }
  }
}
</script>
<style lang="scss" scoped>
.data-frame-select {
  display: inline-block;
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 36px;
  line-height: 36px;
  color: #fff;
  background-color: #233131;

  &__icon {
    position: absolute;
    top: 10px;
    left: 14px;
  }

  &__menu {
    width: 100%;

    .submenu__data-source-title {
      padding-left: 16px;
      margin-right: 4px;

      & + .el-submenu__icon-arrow {
        right: unset;
      }
    }

    .submenu__data-frame-title {
      padding-left: 33px;
    }
  }
  
  /deep/ .el-menu {
    border-right: unset;

    &.el-menu--inline {
      max-height: 218px;
      overflow-y: auto;
      background-color: #233131;
      z-index: 999;
    }

    .el-submenu__title {
      padding: 0 !important;
      height: 36px;
      line-height: 36px;
      color: #fff;
      background-color: #233131;
      
      &:not(:last-child) {
        border-bottom: 1px solid #555555;;
      }
    }
  }
}

</style>